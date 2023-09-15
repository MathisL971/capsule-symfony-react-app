import React, { useRef, useEffect } from "react";
import TextPrompt from "./TextPrompt";
import ChatBubble from "./ChatBubble";
import MessagesHeader from "./MessagesHeader";

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
  const {
    activeConversationMessages,
    activeConversation,
    potentialConversation,
  } = useSelector((state) => state.conversations);
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
      return compareMessageDates(m1.dateSent - m2.dateSent);
    });
  }

  let style;
  if (activeConversation || potentialConversation) {
    style =
      "flex flex-col w-full sm:w-2/3 gap-2 border-2 border-teal-950 bg-teal-800 rounded-lg p-2";
  } else {
    style =
      "hidden sm:flex flex-col w-2/3 gap-2 border-2 border-teal-950 bg-teal-800 rounded-lg p-2";
  }

  return (
    <div className={style}>
      <MessagesHeader />
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
                  m.idSender === user.id
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
