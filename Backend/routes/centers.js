const express = require('express');
const router = express.Router();
const Center = require('../models/Center');

/**
 * GET /api/centers - List centers with optional search
 */
router.get('/', async (req, res) => {
  try {
    const { search, material, limit = 50, skip = 0 } = req.query;
    
    const filter = { isOpen: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (material) {
      filter.accepts = material;
    }
    
    const centers = await Center.find(filter)
      .sort({ distance: 1 })
      .limit(Number(limit))
      .skip(Number(skip));
    
    const total = await Center.countDocuments(filter);
    
    res.json({ 
      centers,
      total,
      count: centers.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching centers',
      error: error.message 
    });
  }
});

/**
 * GET /api/centers/:id - Get single center
 */
router.get('/:id', async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    res.json({ center });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching center',
      error: error.message 
    });
  }
});

module.exports = router;
