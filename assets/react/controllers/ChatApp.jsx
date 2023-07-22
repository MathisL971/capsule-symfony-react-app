import React, { useEffect, useRef, useState } from "react";
import ConversationsBar from "./ConversationsBar";
import MessageThread from "./MessageThread";
import conversationService from "../services/conversation";
import connectionService from "../services/connections";
import messageService from "../services/message";
import userService from "../services/user";
import { add } from "@hotwired/stimulus";

const GENERAL_SOCKET_CONNECTION_ID = "123456789";

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

function compareConvoDates(date1, date2) {
  if (date1 > date2) {
    return -1;
  } else if (date1 < date2) {
    return 1;
  } else {
    return 0;
  }
}

function compareMessageDates(date1, date2) {
  if (date1 > date2) {
    return 1;
  } else if (date1 < date2) {
    return -1;
  } else {
    return 0;
  }
}

const ChatApp = () => {
  const [sessionUserId, setSessionUserId] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [generalSocketConnection, setGeneralSocketConnection] = useState(null);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [correspondantId, setCorrespondantId] = useState(null);
  const [convoMessages, setConvoMessages] = useState([]);
  const [socketConnection, setSocketConnection] = useState(null);

  const [newMessage, setNewMessage] = useState("");
  const [latestMessageObject, setLatestMessageObject] = useState(null);

  const [potentialConvo, setPotentialConvo] = useState(null);
  const [messageToSend, setMessageToSend] = useState(null);
  const [broadcast, setBroadcast] = useState(null);

  // Initial data fetching
  useEffect(() => {
    const sessionUserId = JSON.parse(sessionStorage.getItem("sessionUserId"));
    if (sessionUserId) {
      setSessionUserId(sessionUserId);
      userService
        .getUser(sessionUserId)
        .then((user) => {
          setSessionUser(user);
        })
        .catch((e) => console.error(e));
    } else {
      window.location.href = "/login";
    }

    openWebSocketConnection(GENERAL_SOCKET_CONNECTION_ID);

    connectionService
      .getUserConnections(sessionUserId)
      .then((connections) => setConnections(connections))
      .catch((e) => console.error(e));

    conversationService
      .getUserConvos(sessionUserId)
      .then((conversations) => setConversations(conversations))
      .catch((e) => console.error(e));
  }, []);

  // Send messages in backlog
  useEffect(() => {
    if (messageToSend) {
      socketConnection.send(JSON.stringify(messageToSend));
      setMessageToSend(null);
    }
  }, [socketConnection]);

  // Rerending convo messages of receiver
  useEffect(() => {
    if (
      latestMessageObject &&
      sessionUserId === latestMessageObject.id_receiver
    ) {
      console.log("lastestMessageObject:", latestMessageObject);
      console.log("sessionUserId:", sessionUserId);

      const updatedConversations = conversations.map((convo) => {
        return convo.id === latestMessageObject.id_convo
          ? { ...convo, date_last_message: latestMessageObject.sent_time }
          : convo;
      });

      console.log("Updated conversations:", updatedConversations);

      setConversations(updatedConversations);

      if (selectedConversationId === latestMessageObject.id_convo) {
        console.log("Selected conversation id:", selectedConversationId);

        const updatedMessages = convoMessages.concat(latestMessageObject);
        console.log("Updated messages:", updatedMessages);

        setConvoMessages(updatedMessages);
      }
    }
    setLatestMessageObject(null);
  }, [latestMessageObject]);

  // Handle general broadcast
  useEffect(() => {
    if (broadcast && broadcast.receiver_id === sessionUserId) {
      console.log("I am the receiver of that broadcast:", broadcast);

      conversationService
        .getUserConvos(broadcast.receiver_id)
        .then((userConversations) => {
          console.log("My conversations:", userConversations);
          setConversations(userConversations);
        })
        .catch((e) => console.error(e));
    }
  }, [broadcast]);

  const handleConvoSearchOpen = async (correspondantId) => {
    try {
      const existingConvo = conversations.find(
        (convo) => convo.id_correspondant === correspondantId
      );

      if (existingConvo) {
        handleConvoSideOpen(existingConvo);
      } else {
        const newPotentialConvo = {
          id: generateRandomId(20),
          date_created: null,
          date_last_message: null,
          id_creator: sessionUserId,
          id_correspondant: correspondantId,
        };

        setSelectedConversationId(newPotentialConvo.id);
        setCorrespondantId(newPotentialConvo.id_correspondant);
        setConvoMessages([]);

        setPotentialConvo(newPotentialConvo);
      }
    } catch (error) {
      // Handle the error appropriately
      console.error("Error opening conversation:", error);
    }
  };

  const onMessageSubmit = async (e) => {
    e.preventDefault();

    try {
      let addedMessage;

      if (potentialConvo) {
        const newConvo = await conversationService.create({
          ...potentialConvo,
          date_created: new Date().toISOString(),
          date_last_message: new Date().toISOString(),
        });

        openWebSocketConnection(newConvo.id);

        setPotentialConvo(null);

        setConversations(conversations.concat(newConvo));

        setSelectedConversationId(newConvo.id);

        addedMessage = await messageService.create({
          text: newMessage,
          sent_time: newConvo.date_last_message,
          seen_time: null,
          id_sender: sessionUserId,
          id_receiver: correspondantId,
          id_convo: newConvo.id,
        });

        setMessageToSend(addedMessage);
      } else {
        addedMessage = await messageService.create({
          text: newMessage,
          sent_time: new Date().toISOString(),
          seen_time: null,
          id_sender: sessionUserId,
          id_receiver: correspondantId,
          id_convo: selectedConversationId,
        });

        // Make request to modify date latest message for convo in db
        conversationService
          .modifyConvo(selectedConversationId, {
            new_time: new Date().toISOString(),
          })
          .then((convos) => {
            setConversations(convos);
          })
          .catch((e) => console.error(e));

        socketConnection.send(JSON.stringify(addedMessage));
      }

      setConvoMessages((prevConvoMessages) =>
        prevConvoMessages.concat(addedMessage)
      );

      generalSocketConnection.send(
        JSON.stringify({
          receiver_id: correspondantId,
        })
      );

      setNewMessage("");
    } catch (error) {
      // Handle the error appropriately
      console.error("Error submitting message:", error);
    }
  };

  const handleConvoSideOpen = async (convo) => {
    setPotentialConvo(null);

    setSelectedConversationId(convo.id);
    setCorrespondantId(
      sessionUserId === convo.id_creator
        ? convo.id_correspondant
        : convo.id_creator
    );

    // Fetch previous convo messages
    const messages = await messageService.getConvoMessages(convo.id);
    setConvoMessages(messages);

    try {
      // Open a socket connection and wait for it to establish
      openWebSocketConnection(convo.id);
    } catch (error) {
      // Handle the error appropriately
      console.error("Error opening conversation:", error);
    }
  };

  const openWebSocketConnection = (convoId) => {
    const conn = new WebSocket(`ws://localhost:8080/${convoId}`);

    if (convoId === GENERAL_SOCKET_CONNECTION_ID) {
      conn.onopen = (e) => {
        console.log("Public connection established!");
        setGeneralSocketConnection(conn);
      };

      conn.onmessage = (e) => {
        console.log("Setting broadcast to:", JSON.parse(e.data));
        setBroadcast(JSON.parse(e.data));
      };
    } else {
      conn.onopen = (e) => {
        console.log("Private connection established!");
        setSocketConnection(conn);
      };

      conn.onmessage = (e) => {
        console.log("Setting lastMessageObject to:", JSON.parse(e.data));
        setLatestMessageObject(JSON.parse(e.data));
      };
    }
  };

  conversations.sort((c1, c2) => {
    return compareConvoDates(c1.date_last_message, c2.date_last_message);
  });

  {
    convoMessages &&
      convoMessages.sort((m1, m2) => {
        return compareMessageDates(m1.sent_time - m2.sent_time);
      });
  }

  console.log("Public connection:", generalSocketConnection);
  console.log("Private connection:", socketConnection);

  return (
    <div className="h-screen flex flex-col gap-3">
      {sessionUser && (
        <div className="flex flex-row justify-center">
          <h1 className="text-2xl font-extrabold">{sessionUser.username}</h1>
        </div>
      )}
      <div className="flex flex-row h-5/6 gap-1">
        <ConversationsBar
          connections={connections}
          conversations={conversations}
          potentialConvo={potentialConvo}
          selectedConversationId={selectedConversationId}
          handleConvoSideOpen={handleConvoSideOpen}
          handleConvoSearchOpen={handleConvoSearchOpen}
        />
        <MessageThread
          selectedConversationId={selectedConversationId}
          messages={convoMessages}
          onMessageSubmit={onMessageSubmit}
          setNewMessage={setNewMessage}
          newMessage={newMessage}
          sessionUserId={sessionUserId}
        />
      </div>
    </div>
  );
};

export default ChatApp;
