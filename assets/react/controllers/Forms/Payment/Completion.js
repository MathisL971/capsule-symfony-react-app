import React from "react";

function Completion({ user, role }) {
  return (
    <div className="flex flex-col w-full items-center gap-4">
      <h1 className="w-full text-center text-2xl">
        Bienvenue dans la famille Capsule! 🎉
      </h1>
      <button
        type="button"
        onClick={() => (window.location.href = `/${role}/home`)}
        className="text-white bg-teal-900 border-2 w-fit border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
      >
        Naviguer au dashboard
      </button>
    </div>
  );
}

export default Completion;
