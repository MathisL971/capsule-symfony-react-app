import axios from "axios";
const baseUrl = "https://127.0.0.1:8001/api/login";

const authenticate = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const loginService = { authenticate };
export default loginService;
