import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ConversationsBar from "./ConversationsBar";
import MessageThread from "./MessageThread";

// Actions
import {
  conversationFetchAction,
  conversationOpenMessagesAction,
  conversationUpdateNewMessageStatusAction,
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
      const { addedMessage, updatedConversation } = broadcast;

      // If listener is the correspondant
      if (addedMessage.id_receiver === user.id) {
        // Find out if the conversation already exists
        const existingConvo = conversations.find(
          (c) => c.id_convo === updatedConversation.id_convo
        );

        // If convo already exists
        if (existingConvo) {
          // Update receiver conversation order
          dispatch({
            type: "UPDATE_CONVERSATION_RECEIVER",
            payload: updatedConversation,
          });

          // If convo was the active convo
          if (
            activeConversation &&
            activeConversation.id_convo === existingConvo.id_convo
          ) {
            dispatch(
              conversationUpdateNewMessageStatusAction(
                updatedConversation.id_creator === user.id
                  ? { ...updatedConversation, creatorHasNewMessage: false }
                  : {
                      ...updatedConversation,
                      correspondantHasNewMessage: false,
                    }
              )
            );

            // Update receiver message feed
            dispatch({
              type: "UPDATE_RECEIVER_MESSAGES",
              payload: addedMessage,
            });
          }
        }
        // Else
        else {
          // Add new conversation to conversations
          dispatch({
            type: "ADD_CONVERSATION_RECEIVER",
            payload: updatedConversation,
          });

          // If receiver was about to send his first message to the sender
          if (
            potentialConversation &&
            potentialConversation.id_correspondant === addedMessage.id_sender
          ) {
            // Scrap potential convo
            dispatch({
              type: "ABORT_POTENTIAL_CONVERSATION_AND_SWITCH",
              payload: {
                newConversation: updatedConversation,
                newMessage: addedMessage,
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
      dispatch({ type: "SET", payload: e.target });
    };

    conn.onmessage = (e) => {
      const { addedMessage, updatedConversation } = JSON.parse(e.data);
      setBroadcast({
        addedMessage,
        updatedConversation,
      });
    };
  };

  const handleConvoSideOpen = async (conversationToOpen, userOpening) => {
    // If potential conversation was about to be initialized
    if (potentialConversation) {
      // Scrap it
      dispatch({
        type: "ABORT_POTENTIAL_CONVERSATION",
      });
    }

    // Turn inactive conversation card into active conversation card
    dispatch({ type: "MAKE_CONVERSATION_ACTIVE", payload: conversationToOpen });

    // Load conversation messages
    dispatch(conversationOpenMessagesAction(conversationToOpen, userOpening));
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
