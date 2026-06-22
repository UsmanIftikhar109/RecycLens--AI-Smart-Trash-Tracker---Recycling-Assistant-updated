const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Scan = require('../models/Scan');
const bcrypt = require('bcryptjs');

/**
 * GET /api/profile - Get current user profile + stats (protected)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's scan stats
    const totalScans = await Scan.countDocuments({ userId: req.userId });
    const recyclableScans = await Scan.countDocuments({ 
      userId: req.userId,
      isRecyclable: true 
    });
    
    res.json({ 
      user: {
        ...user.toObject(),
        stats: {
          totalScans,
          recyclableScans,
          nonRecyclableScans: totalScans - recyclableScans,
          recyclablePercentage: totalScans > 0 ? Math.round((recyclableScans / totalScans) * 100) : 0,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
});

/**
 * PUT /api/profile - Update name, email, phone (protected)
 */
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        ...(fullName && { fullName }),
        ...(phone && { phone }),
      },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
});

/**
 * PUT /api/profile/password - Change password (protected)
 */
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }
    
    const user = await User.findById(req.userId);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error changing password',
      error: error.message 
    });
  }
});

/**
 * DELETE /api/profile/history - Clear all scan history (protected)
 */
router.delete('/history', authMiddleware, async (req, res) => {
  try {
    const result = await Scan.deleteMany({ userId: req.userId });
    
    // Reset user's scan count
    await User.findByIdAndUpdate(req.userId, {
      scansCount: 0
    });
    
    res.json({ 
      message: 'Scan history cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error clearing history',
      error: error.message 
    });
  }
});

module.exports = router;
