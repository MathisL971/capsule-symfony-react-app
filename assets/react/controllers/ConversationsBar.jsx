import React from "react";
import ConversationCard from "./ConversationCard";
import UserSearchBar from "./UserSearchBar";

const ConversationsBar = ({
  conversations,
  selectedConversationId,
  handleConvoOpen,
  createConversation,
  connections,
}) => {
  return (
    <div className="flex flex-col w-1/3 gap-2 border-2 border-slate-400 rounded-lg p-2">
      <UserSearchBar
        handleNewConvo={createConversation}
        connections={connections}
      />
      <div className="flex flex-col gap-1 flex-grow">
        {conversations
          .sort((c1, c2) => {
            return c1.date_last_message - c2.date_last_message;
          })
          .map((c) => {
            return (
              <ConversationCard
                key={c.id}
                convo={c}
                handleConvoOpen={handleConvoOpen}
                selectedConversationId={selectedConversationId}
                styles={
                  selectedConversationId === c.id
                    ? "bg-slate-300 px-4 py-2 rounded-md"
                    : "bg-white px-4 py-2 rounded-md hover:bg-slate-300"
                }
              />
            );
          })}
      </div>
    </div>
  );
};

export default ConversationsBar;
