import axios from "axios";
const baseUrl = "http://localhost:3001/api/connections";

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
