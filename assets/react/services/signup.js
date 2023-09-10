import axios from "axios";
const baseUrl = "https://127.0.0.1:8000/signup";
// const baseUrl = "http://localhost:3002/api/signup";

const signup = async (data) => {
  const response = await axios.post(baseUrl, data);
  return response.data;
};

const signupService = { signup };
export default signupService;
