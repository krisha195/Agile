const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Team = require('./models/Team');
const Equipment = require('./models/Equipment');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard';

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected.');

    // Clear existing records
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Equipment.deleteMany({})
    ]);
    console.log('Cleared existing Users, Teams, and Equipment.');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        fullName: 'System Administrator',
        username: 'admin',
        email: 'admin@gearguard.com',
        password: hashedPassword,
        role: 'Admin',
        department: 'Operations',
        isActive: true,
      },
      {
        fullName: 'Alice Maintenance Manager',
        username: 'manager_alice',
        email: 'manager@gearguard.com',
        password: hashedPassword,
        role: 'Manager',
        department: 'Engineering',
        isActive: true,
      },
      {
        fullName: 'John Miller (Technician)',
        username: 'tech_john',
        email: 'john@gearguard.com',
        password: hashedPassword,
        role: 'Technician',
        department: 'Mechanical',
        isActive: true,
      },
      {
        fullName: 'Sarah Chen (Technician)',
        username: 'tech_sarah',
        email: 'sarah@gearguard.com',
        password: hashedPassword,
        role: 'Technician',
        department: 'Electrical',
        isActive: true,
      },
      {
        fullName: 'Alex Operator',
        username: 'operator_alex',
        email: 'alex@gearguard.com',
        password: hashedPassword,
        role: 'User',
        department: 'Production',
        isActive: true,
      },
    ]);
    console.log(`Created ${users.length} demo users.`);

    const techJohn = users.find(u => u.username === 'tech_john');
    const techSarah = users.find(u => u.username === 'tech_sarah');

    // 2. Create Teams
    const teams = await Team.insertMany([
      {
        teamName: 'Mechanical Maintenance Team',
        specialization: 'Mechanical',
        description: 'Heavy machinery, hydraulics, CNC and mechanical drivetrains.',
        members: [techJohn._id],
      },
      {
        teamName: 'Electrical & Power Systems',
        specialization: 'Electrical',
        description: 'Transformers, high voltage panels, PLC and electrical distribution.',
        members: [techSarah._id],
      },
      {
        teamName: 'Facilities & HVAC Team',
        specialization: 'HVAC',
        description: 'Industrial chillers, air compressors, and facility climate units.',
        members: [techJohn._id, techSarah._id],
      },
    ]);
    console.log(`Created ${teams.length} maintenance teams.`);

    const mechTeam = teams.find(t => t.specialization === 'Mechanical');
    const elecTeam = teams.find(t => t.specialization === 'Electrical');
    const hvacTeam = teams.find(t => t.specialization === 'HVAC');

    // 3. Create Equipment
    const equipment = await Equipment.insertMany([
      {
        equipmentName: 'CNC Vertical Milling Center',
        serialNumber: 'CNC-2024-001',
        category: 'Machine',
        department: 'Production',
        location: 'Shop Floor Section B-12',
        status: 'Active',
        teamId: mechTeam._id,
        description: 'High precision 5-axis vertical machining center.',
      },
      {
        equipmentName: 'Heavy Hydraulic Press 500T',
        serialNumber: 'HYD-500-092',
        category: 'Machine',
        department: 'Manufacturing',
        location: 'Heavy Press Bay 4',
        status: 'Active',
        teamId: mechTeam._id,
        description: '500-ton forging and stamping hydraulic press.',
      },
      {
        equipmentName: 'Main Substation Transformer 2.5MVA',
        serialNumber: 'XFMR-2023-88',
        category: 'Other',
        department: 'Utilities',
        location: 'Primary Electrical Yard East',
        status: 'Active',
        teamId: elecTeam._id,
        description: 'Step-down oil-immersed power transformer unit.',
      },
      {
        equipmentName: 'Central Industrial Water Chiller',
        serialNumber: 'CHL-100-440',
        category: 'Other',
        department: 'Facilities',
        location: 'Roof Utility Plant Deck',
        status: 'Active',
        teamId: hvacTeam._id,
        description: 'Centrifugal liquid chiller unit for factory cooling.',
      },
      {
        equipmentName: 'Logistics Forklift 3-Ton Electric',
        serialNumber: 'FLT-E-3011',
        category: 'Vehicle',
        department: 'Warehouse',
        location: 'Warehouse Loading Dock 2',
        status: 'Active',
        teamId: mechTeam._id,
        description: 'Electric counterbalanced forklift with rapid charger.',
      },
    ]);
    console.log(`Created ${equipment.length} equipment assets.`);

    console.log('\n=========================================');
    console.log(' DATABASE SEEDED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Demo Login Credentials:');
    console.log('  Admin:       username: admin          password: password123');
    console.log('  Manager:     username: manager_alice  password: password123');
    console.log('  Technician:  username: tech_john      password: password123');
    console.log('  User:        username: operator_alex  password: password123');
    console.log('=========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
