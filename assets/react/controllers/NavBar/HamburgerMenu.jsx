import React from "react";
import Button from "../Utility/Button";
import getLoggedInPages, { loggedOutPages } from "./pages/pages";

const HamburgerMenu = ({ user, isCollapsed }) => {
  const pages = user ? getLoggedInPages(user.role) : loggedOutPages;

  return (
    <div
      className={`${
        isCollapsed ? "hidden" : "flex"
      } relative w-full flex-col gap-1 inset-0 p-2 text-base lg:hidden bg-white rounded-lg shadow`}
      id="dropdown-menu"
    >
      {pages.map(({ name, url, developed }) => {
        return (
          <a
            key={name}
            href={user ? `/${user.role}/${url}` : `/${url}`}
            className={`${
              developed ? "block" : "hidden"
            } rounded-lg px-4 py-2 my-auto text-sm font-medium text-black hover:bg-slate-200`}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </a>
        );
      })}

      {!user && (
        <Button
          id="login-nav-button"
          text={"Se Connecter"}
          type={"button"}
          style={
            "text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
          }
          onClick={() => (window.location.href = "/login")}
        />
      )}
      {!user && (
        <Button
          id="signup-nav-button"
          text={"S'inscrire"}
          type={"button"}
          style={
            "text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
          }
          onClick={() => (window.location.href = "/signup")}
        />
      )}
    </div>
  );
};

export default HamburgerMenu;
