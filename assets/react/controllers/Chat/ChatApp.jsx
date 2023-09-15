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

const ChatApp = ({ user }) => {
  const dispatch = useDispatch();

  const { conversations, activeConversation, potentialConversation } =
    useSelector((state) => state.conversations);

  const [broadcast, setBroadcast] = useState(null);

  // Initial data fetching
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    } else {
      dispatch({ type: "LOGIN", payload: user });
      dispatch(conversationFetchAction(user.id));
      dispatch(connectionFetchAction(user.id));
      openWebSocketConnection();
    }
  }, []);

  useEffect(() => {
    if (broadcast) {
      const { addedMessage, updatedConversation } = broadcast;

      // If listener is the correspondant
      if (addedMessage.idReceiver === user.id) {
        // Find out if the conversation already exists
        const existingConvo = conversations.find(
          (c) => c.id === updatedConversation.id
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
            activeConversation.id === existingConvo.id
          ) {
            dispatch(
              conversationUpdateNewMessageStatusAction(
                updatedConversation.idCreator === user.id
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
            potentialConversation.idCorrespondant === addedMessage.idSender
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

    // Fetch messages
    dispatch(conversationOpenMessagesAction(conversationToOpen, user));
  };

  return (
    <div className="flex flex-col gap-3 py-4 h-screen">
      {user && (
        <div className="flex flex-row justify-center">
          <h1 className="text-2xl font-extrabold">
            Messages de {user.username}
          </h1>
        </div>
      )}
      <div className="flex flex-row grow sm:gap-1">
        <ConversationsBar handleConvoSideOpen={handleConvoSideOpen} />
        <MessageThread />
      </div>
    </div>
  );
};

export default ChatApp;
