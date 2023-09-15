import React from "react";

const HamburgerButton = ({
  toggledState,
  handleToggle,
  accCollapsed,
  setAccCollapsed,
}) => {
  return (
    <button
      className="flex my-auto hide-on-large"
      id="hamburger-button"
      type="button"
      onClick={() => {
        if (!accCollapsed) {
          setAccCollapsed(true);
        }
        handleToggle(!toggledState);
      }}
    >
      <img
        alt="hamburger-button"
        src="/images/hamburger-icon-white.svg"
        style={{ width: "40px" }}
      ></img>
    </button>
  );
};

export default HamburgerButton;
