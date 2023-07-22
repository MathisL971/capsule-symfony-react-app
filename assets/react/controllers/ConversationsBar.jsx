import React from "react";
import ConversationCard from "./ConversationCard";
import UserSearchBar from "./UserSearchBar";

const ConversationsBar = ({
  connections,
  conversations,
  potentialConvo,
  selectedConversationId,
  handleConvoSideOpen,
  handleConvoSearchOpen,
}) => {
  return (
    <div className="flex flex-col w-1/3 gap-2 border-2 border-slate-400 rounded-lg p-2">
      <UserSearchBar
        handleConvoSearchOpen={handleConvoSearchOpen}
        connections={connections}
      />

      <div className="flex flex-col gap-1 flex-grow">
        {potentialConvo && (
          <ConversationCard
            convo={potentialConvo}
            connections={connections}
            handleConvoSideOpen={handleConvoSideOpen}
            selectedConversationId={selectedConversationId}
            styles={
              selectedConversationId === potentialConvo.id
                ? "bg-slate-300 px-4 py-2 rounded-md"
                : "bg-white px-4 py-2 rounded-md hover:bg-slate-300"
            }
          />
        )}
        {conversations.map((c) => {
          return (
            <ConversationCard
              key={c.id}
              convo={c}
              connections={connections}
              handleConvoSideOpen={handleConvoSideOpen}
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
