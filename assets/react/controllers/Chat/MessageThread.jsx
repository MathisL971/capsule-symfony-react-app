import React, { useRef, useEffect } from "react";
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
  const scrollableContainerRef = useRef(null);

  // Function to update the scroll position of the container to stick to the bottom
  const scrollToBottom = () => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversationMessages]);

  if (activeConversationMessages) {
    activeConversationMessages.sort((m1, m2) => {
      return compareMessageDates(m1.date_sent - m2.date_sent);
    });
  }

  return (
    <div className="flex flex-col gap-2 w-2/3 border-2 border-slate-400 rounded-lg p-2">
      <div
        className="flex flex-col gap-1 flex-grow overflow-y-scroll"
        ref={scrollableContainerRef}
      >
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
