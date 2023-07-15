import React, { useState } from "react";
import ConversationCard from "./ConversationCard";
import Button from "./Button";

import { useConversations } from "../contexts/ChatContext";

const ConversationsBar = () => {
  const conversations = useConversations();
  conversations.sort((c1, c2) => c1.date_last_message - c2.date_last_message);

  const [selectedConvo, setSelectedConvo] = useState(null);

  const handleConvoOpen = (id) => {
    setSelectedConvo(id);
  };

  return (
    <div className="flex flex-col w-1/3 gap-2 border-2 border-slate-400 rounded-lg p-2">
      <div className="flex flex-col gap-1 flex-grow">
        {conversations.map((c) => {
          return (
            <ConversationCard
              key={c.id}
              convo={c}
              onClick={handleConvoOpen}
              styles={
                selectedConvo === c.id
                  ? "bg-slate-400 px-4 py-2 rounded-md"
                  : "bg-white px-4 py-2 rounded-md hover:bg-slate-400"
              }
            />
          );
        })}
      </div>
      <Button
        text={"Nouvelle Conversation"}
        styles={
          "rounded-lg bg-teal-950 py-4 text-teal-50 font-extrabold shadow-lg"
        }
      ></Button>
    </div>
  );
};

export default ConversationsBar;
