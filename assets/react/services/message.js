import axios from "axios";
const baseUrl = "http://localhost:3002/api/messages";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newMessage) => {
  const response = await axios.post(baseUrl, newMessage);
  return response.data;
};

const getMessage = async (messageId) => {
  const response = await axios.get(`${baseUrl}/${messageId}`);
  return response.data;
};

const getConvoMessage = async (convoId, messageId) => {
  const response = await axios.get(
    `${baseUrl}/conversation/${convoId}/${messageId}`
  );
  return response.data;
};

const getConvoMessages = async (convoId) => {
  const response = await axios.get(`${baseUrl}/conversation/${convoId}`);
  return response.data;
};

const messageService = {
  getAll,
  create,
  getMessage,
  getConvoMessage,
  getConvoMessages,
};
export default messageService;
