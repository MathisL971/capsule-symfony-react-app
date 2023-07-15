import React from "react";
import TextPrompt from "./TextPrompt";
import ChatBubble from "./ChatBubble";

import { useMessages } from "../contexts/ChatContext";

const MessageThread = () => {
  const messages = useMessages();

  messages.sort((m1, m2) => {
    return m1.sentTime - m2.sentTime;
  });

  const sessionUserId = 1;

  return (
    <div className="flex flex-col gap-2 w-2/3 border-2 border-slate-400 rounded-lg p-2">
      <div className="flex flex-col gap-1 flex-grow">
        {messages.map((m) => {
          return (
            <div
              key={m.id}
              className={
                m.id_sender === sessionUserId
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
