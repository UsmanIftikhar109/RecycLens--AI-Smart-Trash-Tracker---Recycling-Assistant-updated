require('dotenv').config();
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Center = require('./models/Center');
const Tip = require('./models/Tip');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Center.deleteMany({});
    await Tip.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed recycling centers
    const centers = [
      {
        name: 'Green Earth Recycling Center',
        address: '123 Eco Street, Green City, GC 12345',
        phone: '555-0001',
        accepts: ['plastic', 'glass', 'paper', 'metal', 'cardboard'],
        isOpen: true,
        hours: 'Mon-Sat 8AM-6PM',
        distance: 2.3,
        location: { lat: 40.7128, lng: -74.0060 },
      },
      {
        name: 'Metro Waste Management',
        address: '456 Sustainability Ave, Eco City, EC 54321',
        phone: '555-0002',
        accepts: ['plastic', 'metal', 'electronics'],
        isOpen: true,
        hours: 'Mon-Fri 9AM-5PM',
        distance: 5.1,
        location: { lat: 40.7580, lng: -73.9855 },
      },
      {
        name: 'Community Compost Hub',
        address: '789 Nature Lane, Clean Town, CT 98765',
        phone: '555-0003',
        accepts: ['compost', 'paper', 'cardboard', 'organic'],
        isOpen: true,
        hours: 'Daily 7AM-7PM',
        distance: 3.7,
        location: { lat: 40.7489, lng: -73.9680 },
      },
      {
        name: 'Tech E-Waste Solutions',
        address: '321 Innovation Drive, Tech City, TC 11111',
        phone: '555-0004',
        accepts: ['electronics', 'metal', 'plastic'],
        isOpen: true,
        hours: 'Tue-Sat 10AM-4PM',
        distance: 7.2,
        location: { lat: 40.7614, lng: -73.9776 },
      },
    ];

    await Center.insertMany(centers);
    console.log('✅ Seeded 4 recycling centers');

    // Seed recycling tips
    const tips = [
      {
        itemType: 'Plastic Bottles',
        icon: '🍾',
        content: 'Plastic bottles are one of the most recyclable items. Always rinse them before recycling.',
        steps: [
          'Rinse the bottle with water',
          'Remove the cap (if recyclable)',
          'Place in the plastic recycling bin',
          "Ensure it's clean and dry",
        ],
        reuseIdeas: [
          { idea: 'Planter', description: 'Cut the bottle in half to create a plant container' },
          { idea: 'Storage', description: 'Use as a storage container for small items' },
          { idea: 'Bird Feeder', description: 'Fill with seeds to make a DIY bird feeder' },
        ],
        tips: [
          'Crush bottles to save space in the recycling bin',
          'Most plastics marked 1-7 can be recycled',
          'Check with your local facility for specific guidelines',
        ],
      },
      {
        itemType: 'Glass Jars',
        icon: '🏺',
        content: 'Glass is infinitely recyclable and should be kept separate from mixed materials.',
        steps: [
          'Empty and rinse the jar',
          'Remove any labels or stickers',
          'Sort by color if your facility requires it',
          'Place in glass recycling container',
        ],
        reuseIdeas: [
          { idea: 'Storage', description: 'Perfect for storing bulk items or leftover food' },
          { idea: 'Decoration', description: 'Paint and decorate for home décor' },
          { idea: 'Propagation', description: 'Root cuttings in water for propagating plants' },
        ],
        tips: [
          'Never break glass bottles before recycling',
          'Leave glass separate from other recyclables',
          '100% of glass is recyclable',
        ],
      },
      {
        itemType: 'Cardboard Boxes',
        icon: '📦',
        content: 'Cardboard is highly recyclable. Flatten boxes to save space and make transport easier.',
        steps: [
          'Remove all packing materials and tape',
          'Flatten the box',
          'Break down into manageable pieces',
          'Tie with string if bundling together',
        ],
        reuseIdeas: [
          { idea: 'Storage', description: 'Use for organizing items in your home or garage' },
          { idea: 'Shipping', description: 'Reuse for shipping your own items' },
          { idea: 'Moving', description: 'Save for future moves or donations' },
        ],
        tips: [
          'Keep cardboard dry before recycling',
          'Avoid waxed or heavily contaminated cardboard',
          'Bundle similar boxes together',
        ],
      },
      {
        itemType: 'Aluminum Cans',
        icon: '🥫',
        content: "Aluminum is the most valuable and infinitely recyclable metal. It's highly sought after.",
        steps: [
          'Rinse the can',
          'Remove any stuck labels',
          'Crush to save space if desired',
          'Place in metal recycling bin',
        ],
        reuseIdeas: [
          { idea: 'Planter', description: 'Paint and use as a small decorative planter' },
          { idea: 'Candle Holder', description: 'Use as a rustic candle holder' },
          { idea: 'Pencil Holder', description: 'Store office supplies or art materials' },
        ],
        tips: [
          'Aluminum is infinitely recyclable with zero loss of quality',
          'Never mix aluminum with other metals',
          'One recycled can saves enough energy to power a laptop for 2 hours',
        ],
      },
      {
        itemType: 'Paper Products',
        icon: '📄',
        content: 'Most paper products are recyclable, but keep them clean and dry for best results.',
        steps: [
          'Keep paper dry and clean',
          'Remove any plastic windows or coatings',
          'Bundle paper together if large quantity',
          'Place in paper recycling bin',
        ],
        reuseIdeas: [
          { idea: 'Mulch', description: 'Shred for use as garden mulch' },
          { idea: 'Composting', description: 'Add brown paper to compost bins' },
          { idea: 'Crafts', description: 'Use for art projects and crafting' },
        ],
        tips: [
          'Avoid glossy or coated papers',
          'Paper can only be recycled 5-7 times before fiber degradation',
          'Keep paper separate from mixed waste',
        ],
      },
      {
        itemType: 'Electronics',
        icon: '⚡',
        content: 'Electronics contain valuable materials and hazardous substances. Never throw them away.',
        steps: [
          'Locate a certified e-waste recycling facility',
          'Back up any data if applicable',
          'Remove batteries if possible',
          'Transport safely to facility',
        ],
        reuseIdeas: [
          { idea: 'Donation', description: 'Donate working devices to schools or nonprofits' },
          { idea: 'Repair', description: 'Get items repaired instead of replaced' },
          { idea: 'Upcycle', description: 'Use parts for DIY projects' },
        ],
        tips: [
          'E-waste contains toxic materials like lead and mercury',
          'Precious metals can be recovered from electronics',
          'Most retailers offer e-waste drop-off programs',
        ],
      },
      {
        itemType: 'Styrofoam',
        icon: '⚪',
        content: 'Styrofoam is difficult to recycle and takes hundreds of years to decompose.',
        steps: [
          'Check if your facility accepts Styrofoam',
          'Remove any attached materials',
          'Place in designated bin if available',
          'Consider reusing instead of recycling',
        ],
        reuseIdeas: [
          { idea: 'Packing', description: 'Save for future shipping needs' },
          { idea: 'Insulation', description: 'Use for loft insulation or storage' },
          { idea: 'Crafts', description: 'Use for model building or art projects' },
        ],
        tips: [
          'Most recycling centers do not accept Styrofoam',
          'Polystyrene (#6 plastic) is rarely recycled',
          'Reuse is much better than recycling for Styrofoam',
        ],
      },
      {
        itemType: 'Food Waste',
        icon: '🍎',
        content: 'Composting food waste reduces landfill methane and creates nutrient-rich soil.',
        steps: [
          'Separate food scraps from other waste',
          'Add to your compost bin at home',
          'Or use a community composting program',
          'Allow decomposition (3-6 months)',
        ],
        reuseIdeas: [
          { idea: 'Home Compost', description: 'Create nutrient-rich soil for your garden' },
          { idea: 'Animal Feed', description: 'Some scraps can feed chickens or other animals' },
          { idea: 'Donation', description: 'Donate to community gardens' },
        ],
        tips: [
          'Include fruit and vegetable scraps, eggshells, and coffee grounds',
          'Avoid meat, dairy, and oils in home compost',
          'Composting reduces methane emissions from landfills',
        ],
      },
      {
        itemType: 'Textiles',
        icon: '👕',
        content: 'Clothing and textiles can be recycled, donated, or upcycled for a second life.',
        steps: [
          'Check if items are still wearable',
          'If good condition, donate to thrift stores',
          'If damaged, check for textile recycling programs',
          'Or use for cleaning rags and craft projects',
        ],
        reuseIdeas: [
          { idea: 'Donation', description: 'Donate to charity or thrift stores' },
          { idea: 'Upcycling', description: 'Turn into bags, quilts, or other items' },
          { idea: 'Rags', description: 'Use as cleaning cloths' },
        ],
        tips: [
          'Textiles account for 10% of landfill waste',
          'Donating extends the life of clothing',
          'Fast fashion contributes significantly to textile waste',
        ],
      },
      {
        itemType: 'Coffee Grounds',
        icon: '☕',
        content: 'Coffee grounds are excellent for composting and can be reused in multiple ways.',
        steps: [
          'Collect used coffee grounds from filters',
          'Dry them if making a deodorant or scrub',
          'Add to compost bin or directly to soil',
          'Or save for beauty and cleaning uses',
        ],
        reuseIdeas: [
          { idea: 'Garden Fertilizer', description: 'Mix directly into garden soil' },
          { idea: 'Body Scrub', description: 'Mix with coconut oil for natural exfoliant' },
          { idea: 'Odor Control', description: 'Use in refrigerator to absorb odors' },
        ],
        tips: [
          'Coffee grounds are slightly acidic (pH 6.2)',
          'They improve soil drainage and water retention',
          'Can repel insects like ants and slugs',
        ],
      },
    ];

    await Tip.insertMany(tips);
    console.log('✅ Seeded 10 recycling tips');

    console.log('🌱 Database seeding complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();