import axios from "axios";
const baseUrl = "http://localhost:3002/api/users";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const create = async (newUser) => {
  const response = await axios.post(baseUrl, newUser);
  return response.data;
};

const userService = { getAll, create, getUser };
export default userService;
