const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const MarketplaceItem = require('../models/MarketplaceItem');
const Project = require('../models/Project');
const Worker = require('../models/Worker');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await MarketplaceItem.deleteMany({});
    await Project.deleteMany({});
    await Worker.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const customer = await User.create({
      name: 'Alex Chen',
      email: 'alex@buildease.com',
      password: 'password123',
      role: 'customer',
      location: 'Bangalore',
    });

    const contractor1 = await User.create({
      name: 'Prestige Constructions',
      email: 'prestige@buildease.com',
      password: 'password123',
      role: 'contractor',
      companyName: 'Prestige Constructions',
      yearsOfExperience: 15,
      specialization: 'Residential Construction',
      companyWebsite: 'https://prestigeconstructions.com',
      rating: 4.8,
      completedProjects: 50,
    });

    const contractor2 = await User.create({
      name: 'Sobha Developers',
      email: 'sobha@buildease.com',
      password: 'password123',
      role: 'contractor',
      companyName: 'Sobha Developers',
      yearsOfExperience: 20,
      specialization: 'Luxury Villas',
      companyWebsite: 'https://sobha.com',
      rating: 4.9,
      completedProjects: 120,
    });

    const contractor3 = await User.create({
      name: 'ValueBuild Homes',
      email: 'valuebuild@buildease.com',
      password: 'password123',
      role: 'contractor',
      companyName: 'ValueBuild Homes',
      yearsOfExperience: 8,
      specialization: 'Budget Homes',
      rating: 4.5,
      completedProjects: 200,
    });

    console.log('Users created.');

    // Create marketplace items - Indian brands
    const indianItems = [
      { name: 'UltraTech Cement', category: 'Cement', price: 450, unit: 'bag', brand: 'indian', image: 'https://placehold.co/300x300/374151/fef08a?text=Cement' },
      { name: 'Kajaria Vitrified Tiles', category: 'Tiles', price: 80, unit: 'sq.ft', brand: 'indian', image: 'https://placehold.co/300x300/374151/fef08a?text=Tiles' },
      { name: 'Asian Paints Royale', category: 'Paint', price: 5000, unit: '20L', brand: 'indian', image: 'https://placehold.co/300x300/374151/fef08a?text=Paint' },
      { name: 'TATA Tiscon Steel Bars', category: 'Steel', price: 85, unit: 'kg', brand: 'indian', image: 'https://placehold.co/300x300/374151/fef08a?text=Steel' },
    ];

    // Create marketplace items - Foreign brands
    const foreignItems = [
      { name: 'LafargeHolcim Cement', category: 'Cement', price: 650, unit: 'bag', brand: 'foreign', image: 'https://placehold.co/300x300/4b5563/fde047?text=Cement' },
      { name: 'Porcelanosa Tiles', category: 'Tiles', price: 250, unit: 'sq.ft', brand: 'foreign', image: 'https://placehold.co/300x300/4b5563/fde047?text=Tiles' },
      { name: 'Sherwin-Williams Paint', category: 'Paint', price: 8000, unit: '20L', brand: 'foreign', image: 'https://placehold.co/300x300/4b5563/fde047?text=Paint' },
      { name: 'Gerdau S.A. Steel', category: 'Steel', price: 120, unit: 'kg', brand: 'foreign', image: 'https://placehold.co/300x300/4b5563/fde047?text=Steel' },
    ];

    await MarketplaceItem.insertMany([...indianItems, ...foreignItems]);
    console.log('Marketplace items created.');

    // Create projects
    const project1 = await Project.create({
      title: "Alex's Modern Villa",
      description: 'A modern 3BHK villa with contemporary design',
      budget: '₹25L',
      location: 'Bangalore',
      type: 'New Construction',
      skills: ['Masonry', 'Plumbing', 'Electrical'],
      status: 'in-progress',
      progress: 45,
      customer: customer._id,
      contractor: contractor1._id,
      totalBudget: 2500000,
      budgetSpent: 1125000,
      nextMilestone: 'Roofing',
      milestones: [
        { name: 'Foundation', status: 'completed' },
        { name: 'Structure & Slabs', status: 'in-progress' },
        { name: 'Roofing', status: 'upcoming' },
        { name: 'Plumbing & Electrical', status: 'upcoming' },
        { name: 'Finishing', status: 'upcoming' },
      ],
      updates: [
        { text: 'Brickwork for the first floor has been completed by the masonry team.', date: new Date('2025-09-20') },
        { text: 'First-floor slab concrete poured and is now curing.', date: new Date('2025-09-15') },
        { text: 'All pillars for the ground floor are complete. Ready for slab work.', date: new Date('2025-09-01') },
      ],
      gallery: [
        'https://placehold.co/600x400/1f2937/fef08a?text=Foundation',
        'https://placehold.co/600x400/1f2937/fef08a?text=Pillars',
        'https://placehold.co/600x400/1f2937/fef08a?text=Brickwork',
        'https://placehold.co/600x400/1f2937/fef08a?text=Site+View',
      ],
    });

    // Open projects for contractors to bid on
    await Project.create({
      title: 'Build 3BHK house in Mumbai',
      budget: '₹40L',
      location: 'Mumbai',
      type: 'New Construction',
      skills: ['Masonry', 'Plumbing', 'Electrical'],
      status: 'open',
      customer: customer._id,
    });

    await Project.create({
      title: 'Renovate 2BHK apartment',
      budget: '₹10L',
      location: 'Delhi',
      type: 'Renovation',
      skills: ['Painting', 'Tiling', 'Electrical'],
      status: 'open',
      customer: customer._id,
    });

    await Project.create({
      title: 'Construct commercial office space',
      budget: '₹1.2Cr',
      location: 'Bangalore',
      type: 'Commercial',
      skills: ['Structural', 'HVAC', 'Glasswork'],
      status: 'open',
      customer: customer._id,
    });

    await Project.create({
      title: 'Luxury Villa Interior Work',
      budget: '₹35L',
      location: 'Pune',
      type: 'Interiors',
      skills: ['Woodwork', 'False Ceiling', 'Lighting'],
      status: 'open',
      customer: customer._id,
    });

    console.log('Projects created.');

    // Create workers for contractor1
    await Worker.create({ name: 'Rajesh Kumar', role: 'Mason', status: 'Assigned', contractor: contractor1._id, assignedProject: project1._id });
    await Worker.create({ name: 'Suresh Singh', role: 'Plumber', status: 'Available', contractor: contractor1._id });
    await Worker.create({ name: 'Amit Patel', role: 'Electrician', status: 'Assigned', contractor: contractor1._id, assignedProject: project1._id });

    console.log('Workers created.');

    // Create notifications
    await Notification.create({ user: customer._id, type: 'bid', text: 'Prestige Constructions placed a bid on your project.' });
    await Notification.create({ user: customer._id, type: 'milestone', text: 'Milestone "Foundation" has been approved.' });
    await Notification.create({ user: customer._id, type: 'message', text: 'New message from Sobha Developers.' });

    console.log('Notifications created.');
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test accounts:');
    console.log('  Customer: alex@buildease.com / password123');
    console.log('  Contractor: prestige@buildease.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
