import React from "react";

import Button from "./Button";

const TextPrompt = () => {
  return (
    <form className="flex flex-row gap-1">
      <input className="flex flex-grow rounded-lg border-2 border-slate-400 p-2"></input>
      <Button
        text={"Send"}
        styles={
          "rounded-lg bg-teal-950 py-2 px-4 text-teal-50 font-bold shadow-lg"
        }
      />
    </form>
  );
};

export default TextPrompt;
