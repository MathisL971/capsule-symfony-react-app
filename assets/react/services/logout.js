import axios from "axios";
const baseUrl = "https://127.0.0.1:8000/logout";
// const baseUrl = "http://localhost:3002/api/logout";

const logOut = async () => {
  const response = await axios.post(baseUrl);
  return response.data;
};

const logoutService = { logOut };
export default logoutService;
