import React from "react";

const ConversationCard = ({
  convo,
  connections,
  styles,
  handleConvoSideOpen,
  selectedConversationId,
}) => {
  const connection = connections.find(
    (c) => c.id === convo.id_creator || c.id === convo.id_correspondant
  );

  return (
    <div
      className={styles}
      onClick={() => {
        if (selectedConversationId !== convo.id) handleConvoSideOpen(convo);
      }}
    >
      <span className="bg-gray-300 rounded-full w-20 h-20"></span>
      {connection && <h2>{connection.name}</h2>}
    </div>
  );
};

export default ConversationCard;
