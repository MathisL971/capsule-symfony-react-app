import axios from "axios";
const baseUrl = "http://localhost:3001/api/login";

const authenticate = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const loginService = { authenticate };
export default loginService;
