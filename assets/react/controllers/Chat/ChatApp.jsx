import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ConversationsBar from "./ConversationsBar";
import MessageThread from "./MessageThread";

// Actions
import {
  conversationFetchAction,
  conversationOpenMessagesAction,
} from "../../reducers/conversations";

import { connectionFetchAction } from "../../reducers/connections";

const GENERAL_SOCKET_CONNECTION_ID = "123456789";

const ChatApp = () => {
  const dispatch = useDispatch();

  const { conversations, activeConversation, potentialConversation } =
    useSelector((state) => state.conversations);

  const { user } = useSelector((state) => state.user);

  const [broadcast, setBroadcast] = useState(null);

  // Initial data fetching
  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("sessionUser"));

    if (!loggedInUser) {
      window.location.href = "/login";
    } else {
      dispatch({ type: "LOGIN", payload: loggedInUser });
    }

    dispatch(conversationFetchAction(loggedInUser.id));
    dispatch(connectionFetchAction(loggedInUser.id));

    openWebSocketConnection();
  }, []);

  useEffect(() => {
    if (broadcast) {
      const { message, conversation } = broadcast;

      // If listener is the correspondant
      if (message.id_receiver === user.id) {
        const existingConvo = conversations.find(
          (c) => c.id_convo === conversation.id_convo
        );

        // If convo already existed
        if (existingConvo) {
          // Update receiver conversation order
          dispatch({
            type: "UPDATE_CONVERSATION_RECEIVER",
            payload: message,
          });
          // If convo was the active convo
          if (
            activeConversation &&
            activeConversation.id_convo === existingConvo.id_convo
          ) {
            // Update receiver message feed
            dispatch({
              type: "UPDATE_RECEIVER_MESSAGES",
              payload: message,
            });
          }
        }
        // Else
        else {
          // Add new conversation to conversations
          dispatch({
            type: "ADD_CONVERSATION_RECEIVER",
            payload: conversation,
          });

          // If receiver was about to send his first message to the sender
          if (
            potentialConversation &&
            potentialConversation.id_correspondant === message.id_sender
          ) {
            // Scrap potential convo
            dispatch({
              type: "ABORT_POTENTIAL_CONVERSATION_AND_SWITCH",
              payload: {
                newConversation: conversation,
                newMessage: message,
              },
            });
          }
        }
      }
    }
  }, [broadcast]);

  const openWebSocketConnection = () => {
    const conn = new WebSocket(
      `ws://localhost:8080/${GENERAL_SOCKET_CONNECTION_ID}`
    );

    conn.onopen = (e) => {
      console.log("Public connection established!");
      dispatch({ type: "SET", payload: e.target });
    };

    conn.onmessage = (e) => {
      const { message, conversation } = JSON.parse(e.data);
      setBroadcast({
        message,
        conversation,
      });
    };
  };

  const handleConvoSideOpen = async (conversationToOpen) => {
    if (potentialConversation) {
      dispatch({
        type: "ABORT_POTENTIAL_CONVERSATION",
      });
    }

    dispatch(conversationOpenMessagesAction(conversationToOpen));
  };

  return (
    <div className="h-screen flex flex-col gap-3 py-4">
      {user && (
        <div className="flex flex-row justify-center">
          <h1 className="text-2xl font-extrabold">{user.username}</h1>
        </div>
      )}
      <div className="flex flex-row h-5/6 gap-1">
        <ConversationsBar handleConvoSideOpen={handleConvoSideOpen} />
        <MessageThread />
      </div>
    </div>
  );
};

export default ChatApp;
