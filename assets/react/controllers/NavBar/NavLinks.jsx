import React from "react";
import getLoggedInPages, { loggedOutPages } from "./pages/pages";

const NavLinks = ({ user }) => {
  const pages = user ? getLoggedInPages(user.role) : loggedOutPages;

  return (
    <div className="hidden lg:flex flex-row h-full my-auto">
      {pages.map(({ name, url, developed }) => {
        return (
          <a
            key={name}
            href={user ? `/${user.role}/${url}` : `/${url}`}
            className={`${
              developed ? "block" : "hidden"
            } rounded-lg px-4 py-2 my-auto text-sm font-medium text-white hover:bg-teal-400`}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </a>
        );
      })}
    </div>
  );
};

export default NavLinks;
