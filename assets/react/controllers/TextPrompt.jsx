import React from "react";

const TextPrompt = ({
  value,
  setNewMessage,
  handleSubmit,
  selectedConversationId,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-row gap-1">
      <input
        type="textarea"
        value={value}
        onChange={({ target }) => setNewMessage(target.value)}
        className="flex flex-grow rounded-lg border-2 border-slate-400 p-2"
      ></input>
      {selectedConversationId ? (
        <button
          type="submit"
          className={
            "rounded-lg bg-teal-950 py-2 px-4 text-teal-50 font-bold shadow-lg"
          }
        >
          {"Send"}
        </button>
      ) : (
        <button
          type="submit"
          disabled
          className={
            "rounded-lg bg-teal-950 py-2 px-4 text-teal-50 font-bold shadow-lg disabled:bg-teal-100"
          }
        >
          {"Send"}
        </button>
      )}
    </form>
  );
};

export default TextPrompt;
