import React from "react";
import Button from "../Utility/Button";

const UserMenu = ({ user, handleLogout, isCollapsed }) => {
  const settings = [
    { name: "profil", developed: true },
    { name: "paramètres", developed: false },
  ];

  return (
    <div
      className={`${isCollapsed ? "hidden" : "flex"} flex w-full justify-end`}
      id="user-menu"
    >
      <div
        className={`relative flex-col p-3 gap-1 inset-0 text-base w-fit bg-white rounded-lg shadow`}
      >
        <div className="pt-2 px-1">
          <span className="block text-sm font-medium text-gray-900">
            {user.username}
          </span>
        </div>
        <ul className="py-2 list-none">
          {settings.map(({ name, developed }) => {
            return (
              <li key={name}>
                <a
                  href={`/${user.role}/${name}`}
                  className={`${
                    developed ? "block" : "hidden"
                  } px-4 py-2 rounded-lg text-sm text-black hover:bg-slate-200`}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </a>
              </li>
            );
          })}
        </ul>
        <Button
          id={"user-menu-logout-button"}
          text={"Se Déconnecter"}
          type={"button"}
          style={
            "w-full text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
          }
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default UserMenu;
