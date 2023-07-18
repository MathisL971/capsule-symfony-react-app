import React, { useEffect, useRef, useState } from "react";
import ConversationsBar from "./ConversationsBar";
import MessageThread from "./MessageThread";
import conversationService from "../services/conversation";
import connectionService from "../services/connections";
import messageService from "../services/message";
import userService from "../services/user";

const GENERAL_SOCKET_CONNECTION_ID = "123456789";

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
        .then((arr) => {
          setSessionUser(arr[0]);
        })
        .catch((e) => console.error(e));
    } else {
      window.location.href = "/login";
    }

    openGeneralWebSocketConnection(GENERAL_SOCKET_CONNECTION_ID);

    connectionService
      .getUserConnections(sessionUserId)
      .then((connections) => setConnections(connections))
      .catch((e) => console.error(e));

    conversationService
      .getUserConvos(sessionUserId)
      .then((conversations) => setConversations(conversations))
      .catch((e) => console.error(e));
  }, []);

  // Rerending convo messages of receiver
  useEffect(() => {
    if (
      latestMessageObject &&
      sessionUserId === latestMessageObject.id_receiver
    ) {
      setConvoMessages(convoMessages.concat(latestMessageObject));
    }
  }, [latestMessageObject]);

  // Send messages in backlog
  useEffect(() => {
    if (messageToSend) {
      socketConnection.send(JSON.stringify(messageToSend));
      setMessageToSend(null);
    }
  }, [socketConnection]);

  // Handle general broadcast
  useEffect(() => {
    if (broadcast && broadcast.receiver_id === sessionUserId) {
      conversationService
        .getUserConvos(broadcast.receiver_id)
        .then((conversations) => {
          setConversations(conversations);
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
          id: "dummy_id",
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

  const openGeneralWebSocketConnection = (generalId) => {
    const genConn = new WebSocket(`ws://localhost:8080/${generalId}`);

    genConn.onopen = (e) => {
      console.log("Connection established!");
      setGeneralSocketConnection(genConn);
    };

    genConn.onmessage = (e) => {
      setBroadcast(JSON.parse(e.data));
    };
  };

  const openWebSocketConnection = (convoId) => {
    const conn = new WebSocket(`ws://localhost:8080/${convoId}`);

    conn.onopen = (e) => {
      console.log("Connection established!");
      setSocketConnection(conn);
    };

    conn.onmessage = (e) => {
      const object = JSON.parse(e.data);
      // Render new message onto receiver screen
      setLatestMessageObject(object);
    };
  };

  const onMessageSubmit = async (e) => {
    e.preventDefault();

    try {
      let addedMessage;

      if (potentialConvo) {
        const newConvo = await conversationService.create({
          ...potentialConvo,
          date_created: new Date(),
          date_last_message: new Date(),
        });

        openWebSocketConnection(newConvo.id);
        setPotentialConvo(null);
        setConversations(conversations.concat(newConvo));
        setSelectedConversationId(newConvo.id);

        addedMessage = await messageService.create({
          text: newMessage,
          sent_time: new Date(),
          seen_time: null,
          id_sender: sessionUserId,
          id_receiver: correspondantId,
          id_convo: newConvo.id,
        });
      } else {
        addedMessage = await messageService.create({
          text: newMessage,
          sent_time: new Date(),
          seen_time: null,
          id_sender: sessionUserId,
          id_receiver: correspondantId,
          id_convo: selectedConversationId,
        });
      }

      if (socketConnection) {
        socketConnection.send(JSON.stringify(addedMessage));
      } else {
        setMessageToSend(addedMessage);
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

  return (
    <div className="h-screen flex flex-col gap-3">
      {sessionUser && (
        <div className="flex flex-row justify-center">
          <h1 className="text-2xl font-extrabold">{sessionUser.username}</h1>
        </div>
      )}
      <div className="flex flex-row h-5/6 gap-1">
        <ConversationsBar
          sessionUserId={sessionUserId}
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
