import React from "react";
import { useSelector } from "react-redux";

import ConversationCard from "./ConversationCard";
import UserSearchBar from "./UserSearchBar";

function compareConvoDates(date1, date2) {
  if (date1 > date2) {
    return -1;
  } else if (date1 < date2) {
    return 1;
  } else {
    return 0;
  }
}

const ConversationsBar = ({ handleConvoSideOpen }) => {
  const { conversations, potentialConversation, activeConversation } =
    useSelector((state) => state.conversations);

  const { user } = useSelector((state) => state.user);

  if (conversations) {
    conversations.sort((c1, c2) => {
      return compareConvoDates(c1.date_last_message, c2.date_last_message);
    });
  }

  return (
    <div className="flex flex-col w-1/3 gap-2 border-2 border-slate-400 rounded-lg p-2">
      <UserSearchBar handleConvoSideOpen={handleConvoSideOpen} />

      <div className="flex flex-col gap-1 flex-grow">
        {potentialConversation && (
          <ConversationCard
            conversation={potentialConversation}
            handleConvoSideOpen={handleConvoSideOpen}
            styles={
              "bg-teal-500 px-4 py-3 rounded-md font-bold text-white border-2 border-teal-900"
            }
          />
        )}
        {conversations &&
          conversations.map((c) => {
            let style;

            if (activeConversation && activeConversation.id === c.id) {
              style =
                "bg-teal-500 px-4 py-3 rounded-md font-bold text-white border-2 border-teal-900";
            } else if (
              (c.id_creator === user.id && c.creator_has_new_message) ||
              (c.id_correspondant === user.id &&
                c.correspondant_has_new_message)
            ) {
              style = "bg-slate-300 px-4 py-3 rounded-md font-bold";
            } else {
              style =
                "bg-slate-100 px-4 py-3 rounded-md font-normal hover:bg-slate-300";
            }

            return (
              <ConversationCard
                key={c.id}
                conversation={c}
                handleConvoSideOpen={handleConvoSideOpen}
                styles={style}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ConversationsBar;
