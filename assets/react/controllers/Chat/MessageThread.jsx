import React from "react";
import TextPrompt from "./TextPrompt";
import ChatBubble from "./ChatBubble";

import { useSelector } from "react-redux";

function compareMessageDates(date1, date2) {
  if (date1 > date2) {
    return 1;
  } else if (date1 < date2) {
    return -1;
  } else {
    return 0;
  }
}

const MessageThread = () => {
  const { activeConversationMessages } = useSelector(
    (state) => state.conversations
  );

  const { user } = useSelector((state) => state.user);

  if (activeConversationMessages) {
    activeConversationMessages.sort((m1, m2) => {
      return compareMessageDates(m1.sent_time - m2.sent_time);
    });
  }

  return (
    <div className="flex flex-col gap-2 w-2/3 border-2 border-slate-400 rounded-lg p-2">
      <div className="flex flex-col gap-1 flex-grow">
        {activeConversationMessages.length > 0 &&
          activeConversationMessages.map((m) => {
            return (
              <div
                key={m.id}
                className={
                  m.id_sender === user.id
                    ? "flex flex-row justify-end"
                    : "flex flex-row justify-start"
                }
              >
                <ChatBubble message={m} />
              </div>
            );
          })}
      </div>
      <TextPrompt />
    </div>
  );
};

export default MessageThread;
