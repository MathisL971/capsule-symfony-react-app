import { now } from "moment-timezone";
import React from "react";
import { createContext, useContext } from "react";

const ChatContext = createContext();

// Fetch all conversations in which session user is engaged
const conversations = [
  {
    id: 1,
    date_created: new Date(),
    date_last_message: new Date(),
    id_creator: 1,
    id_correspondant: 2,
  },
  {
    id: 2,
    date_created: new Date(),
    date_last_message: new Date(),
    id_creator: 2,
    id_correspondant: 1,
  },
];

// Fetch all messages sent and received by session user
const messages = [
  { id: 1, text: "hello", sentTime: 2, id_sender: 1, id_receiver: 2 },
  {
    id: 2,
    text: "fantastic!",
    sentTime: 23,
    id_sender: 2,
    id_receiver: 1,
  },
  {
    id: 3,
    text: "how are you doing",
    sentTime: 5,
    id_sender: 2,
    id_receiver: 1,
  },
  {
    id: 4,
    text: "good and you",
    sentTime: 13,
    id_sender: 1,
    id_receiver: 2,
  },
];

// Fetch all user with whom session user has had a conversation sorted from most recent to least recent interaction
const correspondants = [
  { id: 1, username: "mathisl971", firstName: "Mathis", lastName: "Lefranc" },
  { id: 2, username: "maliasbh", firstName: "Malia", lastName: "Lefranc" },
  {
    id: 3,
    username: "fanfan97133",
    firstName: "Fernande",
    lastName: "Questel",
  },
  { id: 4, username: "jmsbh971", firstName: "Jean-Marc", lastName: "Lefranc" },
];

// Helper functions
export const useMessages = () => {
  const { messages } = useContext(ChatContext);
  return messages;
};

export const useCorrespondants = () => {
  const { correspondants } = useContext(ChatContext);
  return correspondants;
};

export const useConversations = () => {
  const { conversations } = useContext(ChatContext);
  return conversations;
};

export const useSelectedConversation = () => {
  const { selectedConversation } = useContext(ChatContext);
  return selectedConversation;
};

export const ChatContextProvider = (props) => {
  return (
    <ChatContext.Provider
      value={{ messages, correspondants, conversations, selectedConversation }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
