import authService from './authService';

const rawBaseUrl = process.env.REACT_APP_API_URL || '';
const API_BASE_URL = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
const API_URL = `${API_BASE_URL}/api/equipment`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authService.getToken()}`
});

// Safe JSON parser for responses that may be empty or non-JSON
const safeParseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (e) {
    return { raw: text };
  }
};

const getAllEquipment = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_URL}?${query}`, { headers: getHeaders() });
  const json = await safeParseResponse(res);

  // normalize to { success, data }
  if (Array.isArray(json)) return { success: true, data: json };
  return json;
};

const getEquipment = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
  return safeParseResponse(res);
};

const createEquipment = async (data) => {
  const res = await fetch(API_URL, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return safeParseResponse(res);
};

const updateEquipment = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
  return safeParseResponse(res);
};

const deleteEquipment = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getHeaders() });
  return safeParseResponse(res);
};

const equipmentService = { getAllEquipment, getEquipment, createEquipment, updateEquipment, deleteEquipment };
export default equipmentService;