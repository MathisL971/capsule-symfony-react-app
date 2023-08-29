import React from "react";
import getLoggedInPages, { loggedOutPages } from "./pages/pages";

const NavLinks = ({ user }) => {
  return (
    <div className="hidden lg:flex flex-row h-full my-auto">
      {user
        ? getLoggedInPages(user.role).map(({ name, developed }) => {
            return (
              <a
                key={name}
                href={`/${user.role}/${name}`}
                className={`${
                  developed ? "block" : "hidden"
                } rounded-lg px-4 py-2 my-auto text-sm font-normal text-white hover:bg-teal-900`}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </a>
            );
          })
        : loggedOutPages.map(({ name, url, developed }) => {
            return (
              <a
                key={name}
                href={`/${url}`}
                className={`${
                  developed ? "block" : "hidden"
                } rounded-lg px-4 py-2 my-auto text-sm font-normal text-white hover:bg-teal-900`}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </a>
            );
          })}
    </div>
  );
};

export default NavLinks;
