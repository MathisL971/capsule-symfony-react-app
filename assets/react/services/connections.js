import axios from "axios";
const baseUrl = "https://127.0.0.1:8000/api/connections";
// const baseUrl = "http://localhost:3002/api/connections";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserConnections = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`);
  return response.data;
};

const connectionService = { getAll, getUserConnections };
export default connectionService;
