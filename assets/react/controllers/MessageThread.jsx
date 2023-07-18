import React from "react";
import TextPrompt from "./TextPrompt";
import ChatBubble from "./ChatBubble";

const MessageThread = ({
  messages,
  onMessageSubmit,
  setNewMessage,
  newMessage,
  selectedConversationId,
  sessionUserId,
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
    <div className="flex flex-col gap-2 w-2/3 border-2 border-slate-400 rounded-lg p-2">
      <div className="flex flex-col gap-1 flex-grow">
        {messages.length > 0 &&
          messages
            .sort((m1, m2) => {
              return compareDates(m1.sent_time - m2.sent_time);
            })
            .map((m) => {
              return (
                <div
                  key={m.id}
                  className={
                    m.id_sender === sessionUserId
                      ? "flex flex-row justify-end"
                      : "flex flex-row justify-start"
                  }
                >
                  <ChatBubble message={m} sessionUserId={sessionUserId} />
                </div>
              );
            })}
      </div>
      <TextPrompt
        handleSubmit={onMessageSubmit}
        value={newMessage}
        setNewMessage={setNewMessage}
        selectedConversationId={selectedConversationId}
      />
    </div>
  );
};

export default MessageThread;
