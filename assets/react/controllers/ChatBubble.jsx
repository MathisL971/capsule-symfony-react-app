import React from "react";

const ChatBubble = ({ message, sessionUserId }) => {
  const { text, id_sender } = message;

  return (
    <div
      className={
        id_sender === sessionUserId
          ? "flex flex-row w-fit bg-teal-700 rounded-lg font-medium text-white px-3 py-2"
          : "flex flex-row w-fit bg-slate-300 rounded-lg font-medium text-black px-3 py-2"
      }
    >
      <p>{text}</p>
    </div>
  );
};

export default ChatBubble;
