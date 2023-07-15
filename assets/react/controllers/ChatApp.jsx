import React, { useEffect, useState } from "react";
import ConversationsBar from "./ConversationsBar";
import MessageThread from "./MessageThread";

import { ChatContextProvider } from "../contexts/ChatContext";

const ChatApp = () => {
  return (
    <div className="h-screen">
      <ChatContextProvider>
        <div className="flex flex-row h-5/6 gap-1">
          <ConversationsBar />
          <MessageThread />
        </div>
      </ChatContextProvider>
    </div>
  );
};

export default ChatApp;
