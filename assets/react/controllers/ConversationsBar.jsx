import React from "react";
import ConversationCard from "./ConversationCard";
import UserSearchBar from "./UserSearchBar";

const ConversationsBar = ({
  sessionUserId,
  connections,
  conversations,
  potentialConvo,
  selectedConversationId,
  handleConvoSideOpen,
  handleConvoSearchOpen,
}) => {
  function compareDates(date1, date2) {
    if (date1 > date2) {
      return 1;
    } else if (date1 < date2) {
      return -1;
    } else {
      return 0;
    }
  }

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
            sessionUserId={sessionUserId}
            handleConvoSideOpen={handleConvoSideOpen}
            selectedConversationId={selectedConversationId}
            styles={
              selectedConversationId === potentialConvo.id
                ? "bg-slate-300 px-4 py-2 rounded-md"
                : "bg-white px-4 py-2 rounded-md hover:bg-slate-300"
            }
          />
        )}
        {conversations
          .sort((c1, c2) => {
            return compareDates(c1.date_last_message, c2.date_last_message);
          })
          .map((c) => {
            return (
              <ConversationCard
                key={c.id}
                convo={c}
                connections={connections}
                sessionUserId={sessionUserId}
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
