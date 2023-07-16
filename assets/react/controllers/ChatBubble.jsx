import React from "react";

const ChatBubble = ({ message, sessionUserId }) => {
  const { text, id_sender } = message;

  return (
    <div
      className={
        id_sender === sessionUserId
          ? "flex flex-row w-fit bg-teal-500 rounded-full px-3 py-1"
          : "flex flex-row w-fit bg-slate-300 rounded-full px-3 py-1"
      }
    >
      <p>{text}</p>
    </div>
  );
};

export default ChatBubble;
