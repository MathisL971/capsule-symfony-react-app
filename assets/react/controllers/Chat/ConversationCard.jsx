import React from "react";
import { useSelector } from "react-redux";

const ConversationCard = ({ conversation, styles, handleConvoSideOpen }) => {
  const { connections } = useSelector((state) => state.connections);
  const { activeConversation } = useSelector((state) => state.conversations);
  const { user } = useSelector((state) => state.user);

  const connection = connections.find(
    (c) =>
      c.id === conversation.id_creator || c.id === conversation.id_correspondant
  );

  return (
    <div
      className={styles}
      onClick={() => {
        if (
          !activeConversation ||
          (activeConversation &&
            activeConversation.id_convo !== conversation.id_convo)
        ) {
          handleConvoSideOpen(conversation, user);
        }
      }}
    >
      <span className="bg-gray-300 rounded-full w-20 h-20"></span>
      {connection && <h2>{connection.name}</h2>}
    </div>
  );
};

export default ConversationCard;
