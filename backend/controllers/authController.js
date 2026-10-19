
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// REGISTER
const register = async (req, res) => {
  try {
    const { fullName, username, email, password, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      department,
      role: 'User',
    });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER BY ADMIN
const createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role, department } = req.body;
    const allowedRoles = ['User', 'Manager', 'Technician'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Role must be User, Manager, or Technician' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      department,
      role,
    });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CURRENT USER
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// GET ALL USERS (for team member selection)
// GET /api/users?role=Technician
const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter)
      .select('fullName email role department teamId')
      .sort({ fullName: 1 });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// module.exports = { register, login, getMe };
module.exports = { register, createUser, login, getMe, getAllUsers };