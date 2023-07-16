import React, { useEffect, useState } from "react";
import ConversationsBar from "./ConversationsBar";
import MessageThread from "./MessageThread";
import conversationService from "../services/conversation";
import connectionService from "../services/connections";
import messageService from "../services/message";

const ChatApp = () => {
  const [sessionUserId, setSessionUserId] = useState(null);
  const [connections, setConnections] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [correspondantId, setCorrespondantId] = useState(null);
  const [convoMessages, setConvoMessages] = useState([]);
  const [socketConnection, setSocketConnection] = useState(null);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const sessionUserId = JSON.parse(sessionStorage.getItem("sessionUserId"));
    if (sessionUserId) {
      setSessionUserId(sessionUserId);
    } else {
      window.location.href = "/login";
    }
    connectionService
      .getUserConnections(sessionUserId)
      .then((connections) => setConnections(connections))
      .catch((e) => console.error(e));
    conversationService
      .getAll()
      .then((conversations) => setConversations(conversations))
      .catch((e) => console.error(e));
    if (selectedConversationId) {
      messageService
        .getConvoMessages(selectedConversationId)
        .then((messages) => {
          setConvoMessages(messages);
        })
        .catch((e) => console.error(e));
    }
  }, []);

  const handleConvoSearchOpen = async (id) => {
    const existingConvo = conversations.find((c) => c.id_correspondant === id);

    if (existingConvo) {
      handleConvoSideOpen(existingConvo);
    } else {
      const newConvo = await conversationService.create({
        date_created: new Date(),
        date_last_message: new Date(),
        id_creator: sessionUserId,
        id_correspondant: id,
      });

      setConversations(conversations.concat(newConvo));
      setSelectedConversationId(newConvo.id);
      setCorrespondantId(newConvo.id_correspondant);

      // Open a socket connection
      var conn = new WebSocket(`ws://localhost:8080/${newConvo.id}`);
      conn.onopen = function (e) {
        console.log("Connection established!");
      };

      conn.onmessage = function (e) {
        console.log(e.data);
      };

      setSocketConnection(conn);
    }
  };

  const handleConvoSideOpen = (convo) => {
    // Update selected conversation id
    setSelectedConversationId(convo.id);
    setCorrespondantId(convo.id_correspondant);

    // Populate message thread with past message

    // Open a socket connection
    var conn = new WebSocket(`ws://localhost:8080/${convo.id}`);
    console.log(conn);
    conn.onopen = function (e) {
      console.log("Connection established!");
    };

    conn.onmessage = function (e) {
      console.log(e.data);
    };

    setSocketConnection(conn);
  };

  const onMessageSubmit = async (e) => {
    e.preventDefault();
    socketConnection.send(newMessage);
    const addedMessage = await messageService.create({
      text: newMessage,
      sent_time: new Date(),
      seen_time: null,
      id_sender: sessionUserId,
      id_receiver: correspondantId,
    });
    console.log(addedMessage);
    console.log(convoMessages.concat(addedMessage));
    setConvoMessages(convoMessages.concat(addedMessage));
    setNewMessage("");
    console.log(convoMessages);
  };

  return (
    <div className="h-screen">
      <div className="flex flex-row h-5/6 gap-1">
        <ConversationsBar
          connections={connections}
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          handleConvoOpen={handleConvoSideOpen}
          createConversation={handleConvoSearchOpen}
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
