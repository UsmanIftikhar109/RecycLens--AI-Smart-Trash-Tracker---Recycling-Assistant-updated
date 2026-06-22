const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Tip = require('../models/Tip');

// Import Gemini AI SDK
let generative;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  generative = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
} catch (error) {
  console.log('Gemini AI not available - using fallback responses');
}

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

/**
 * POST /api/tips/chat - AI chat endpoint with Gemini
 * Protected route
 */
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    let response;
    
    // Use Gemini API if available
    if (generative && process.env.GEMINI_API_KEY) {
      try {
        const model = generative.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const systemPrompt = `You are an eco-friendly recycling assistant called RecycLens. 
        Help users understand how to recycle items, what materials can be recycled, 
        environmental tips, and zero-waste practices. Keep responses concise (2-3 sentences) 
        and encouraging. Focus on practical advice.`;
        
        const result = await model.generateContent([
          { text: systemPrompt },
          { text: `User: ${message}` },
        ]);
        
        response = result.response.text();
      } catch (error) {
        console.error('Gemini API error:', error);
        response = getFallbackResponse(message);
      }
    } else {
      response = getFallbackResponse(message);
    }
    
    res.json({ 
      message: response,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error processing chat',
      error: error.message 
    });
  }
});

/**
 * Fallback response generator when Gemini is not available
 */
function getFallbackResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  const responses = {
    plastic: "Great question! Most plastics marked 1-7 can be recycled. Rinse containers before recycling and remove lids. Consider reusing plastic bags as trash liners or for storage.",
    glass: "Glass is 100% recyclable! Rinse glass containers and separate by color if your facility requires it. Avoid breaking glass, and keep it separate from mixed materials.",
    paper: "Paper and cardboard are highly recyclable. Flatten boxes to save space, and keep paper dry. Avoid glossy papers and tissues as they're harder to process.",
    metal: "Metal is infinitely recyclable! Aluminum and steel are the most valuable. Rinse cans and crushing them saves storage space. Metal is always welcome at recycling centers.",
    electronics: "E-waste is valuable and hazardous. Never throw electronics in regular trash. Find e-waste recycling programs through your local waste management or electronics retailers.",
    compost: "Compost food scraps and yard waste to reduce landfill waste. You need brown materials (dried leaves, paper) and green materials (food scraps, grass).",
    default: "That's a great recycling question! Remember to rinse items, sort by material type, and find your local recycling guidelines. Every item recycled makes a difference for our planet! ♻️"
  };
  
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return responses.default;
}

module.exports = router;
