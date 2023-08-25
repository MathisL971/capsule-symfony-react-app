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
    <div
      className={`${
        activeConversation ? "hidden sm:flex" : "flex"
      } flex-col w-full sm:w-1/3 gap-1 border-2 border-teal-950 bg-teal-800 rounded-lg p-2`}
    >
      <UserSearchBar handleConvoSideOpen={handleConvoSideOpen} />
      <div className="flex flex-col gap-1 flex-grow">
        {potentialConversation && (
          <ConversationCard
            conversation={potentialConversation}
            handleConvoSideOpen={handleConvoSideOpen}
            styles={"active"}
          />
        )}
        {conversations &&
          conversations.map((c) => {
            let style;

            if (activeConversation && activeConversation.id === c.id) {
              style = "active";
            } else if (
              (c.id_creator === user.id && c.creator_has_new_message) ||
              (c.id_correspondant === user.id &&
                c.correspondant_has_new_message)
            ) {
              style = "new_message";
            } else {
              style = "inactive";
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
