import React from "react";
import { useSelector } from "react-redux";

const ConversationCard = ({ conversation, styles, handleConvoSideOpen }) => {
  const { connections } = useSelector((state) => state.connections);
  const { activeConversation } = useSelector((state) => state.conversations);
  const { user } = useSelector((state) => state.user);

  let style;
  switch (styles) {
    case "active":
      style =
        "bg-teal-600 p-3 text-white rounded-lg font-semibold border-2 border-teal-950";
      break;
    case "inactive":
      style =
        "bg-slate-100 p-3 rounded-lg font-normal hover:bg-slate-300 border-slate-300";
      break;
    case "new_message":
      style =
        "bg-teal-400 text-white p-3 rounded-lg font-bold shadow hover:bg-teal-300";
      break;
    default:
      style = "";
  }

  const connection = connections.find(
    (c) =>
      (c.id === conversation.idCreator ||
        c.id === conversation.idCorrespondant) &&
      c.id !== user.id
  );

  return (
    <div
      className={style}
      onClick={() => {
        if (
          !activeConversation ||
          (activeConversation && activeConversation.id !== conversation.id)
        ) {
          handleConvoSideOpen(conversation, user);
        }
      }}
    >
      <span className="bg-gray-300 rounded-full w-20 h-20"></span>
      {connection && <h2>{connection.username}</h2>}
    </div>
  );
};

export default ConversationCard;
