import React from "react";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

import { conversationUpdateNewMessageStatusAction } from "../../reducers/conversations";

export default function UserSearchBar({ handleConvoSideOpen, enterConvo }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { connections } = useSelector((state) => state.connections);
  const { conversations, activeConversation } = useSelector(
    (state) => state.conversations
  );

  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const handleConvoSearchOpen = async (connection) => {
    setQuery("");
    try {
      const existingConvo = conversations.find(
        (convo) =>
          convo.idCreator === connection.id ||
          convo.idCorrespondant === connection.id
      );
      if (existingConvo) {
        handleConvoSideOpen(existingConvo, user);
      } else {
        // If currently in another convo, perform logic for new message card style (TO REVIEW)
        if (activeConversation) {
          const updatedConversation =
            user.id === activeConversation.idCreator
              ? { ...activeConversation, creatorHasNewMessage: false }
              : { ...activeConversation, correspondantHasNewMessage: false };
          dispatch(
            conversationUpdateNewMessageStatusAction(updatedConversation)
          );
        }

        const newConvo = {
          idConnection: connection.id,
          dateCreated: new Date().toISOString(),
          dateLastMessage: null,
          idCreator: user.id,
          idCorrespondant: connection.id,
          idLastSender: user.id,
          creatorHasNewMessage: false,
          correspondantHasNewMessage: false,
        };

        dispatch({
          type: "CREATE_POTENTIAL_CONVERSATION",
          payload: newConvo,
        });
      }
    } catch (error) {
      // Handle the error appropriately
      console.error("Error opening conversation:", error);
    }
  };

  const filteredConnections =
    query === ""
      ? connections
      : connections.filter((connection) =>
          connection.username
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={query} onChange={setQuery}>
      <div className=" static">
        <div>
          <Combobox.Input
            className="border-2 border-teal-950 rounded-lg w-full p-3 text-base leading-5 text-gray-900 focus:ring-0"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Recherchez une personne dans vos contacts..."
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredConnections &&
            filteredConnections.length === 0 &&
            query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredConnections &&
              filteredConnections.map((connection) => (
                <Combobox.Option
                  key={connection.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={connection.username}
                  onClick={() => {
                    handleConvoSearchOpen(connection);
                  }}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {connection.username}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        ></span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
