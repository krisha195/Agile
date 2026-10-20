const Team = require('../models/Team');
const User = require('../models/User');

// GET all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'fullName email role');
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single team
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      'members',
      'fullName email role department'
    );
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create team
const createTeam = async (req, res) => {
  try {
    const { teamName, specialization, description } = req.body;
    const team = await Team.create({ teamName, specialization, description });
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update team
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE team
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST add member to team
const addMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Avoid duplicates
    if (team.members.includes(req.body.userId)) {
      return res.status(400).json({ success: false, message: 'User already in team' });
    }

    team.members.push(req.body.userId);
    await team.save();

    // Also update the user's teamId
    user.teamId = team._id;
    await user.save();

    const updatedTeam = await Team.findById(team._id).populate(
      'members',
      'fullName email role'
    );
    res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE remove member from team
const removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.members = team.members.filter(
      (memberId) => memberId.toString() !== req.params.userId
    );
    await team.save();

    // Clear user's teamId
    await User.findByIdAndUpdate(req.params.userId, { teamId: null });

    const updatedTeam = await Team.findById(team._id).populate(
      'members',
      'fullName email role'
    );
    res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
};