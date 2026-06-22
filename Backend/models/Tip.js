const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      required: true,
    },
    content: String,
    steps: [String],
    reuseIdeas: [
      {
        idea: String,
        description: String,
      },
    ],
    tips: [String],
    icon: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tip', tipSchema);
