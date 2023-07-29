import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  conversationAddMessageAction,
  conversationAddAction,
} from "../../reducers/conversations";

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

const TextPrompt = () => {
  const dispatch = useDispatch();

  const [newMessage, setNewMessage] = useState("");

  const { activeConversation, potentialConversation } = useSelector(
    (state) => state.conversations
  );

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
          addedMessage = {
            id: generateRandomId(20),
            text: newMessage,
            sent_time: new Date().toISOString(),
            seen_time: null,
            id_sender: user.id,
            id_receiver: potentialConversation.id_correspondant,
            id_convo: potentialConversation.id_convo,
          };
          const newConvo = {
            ...potentialConversation,
            date_created: new Date().toISOString(),
            date_last_message: new Date().toISOString(),
          };

          dispatch(conversationAddAction(newConvo, addedMessage));

          connection.send(
            JSON.stringify({
              message: addedMessage,
              conversation: newConvo,
            })
          );
        } else {
          addedMessage = {
            id: generateRandomId(20),
            text: newMessage,
            sent_time: new Date().toISOString(),
            seen_time: null,
            id_sender: user.id,
            id_receiver:
              user.id === activeConversation.id_correspondant
                ? activeConversation.id_creator
                : activeConversation.id_correspondant,
            id_convo: activeConversation.id_convo,
          };
          dispatch(conversationAddMessageAction(addedMessage));

          connection.send(
            JSON.stringify({
              message: addedMessage,
              conversation: activeConversation,
            })
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
    <form onSubmit={onMessageSubmit} className="flex flex-row gap-1">
      <input
        type="textarea"
        value={newMessage}
        onChange={({ target }) => setNewMessage(target.value)}
        placeholder="Tapez votre message ici..."
        className="flex flex-grow rounded-lg border-2 border-slate-400 p-2"
      ></input>
      {activeConversation ? (
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
