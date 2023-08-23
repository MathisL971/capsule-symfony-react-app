// JSX found at https://flowbite.com/docs/components/navbar/

import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [user, setUser] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setUser(sessionStorage.getItem("sessionUser"));
  }, []);

  const handleLogout = () => {
    setTimeout(() => {
      sessionStorage.setItem("sessionUser", "");
      setUser("");
      window.location.href = "/";
    }, 1000);
  };

  if (user) {
    const userObj = JSON.parse(user);

    return (
      <nav className="bg-gradient-to-b from-black/60 to-white/0 max-h-16">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-2.5 px-4">
          <a href="/" className="flex items-center h-full">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Capsule
            </span>
          </a>
          <div className="flex items-center md:order-2 h-full">
            <button
              type="button"
              className="flex mr-4 text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-9 h-9 rounded-full" src="" alt="user photo" />
            </button>

            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
              onClick={() => setCollapsed(!collapsed)}
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
              className="hidden md:flex text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
              onClick={handleLogout}
            >
              Se Déconnecter
            </button>
          </div>
        </div>
        <div
          className={`${
            collapsed ? "hidden" : "flex"
          } relative flex-col gap-1 inset-0 mx-4 m-2 p-2 text-base list-none md:hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
          id="user-dropdown"
        >
          <ul
            className="w-full text-center flex flex-col gap-1"
            aria-labelledby="user-menu-button"
          >
            <li>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-200 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-200 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
          </ul>
          <button
            type="button"
            className="text-white bg-teal-900 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
            onClick={handleLogout}
          >
            Se Déconnecter
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-b from-black/60 to-white/0 max-h-16">
      <div className="flex flex-wrap items-center justify-between mx-auto py-2.5 px-4">
        <a href="/" className="flex items-center h-full">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Capsule
          </span>
        </a>
        <div className="flex items-center md:order-2 h-full gap-3">
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
            onClick={() => setCollapsed(!collapsed)}
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
            className="hidden md:flex text-white border-2 border-white hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300 font-bold rounded-lg text-sm px-4 py-2.5 text-center dark:hover:bg-teal-700 dark:focus:ring-white"
            onClick={() => (window.location.href = "/login")}
          >
            Se Connecter
          </button>
          <button
            type="button"
            className="hidden md:flex text-white bg-teal-900 border-2 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
            onClick={() => (window.location.href = "/signup")}
          >
            S'inscrire
          </button>
        </div>
      </div>
      <div
        className={`${
          collapsed ? "hidden" : "flex"
        } relative flex-col gap-1 inset-0 mx-4 m-2 p-2 text-base list-none md:hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
        id="user-dropdown"
      >
        <ul
          className="w-full text-center flex flex-col gap-1"
          aria-labelledby="user-menu-button"
        >
          <li>
            <a
              href="/"
              className="block rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-200 dark:hover:text-white"
            >
              Home
            </a>
          </li>
        </ul>
        <button
          type="button"
          className="text-white bg-teal-900 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
          onClick={() => (window.location.href = "/login")}
        >
          Se Connecter
        </button>
        <button
          type="button"
          className="text-white bg-teal-900 border-teal-900 hover:bg-teal-950 focus:ring-2 focus:outline-none focus:ring-teal-300 rounded-lg text-sm font-bold px-4 py-2.5 text-center dark:bg-teal-900 dark:hover:bg-teal-700 dark:focus:ring-teal-900"
          onClick={() => (window.location.href = "/signup")}
        >
          S'inscrire
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
