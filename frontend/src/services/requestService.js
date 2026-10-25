import axios from 'axios';

const rawBaseUrl = process.env.REACT_APP_API_URL || '';
const API_BASE_URL = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
const API_URL = `${API_BASE_URL}/api/requests`;

const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all requests
// const getAllRequests = async () => {
//   const response = await axios.get(API_URL, getConfig());
//   return response.data;
// };

const getAllRequests = async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // keep your current style
};

// Get single request
const getRequestById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getConfig());
  return response.data;
};

const createRequest = async (requestData) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(API_URL, requestData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type manually
      // axios will set: multipart/form-data; boundary=...
    },
  });

  return response.data;
};

// Update request
const updateRequest = async (id, requestData) => {
  const response = await axios.put(`${API_URL}/${id}`, requestData, getConfig());
  return response.data;
};

// Delete request
const deleteRequest = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig());
  return response.data;
};

// Update status only
const updateStatus = async (id, status) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    getConfig()
  );
  return response.data;
};

// Get calendar requests
const getCalendarRequests = async () => {
  const response = await axios.get(`${API_URL}/calendar`, getConfig());
  return response.data;
};

const requestService = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  updateStatus,
  getCalendarRequests,
};

export default requestService;