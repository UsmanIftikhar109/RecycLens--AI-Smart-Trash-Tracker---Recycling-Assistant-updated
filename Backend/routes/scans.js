const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Scan = require('../models/Scan');
const User = require('../models/User');

/**
 * POST /api/scans - Create a new scan (protected)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { itemName, material, isRecyclable, confidence, icon, notes } = req.body;
    
    const scan = new Scan({
      userId: req.userId,
      itemName,
      material,
      isRecyclable,
      confidence: confidence || 0.95,
      icon: icon || '♻️',
      notes,
    });
    
    await scan.save();
    
    // Update user's scan count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { scansCount: 1 }
    });
    
    res.status(201).json({ 
      message: 'Scan created successfully',
      scan 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating scan',
      error: error.message 
    });
  }
});

/**
 * GET /api/scans - List user's scans with filtering (protected)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { material, isRecyclable, limit = 20, skip = 0 } = req.query;
    
    const filter = { userId: req.userId };
    
    if (material) filter.material = material;
    if (isRecyclable !== undefined) filter.isRecyclable = isRecyclable === 'true';
    
    const scans = await Scan.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));
    
    const total = await Scan.countDocuments(filter);
    
    res.json({ 
      scans,
      total,
      count: scans.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching scans',
      error: error.message 
    });
  }
});

/**
 * GET /api/scans/:id - Get single scan (protected)
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    // Verify ownership
    if (scan.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json({ scan });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching scan',
      error: error.message 
    });
  }
});

/**
 * DELETE /api/scans/:id - Delete a scan (protected)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    // Verify ownership
    if (scan.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Scan.findByIdAndDelete(req.params.id);
    
    // Decrement user's scan count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { scansCount: -1 }
    });
    
    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting scan',
      error: error.message 
    });
  }
});

/**
 * GET /api/scans/stats - Get user's scan statistics (protected)
 */
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const totalScans = await Scan.countDocuments({ userId: req.userId });
    
    const recyclableScans = await Scan.countDocuments({ 
      userId: req.userId,
      isRecyclable: true 
    });
    
    // Group by material
    const byMaterial = await Scan.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$material', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    
    res.json({
      totalScans,
      recyclableScans,
      nonRecyclableScans: totalScans - recyclableScans,
      byMaterial,
      recyclablePercentage: totalScans > 0 ? Math.round((recyclableScans / totalScans) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching statistics',
      error: error.message 
    });
  }
});

module.exports = router;
