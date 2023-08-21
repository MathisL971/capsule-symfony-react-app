import React from "react";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

import { conversationUpdateNewMessageStatusAction } from "../../reducers/conversations";

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

export default function UserSearchBar({ handleConvoSideOpen }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { connections } = useSelector((state) => state.connections);
  const { conversations, activeConversation } = useSelector(
    (state) => state.conversations
  );

  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const handleConvoSearchOpen = async (connection) => {
    try {
      const existingConvo = conversations.find(
        (convo) => convo.id_connection === connection.id
      );
      if (existingConvo) {
        handleConvoSideOpen(existingConvo, user);
      } else {
        if (activeConversation) {
          const updatedConversation =
            user.id === activeConversation.id_creator
              ? { ...activeConversation, creator_has_new_message: false }
              : { ...activeConversation, correspondant_has_new_message: false };
          dispatch(
            conversationUpdateNewMessageStatusAction(updatedConversation)
          );
        }
        dispatch({
          type: "CREATE_POTENTIAL_CONVERSATION",
          payload: {
            id: generateRandomId(20),
            id_connection: connection.id,
            date_created: new Date().toISOString(),
            date_last_message: null,
            id_creator: user.id,
            id_correspondant: connection.id,
            id_last_sender: user.id,
            creator_has_new_message: false,
            correspondant_has_new_message: false,
          },
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
          connection.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div>
      <Combobox value={query} onChange={setQuery}>
        <div className="relative">
          <div>
            <Combobox.Input
              className="border-2 border-slate-400 rounded-lg w-full py-2 px-2 text-base leading-5 text-gray-900 focus:ring-0"
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
                    value={connection.name}
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
                          {connection.name}
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
    </div>
  );
}
