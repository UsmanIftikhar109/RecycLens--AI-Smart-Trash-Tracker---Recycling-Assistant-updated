const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');

/**
 * GET /api/tips?item=plastic - Get tips for an item type
 */
router.get('/', async (req, res) => {
  try {
    const { item, limit = 10 } = req.query;
    
    const filter = {};
    if (item) {
      filter.itemType = { $regex: item, $options: 'i' };
    }
    
    const tips = await Tip.find(filter).limit(Number(limit));
    
    res.json({ 
      tips,
      count: tips.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching tips',
      error: error.message 
    });
  }
});

module.exports = router;
