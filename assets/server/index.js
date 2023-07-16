const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // Add this line before your route handlers

// Helpers
function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

// Data
const maliaId = "1";
const mathisId = "2";

let users = [
  {
    id: mathisId,
    username: "Thismadu971",
    password: "BrebeufMTL5174",
    connections: [
      { id: generateRandomId(20), name: "Wade Cooper" },
      { id: generateRandomId(20), name: "Arlene Mccoy" },
      { id: generateRandomId(20), name: "Devon Webb" },
      { id: maliaId, name: "Malia Lefranc" },
    ],
  },
  {
    id: maliaId,
    username: "Malia971",
    password: "BrebeufMTL5174",
    connections: [
      { id: generateRandomId(20), name: "Arlene Mccoy" },
      { id: generateRandomId(20), name: "Devon Webb" },
      { id: generateRandomId(20), name: "Tom Cook" },
      { id: generateRandomId(20), name: "Tanya Fox" },
      { id: mathisId, name: "Mathis Lefranc" },
    ],
  },
];

let conversations = [];

let messages = [];

// APIs
app.post("/api/login", (request, response) => {
  const { username, password } = request.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    response.status(200).json(user.id);
  } else {
    response.status(401).send("Username or password does not exist");
  }
});

app.get("/api/conversations", (request, response) => {
  response.json(conversations);
});

app.post("/api/conversations", (request, response) => {
  const newConvo = { ...request.body, id: generateRandomId(20) };
  conversations = conversations.concat(newConvo);
  response.status(200).json(newConvo);
});

app.get("/api/messages", (request, response) => {
  response.json(messages);
});

app.post("/api/messages", (request, response) => {
  const newMessage = { ...request.body, id: generateRandomId(20) };
  messages = messages.concat(newMessage);
  response.status(200).json(newMessage);
});

app.get("/api/connections/:id", (request, response) => {
  const id = request.params.id;
  const user = users.find((u) => {
    return u.id === id;
  });
  response.json(user.connections);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
