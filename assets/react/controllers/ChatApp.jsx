import React, { useEffect, useState } from "react";
import ConversationsBar from "./ConversationsBar";
import MessageThread from "./MessageThread";
import conversationService from "../services/conversation";
import connectionService from "../services/connections";
import messageService from "../services/message";
import userService from "../services/user";

const GENERAL_SOCKET_CONNECTION_ID = "123456789";

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
  const [generalSocketConnection, setGeneralSocketConnection] = useState(null);

  const [sessionUserId, setSessionUserId] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [correspondantId, setCorrespondantId] = useState(null);
  const [convoMessages, setConvoMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [potentialConvo, setPotentialConvo] = useState(null);
  const [broadcast, setBroadcast] = useState(null);

  // const [socketConnection, setSocketConnection] = useState(null);
  // const [latestMessageObject, setLatestMessageObject] = useState(null);
  // const [messageToSend, setMessageToSend] = useState(null);

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
  // useEffect(() => {
  //   // When a new connection is established
  //   // If there is a message to send and that it belongs to the active conversation
  //   if (messageToSend && messageToSend.id_convo === selectedConversationId) {
  //     // Send it over the connection
  //     socketConnection.send(JSON.stringify(messageToSend));
  //     setMessageToSend(null);
  //   }
  // }, [socketConnection]);

  // Rerending convo messages of receiver
  // useEffect(() => {
  //   if (
  //     latestMessageObject &&
  //     sessionUserId === latestMessageObject.id_receiver
  //   ) {
  //     setConversations(
  //       conversations.map((convo) => {
  //         return convo.id === latestMessageObject.id_convo
  //           ? { ...convo, date_last_message: latestMessageObject.sent_time }
  //           : convo;
  //       })
  //     );

  //     if (selectedConversationId === latestMessageObject.id_convo) {
  //       console.log("Rerendering convo messages...");
  //       setConvoMessages(convoMessages.concat(latestMessageObject));
  //     }
  //   }
  //   // setLatestMessageObject(null);
  // }, [latestMessageObject]);

  // Handle broadcasts
  useEffect(() => {
    if (broadcast) {
      console.log("Broadcast exists...");
      console.log("Broadcast object:", broadcast);
      if (broadcast.id_receiver === sessionUserId) {
        console.log("Broadcast is meant for me!");

        // Fetch updated conversations of receiver
        conversationService
          .getUserConvos(broadcast.id_receiver)
          .then((userConversations) => {
            // Rerender conversations of receiver
            console.log("Updated my conversations:", userConversations);
            setConversations(userConversations);

            // If receiver was about to send his first message to the sender
            if (
              potentialConvo &&
              potentialConvo.id_correspondant === broadcast.id_sender
            ) {
              console.log(
                "I was just about to start that same conversation..."
              );

              // Get the newly created convo
              const newConvo = userConversations.find(
                (c) => c.id === broadcast.id_convo
              );

              console.log("Opening convo from the side programatically");
              // Scrap the potential convo and open the newly created conversation
              handleConvoSideOpen(newConvo);
            }

            // If that conversation existed and the receiver was already inside it
            else if (selectedConversationId === broadcast.id_convo) {
              console.log(
                "I was already inside that conversation. Rerendering convo messages"
              );
              // Rerender the receiver conversation message
              setConvoMessages(convoMessages.concat(broadcast));
            }
          })
          .catch((e) => console.error(e));
      }
    } else {
    }
  }, [broadcast]);

  const handleConvoSearchOpen = async (correspondantId) => {
    try {
      const existingConvo = conversations.find(
        (convo) =>
          convo.id_correspondant === correspondantId ||
          convo.id_creator === correspondantId
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

    if (newMessage.length == 0) {
      return -1;
    } else {
      try {
        let addedMessage;

        // If a potential conversation has been initiated
        if (potentialConvo) {
          // Create a new conversation
          const newConvo = await conversationService.create({
            ...potentialConvo,
            date_created: new Date().toISOString(),
            date_last_message: new Date().toISOString(),
          });

          // Reset potential conversation
          setPotentialConvo(null);

          // Rerender the conversations with the new created conversation
          setConversations(conversations.concat(newConvo));

          // Set new conversation to be the active conversation
          setSelectedConversationId(newConvo.id);

          // Create the first message
          addedMessage = await messageService.create({
            text: newMessage,
            sent_time: newConvo.date_last_message,
            seen_time: null,
            id_sender: sessionUserId,
            id_receiver: correspondantId,
            id_convo: newConvo.id,
          });

          // Reset new message state
          setNewMessage("");

          // Rerender the conversations messages of the sender with the new message
          setConvoMessages(convoMessages.concat(addedMessage));

          // Open a private socket connection with the receiver
          openWebSocketConnection(newConvo.id);

          // Store the first message so that it can be sent once the connection has been established
          // setMessageToSend(addedMessage);

          // Inform receiver that a new message was sent
          generalSocketConnection.send(JSON.stringify(addedMessage));
        } else {
          // Create the new message
          addedMessage = await messageService.create({
            text: newMessage,
            sent_time: new Date().toISOString(),
            seen_time: null,
            id_sender: sessionUserId,
            id_receiver: correspondantId,
            id_convo: selectedConversationId,
          });

          // Rerender the conversation messages of the sender
          setConvoMessages(convoMessages.concat(addedMessage));

          // Reset new message prompt
          setNewMessage("");

          // Update the date of the last message for the active conversation
          // and rerender the conversations of the sender
          conversationService
            .modifyConvo(selectedConversationId, {
              new_time: new Date().toISOString(),
            })
            .then((convos) => {
              const userConvos = convos.filter(
                (c) =>
                  c.id_creator === addedMessage.id_sender ||
                  c.id_correspondant === addedMessage.id_sender
              );
              setConversations(userConvos);
            })
            .catch((e) => console.error(e));

          // Send the new message to the receiver over the private connection
          generalSocketConnection.send(JSON.stringify(addedMessage));
        }
      } catch (error) {
        // Handle the error appropriately
        console.error("Error submitting message:", error);
      }
    }
  };

  const handleConvoSideOpen = async (convo) => {
    if (potentialConvo) {
      console.log("Setting potential convo to null");
      setPotentialConvo(null);
    }

    setSelectedConversationId(convo.id);
    setCorrespondantId(
      sessionUserId === convo.id_creator
        ? convo.id_correspondant
        : convo.id_creator
    );

    // Fetch previous convo messages
    const messages = await messageService.getConvoMessages(convo.id);
    setConvoMessages(messages);
  };

  const openWebSocketConnection = (convoId) => {
    const conn = new WebSocket(`ws://localhost:8080/${convoId}`);

    conn.onopen = (e) => {
      console.log("Public connection established!");
      setGeneralSocketConnection(conn);
    };

    conn.onmessage = (e) => {
      console.log("Setting broadcast:", e.data);
      setBroadcast(JSON.parse(e.data));
    };
  };

  conversations.sort((c1, c2) => {
    return compareConvoDates(c1.date_last_message, c2.date_last_message);
  });

  if (convoMessages) {
    convoMessages.sort((m1, m2) => {
      return compareMessageDates(m1.sent_time - m2.sent_time);
    });
  }

  return (
    <div className="h-screen flex flex-col gap-3 py-4">
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
