import React from "react";

const ConversationCard = ({ convo, styles, onClick }) => {
  const { id_correspondant } = convo;

  return (
    <div className={styles} onClick={() => onClick(convo.id)}>
      <span className="bg-gray-300 rounded-full w-20 h-20"></span>
      <div>
        <p className="font-bold">Correspondant Id: {id_correspondant}</p>
        <p>{"First name, Last name"}</p>
      </div>
    </div>
  );
};

export default ConversationCard;
