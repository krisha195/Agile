import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const API_URL = `${API_BASE_URL}/api/teams`;

// Get token from localStorage
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all teams
const getAllTeams = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Get single team
const getTeamById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getConfig());
  return response.data;
};

// Create team
const createTeam = async (teamData) => {
  const response = await axios.post(API_URL, teamData, getConfig());
  return response.data;
};

// Update team
const updateTeam = async (id, teamData) => {
  const response = await axios.put(`${API_URL}/${id}`, teamData, getConfig());
  return response.data;
};

// Delete team
const deleteTeam = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig());
  return response.data;
};

// Add member to team
const addMember = async (teamId, userId) => {
  const response = await axios.post(
    `${API_URL}/${teamId}/members`,
    { userId },
    getConfig()
  );
  return response.data;
};

// Remove member from team
const removeMember = async (teamId, userId) => {
  const response = await axios.delete(
    `${API_URL}/${teamId}/members/${userId}`,
    getConfig()
  );
  return response.data;
};

const teamService = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
};

export default teamService;