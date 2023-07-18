import axios from "axios";
const baseUrl = "http://localhost:3001/api/conversations";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserConvos = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`);
  return response.data;
};

const create = async (newConvo) => {
  const response = await axios.post(baseUrl, newConvo);
  return response.data;
};

const getConvo = async (id) => {
  const response = await axios.post(`${baseUrl}/${id}`);
  return response.data;
};

const conversationService = { getAll, create, getConvo, getUserConvos };
export default conversationService;
