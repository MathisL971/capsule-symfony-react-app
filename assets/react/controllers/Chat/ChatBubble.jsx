import React from "react";
import { useSelector } from "react-redux";

const ChatBubble = ({ message }) => {
  const { text, id_sender } = message;

  const { user } = useSelector((state) => state.user);

  return (
    <div
      className={
        id_sender === user.id
          ? "flex flex-row w-fit bg-teal-700 rounded-lg font-medium text-white px-3 py-2"
          : "flex flex-row w-fit bg-slate-300 rounded-lg font-medium text-black px-3 py-2"
      }
    >
      <p>{text}</p>
    </div>
  );
};

export default ChatBubble;
