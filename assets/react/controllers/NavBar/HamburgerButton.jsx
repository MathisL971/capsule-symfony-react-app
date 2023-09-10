import React from "react";

const HamburgerButton = ({
  toggledState,
  handleToggle,
  accCollapsed,
  setAccCollapsed,
}) => {
  return (
    <button
      className="flex sm:hidden bg-teal-900 font-bold text-white text-sm rounded-lg my-auto px-4 py-2.5"
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
    </button>
  );
};

export default HamburgerButton;
