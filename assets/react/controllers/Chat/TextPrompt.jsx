import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  conversationAddMessageAction,
  conversationAddAction,
  conversationUpdateAction,
} from "../../reducers/conversations";

const TextPrompt = () => {
  const dispatch = useDispatch();

  const [newMessage, setNewMessage] = useState("");

  const {
    activeConversation,
    potentialConversation,
    activeConversationMessages,
  } = useSelector((state) => state.conversations);

  const { user } = useSelector((state) => state.user);

  const { connection } = useSelector((state) => state.socket);

  const onMessageSubmit = async (e) => {
    e.preventDefault();

    if (newMessage.length == 0) {
      return -1;
    } else {
      try {
        let addedMessage;

        // If a potential conversation has been initiated
        if (potentialConversation) {
          const newConvo = {
            ...potentialConversation,
            dateLastMessage: new Date().toISOString(),
            correspondantHasNewMessage: true,
          };

          dispatch(conversationAddAction(newConvo)).then((returnedConvo) => {
            addedMessage = {
              text: newMessage,
              dateSent: new Date().toISOString(),
              idSender: user.id,
              idReceiver: returnedConvo.idCorrespondant,
              idConversation: returnedConvo.id,
            };
            dispatch(conversationAddMessageAction(addedMessage)).then(
              (returnedMessage) => {
                connection.send(
                  JSON.stringify({
                    addedMessage: returnedMessage,
                    updatedConversation: returnedConvo,
                  })
                );
              }
            );
          });
        } else {
          addedMessage = {
            text: newMessage,
            dateSent: new Date().toISOString(),
            idSender: user.id,
            idReceiver:
              user.id === activeConversation.idCorrespondant
                ? activeConversation.idCreator
                : activeConversation.idCorrespondant,
            idConversation: activeConversation.id,
          };
          dispatch(conversationAddMessageAction(addedMessage)).then(
            (returnedMessage) => {
              let updatedConversation = {
                ...activeConversation,
                dateLastMessage: returnedMessage.dateSent,
                idLastSender: returnedMessage.idSender,
              };
              updatedConversation =
                user.id === updatedConversation.idCreator
                  ? { ...updatedConversation, correspondantHasNewMessage: true }
                  : {
                      ...updatedConversation,
                      creatorHasNewMessage: true,
                    };
              dispatch(conversationUpdateAction(updatedConversation)).then(
                (returnedConvo) => {
                  connection.send(
                    JSON.stringify({
                      addedMessage: returnedMessage,
                      updatedConversation: returnedConvo,
                    })
                  );
                }
              );
            }
          );
        }

        // Reset new message prompt
        setNewMessage("");
      } catch (error) {
        // Handle the error appropriately
        console.error("Error submitting message:", error);
      }
    }
  };

  return (
    <form
      onSubmit={onMessageSubmit}
      className="flex flex-col gap-1 w-full sm:flex-row"
    >
      <input
        type="textarea"
        value={newMessage}
        onChange={({ target }) => setNewMessage(target.value)}
        placeholder="Tapez votre message ici..."
        className="flex flex-grow rounded-lg border-2 border-teal-950 p-2"
      ></input>
      {activeConversation || potentialConversation ? (
        <button
          type="submit"
          className={
            "rounded-lg bg-teal-500 py-2 px-4 text-teal-50 font-bold shadow-lg"
          }
        >
          {"Send"}
        </button>
      ) : (
        <button
          type="submit"
          disabled
          className={
            "rounded-lg bg-teal-500 py-2 px-4 text-teal-50 font-bold shadow-lg disabled:bg-teal-100"
          }
        >
          {"Send"}
        </button>
      )}
    </form>
  );
};

export default TextPrompt;
