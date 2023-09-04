import React from "react";
import { useSelector, useDispatch } from "react-redux";

const MessagesHeader = () => {
  const dispatch = useDispatch();

  const { activeConversation } = useSelector((state) => state.conversations);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="sm:hidden flex flex-row justify-between p-2 bg-slate-200 rounded-lg">
      <button
        type="button"
        className="rounded-lg bg-teal-500 py-2 px-4 text-white font-semibold"
        onClick={() =>
          dispatch({
            type: "MAKE_CONVERSATION_INACTIVE",
          })
        }
      >
        Retour
      </button>
      <div className="flex flex-col my-auto px-2 justify-between">
        <h3 className="flex font-semibold justify-end">
          {activeConversation?.idCreator === user?.id
            ? activeConversation?.idCorrespondant
            : activeConversation?.idCreator}
        </h3>
        <p className="flex font-light text-sm justify-end">
          Last seen: x minutes ago
        </p>
      </div>
    </div>
  );
};

export default MessagesHeader;
