import React from "react";

const HamburgerButton = ({
  toggledState,
  handleToggle,
  accCollapsed,
  setAccCollapsed,
}) => {
  return (
    <button
      className="lg:hidden bg-teal-900 font-bold text-white text-sm rounded-lg my-auto px-4 py-2.5"
      id="hamburger-button"
      type="button"
      onClick={() => {
        if (!accCollapsed) {
          setAccCollapsed(true);
        }
        handleToggle(!toggledState);
      }}
    >
      Menu
      {/* <span className="sr-only">Open Main Menu</span>
      <svg className="w-5 h-5" viewBox="0 0 17 14">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          color="white"
          d="M1 1h15M1 7h15M1 13h15"
        />
      </svg> */}
    </button>
  );
};

export default HamburgerButton;
