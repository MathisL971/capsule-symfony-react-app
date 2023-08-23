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
const chrisId = "3";
const gaelleId = "4";

const connections = [
  { id: generateRandomId(20), name: "Wade Cooper" },
  { id: generateRandomId(20), name: "Arlene Mccoy" },
  { id: generateRandomId(20), name: "Devon Webb" },
];

let users = [
  {
    id: mathisId,
    username: "Mathis",
    password: "BrebeufMTL5174",
    role: "parent",
    connections: connections.concat({ id: maliaId, name: "Malia Lefranc" }),
  },
  {
    id: maliaId,
    username: "Malia",
    password: "BrebeufMTL5174",
    role: "ado",
    connections: connections.concat({ id: mathisId, name: "Mathis Lefranc" }),
  },
  {
    id: chrisId,
    username: "Chris",
    password: "BrebeufMTL5174",
    role: "pro",
    connections: connections.concat({ id: mathisId, name: "Mathis Lefranc" }),
  },
  {
    id: gaelleId,
    username: "Gaelle",
    password: "BrebeufMTL5174",
    role: "admin",
    connections: connections.concat({ id: mathisId, name: "Mathis Lefranc" }),
  },
];

let conversations = [];

let messages = [];

let loggedInUser;

// APIs
app.post("/api/login", (request, response) => {
  const { username, password } = request.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    loggedInUser = user;
    response.status(200).send(user);
  } else {
    response.status(401).send("Username or password does not exist");
  }
});

app.post("/api/logout", (request, response) => {
  loggedInUser = null;
});

app.post("/api/users", (request, response) => {
  const { username, password, role } = request.body;
  const newUser = {
    username,
    password,
    role,
    id: generateRandomId(20),
    connections: users[0].connections,
  };
  users = users.concat(newUser);
  response.json(users.find((u) => u.id === newUser.id));
});

app.get("/api/users/:id", (request, response) => {
  const userId = request.params.id;
  const user = users.find((u) => userId === u.id);
  response.json(user);
});

app.get("/api/conversations", (request, response) => {
  response.json(conversations);
});

app.post("/api/conversations", (request, response) => {
  const newConvo = request.body;
  conversations = conversations.concat(newConvo);
  response.status(200).json(newConvo);
});

app.get("/api/conversations/:id", (request, response) => {
  const userId = request.params.id;
  const userConvos = conversations.filter(
    (convo) => userId === convo.id_creator || userId === convo.id_correspondant
  );
  response.json(userConvos);
});

app.put("/api/conversations", (request, response) => {
  const updatedConvo = request.body;

  conversations = conversations.map((convo) =>
    updatedConvo.id === convo.id ? updatedConvo : convo
  );
  response.json(updatedConvo);
});

app.get("/api/messages", (request, response) => {
  response.json(messages);
});

app.post("/api/messages", (request, response) => {
  const newMessage = { ...request.body, id: generateRandomId(20) };
  messages = messages.concat(newMessage);
  response.status(200).json(newMessage);
});

app.get("/api/messages/conversation/:id", (request, response) => {
  const convoId = request.params.id;
  const convoMessages = messages.filter((m) => {
    return m.id_convo === convoId;
  });
  response.json(convoMessages);
});

app.get("/api/connections/:id", (request, response) => {
  const id = request.params.id;
  const user = users.find((u) => {
    return u.id === id;
  });
  response.json(user.connections);
});

const PORT = 3002;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
