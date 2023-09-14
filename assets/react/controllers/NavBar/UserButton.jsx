import React from "react";

const UserButton = ({
  navCollapsed,
  setNavCollapsed,
  accCollapsed,
  setAccCollapsed,
}) => {
  return (
    <button
      id="user-menu-button"
      type="button"
      onClick={() => {
        if (!navCollapsed) {
          setNavCollapsed(true);
        }
        setAccCollapsed(!accCollapsed);
      }}
    >
      <img
        src="/images/user-icon-white.svg"
        alt="user"
        style={{ width: "35px" }}
      ></img>
    </button>
  );
};

export default UserButton;
