import axios from "axios";
const baseUrl = "https://127.0.0.1:8001/api/conversations";

const getAll = async () => {
  const response = await axios.get(baseUrl);
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

const conversationService = { getAll, create };
export default conversationService;
