import React from "react";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

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
  const { conversations } = useSelector((state) => state.conversations);

  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const handleConvoSearchOpen = async (correspondantId) => {
    try {
      const existingConvo = conversations.find(
        (convo) =>
          convo.id_correspondant === correspondantId ||
          convo.id_creator === correspondantId
      );

      if (existingConvo) {
        handleConvoSideOpen(existingConvo);
      } else {
        dispatch({
          type: "CREATE_POTENTIAL_CONVERSATION",
          payload: {
            id_convo: generateRandomId(20),
            date_created: null,
            date_last_message: null,
            id_creator: user.id,
            id_correspondant: correspondantId,
          },
        });
      }
    } catch (error) {
      // Handle the error appropriately
      console.error("Error opening conversation:", error);
    }
  };

  const filteredPeople =
    query === ""
      ? connections
      : connections.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div>
      <Combobox value={selected} onChange={setSelected}>
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
              {filteredPeople && filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople &&
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={person}
                    onClick={() => {
                      handleConvoSearchOpen(person.id);
                    }}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
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
