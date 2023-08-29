import React from "react";

const HamburgerButton = ({
  toggledState,
  handleToggle,
  accCollapsed,
  setAccCollapsed,
}) => {
  return (
    <button
      id="hamburger-button"
      data-collapse-toggle="navbar-user"
      type="button"
      className="inline-flex lg:hidden items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="navbar-user"
      aria-expanded="false"
      onClick={() => {
        if (!accCollapsed) {
          setAccCollapsed(true);
        }
        handleToggle(!toggledState);
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
  );
};

export default HamburgerButton;
