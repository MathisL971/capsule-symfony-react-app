// JSX found at https://flowbite.com/docs/components/navbar/

import React, { useEffect, useState } from "react";
import logoutService from "../services/logout";

const NavBar = () => {
  const [user, setUser] = useState("");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [accCollapsed, setAccCollapsed] = useState(true);

  useEffect(() => {
    setUser(sessionStorage.getItem("sessionUser"));
  }, []);

  const handleLogout = () => {
    setTimeout(async () => {
      try {
        sessionStorage.setItem("sessionUser", "");
        setUser("");
        window.location.href = "/login";
        // const result = await logoutService.logOut();
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  };

  let username;
  let role;
  if (user) {
    const userObj = JSON.parse(user);
    username = userObj.username;
    role = userObj.role;
  }

  let pages = [];
  switch (role) {
    case "ado":
      pages = [
        { name: "home", developed: true },
        { name: "journal", developed: false },
        {
          name: "ressources",
          developed: false,
          subnames: [
            { name: "videos", developed: false },
            { name: "podcasts", developed: false },
            { name: "audiobooks", developed: false },
          ],
        },
        { name: "messages", developed: true },
        { name: "family", developed: false },
        { name: "news", developed: false },
        { name: "notes", developed: false },
        { name: "community", developed: false },
        { name: "timing", developed: false },
        { name: "visio", developed: false },
      ];
      break;
    case "parent":
      pages = [
        { name: "home", developed: true },
        { name: "journal", developed: true },
        {
          name: "ressources",
          developed: false,
          subnames: [
            { name: "videos", developed: false },
            { name: "podcasts", developed: false },
            { name: "audiobooks", developed: false },
          ],
        },
        { name: "messages", developed: true },
        { name: "family", developed: false },
        { name: "news", developed: true },
        { name: "notes", developed: true },
        { name: "community", developed: false },
        { name: "timing", developed: false },
        { name: "visio", developed: false },
      ];
      break;
    case "pro":
      pages = ["journal", "messagerie", "patients", "notes", "capsule tv"];
      break;
    case "admin":
      pages = [
        "dashboard",
        "journal",
        "salon",
        "utilisateurs",
        "ressources",
        "textes",
        "revue de presse",
        "support",
      ];
      break;
    default:
  }

  const settings = [
    { name: "profil", developed: false },
    { name: "paramètres", developed: false },
  ];

  return (
    <nav className="bg-gradient-to-b from-black/50 to-white/ h-16">
      <div className="flex flex-wrap items-center justify-between mx-auto py-2.5 px-4 h-full">
        {user ? (
          // Right section of nav bar when logged in
          <div className="flex items-center md:order-2 h-full gap-3 grow justify-end">
            {/* Page Menu */}
            <div className="hidden lg:flex flex-row h-full">
              {pages.map(({ name, developed }) => {
                return (
                  <a
                    key={name}
                    href={`/${role}/${name}`}
                    className={`${
                      developed ? "block" : "hidden"
                    } rounded-lg px-4 py-2 my-auto text-sm font-medium text-white hover:bg-teal-900 dark:hover:bg-teal-900 dark:text-gray-200 dark:hover:text-white`}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </a>
                );
              })}
            </div>
            {/* Buttons */}
            <div className="flex flex-row items-center md:order-2 h-full">
              {/* Profile Button */}
              <button
                type="button"
                className="flex mr-4 text-sm rounded-full focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="true"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
                onClick={() => {
                  if (!navCollapsed) {
                    setNavCollapsed(true);
                  }
                  setAccCollapsed(!accCollapsed);
                }}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-9 h-9 rounded-full"
                  src={
                    "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
                  }
                  alt="user photo"
                />
              </button>
              {/* Hamburger Button */}
              <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded="false"
                onClick={() => {
                  if (!accCollapsed) {
                    setAccCollapsed(true);
                  }
                  setNavCollapsed(!navCollapsed);
                }}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    color="white"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Logo */}
            <a href="/" className="flex items-center h-full">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Capsule
              </span>
            </a>
            // Right section of nav bar when logged out
            <div className="flex items-center md:order-2 h-full gap-3">
              <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex lg:hidden items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded="false"
                onClick={() => setNavCollapsed(!navCollapsed)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    color="white"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="hidden lg:flex text-white border-2 border-white hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300 font-bold rounded-lg text-sm px-4 py-2.5 text-center dark:hover:bg-teal-700 dark:focus:ring-white"
                onClick={() => (window.location.href = "/login")}
              >
                Se Connecter
              </button>
              <button
                type="button"
                className="hidden lg:flex text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
                onClick={() => (window.location.href = "/signup")}
              >
                S'inscrire
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile view menu */}
      {user ? (
        <div className="flex flex-row justify-end">
          {/* Mobile Page Menu */}
          <ul
            className={`${
              navCollapsed ? "hidden" : "flex"
            } relative flex-col grow gap-1 inset-0 mx-4 m-2 p-2 text-base lg:hidden bg-white rounded-lg shadow list-none`}
            id="user-dropdown"
          >
            {pages.map(({ name, developed }) => {
              if (name === "messages") {
                return (
                  <li key={name}>
                    <a
                      href={`/${name}`}
                      className={`${
                        developed ? "block" : "hidden"
                      } px-4 py-2 rounded-lg text-sm text-black hover:bg-slate-200`}
                    >
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </a>
                  </li>
                );
              }
              return (
                <li key={name}>
                  <a
                    href={`/${role}/${name}`}
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
          {/* Profile Menu */}
          <div
            className={`${
              accCollapsed ? "hidden" : "flex"
            } relative flex-col gap-1 inset-0 mx-4 m-2 p-2 text-base bg-white rounded-lg shadow`}
            id="user-dropdown"
          >
            <div className="px-4 pt-3">
              <span className="block text-sm font-medium text-gray-900">
                Mathis Lefranc
              </span>
            </div>
            <ul className="py-2 list-none" aria-labelledby="user-menu-button">
              {settings.map(({ name, developed }) => {
                return (
                  <li key={name}>
                    <a
                      href={`/${role}/${name}`}
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
            <button
              type="button"
              className="text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
              onClick={() => handleLogout()}
            >
              Se Déconnecter
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${
            navCollapsed ? "hidden" : "flex"
          } relative flex-col gap-1 inset-0 mx-4 m-2 p-2 text-base lg:hidden bg-white rounded-lg shadow`}
          id="user-dropdown"
        >
          <button
            type="button"
            className="text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
            onClick={() => (window.location.href = "/login")}
          >
            Se Connecter
          </button>
          <button
            type="button"
            className="text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
            onClick={() => (window.location.href = "/signup")}
          >
            S'inscrire
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
