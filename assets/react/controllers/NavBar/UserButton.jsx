import React from "react";

const UserButton = ({
  navCollapsed,
  setNavCollapsed,
  accCollapsed,
  setAccCollapsed,
}) => {
  return (
    <button
      type="button"
      className="flex text-sm rounded-full my-auto bg-teal-900 p-2 font-bold text-white"
      id="user-menu-button"
      onClick={() => {
        if (!navCollapsed) {
          setNavCollapsed(true);
        }
        setAccCollapsed(!accCollapsed);
      }}
    >
      {/* <span className="sr-only">Open user menu</span>
      <img
        className="w-9 h-9 rounded-full"
        src={
          "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
        }
        alt="user photo"
      /> */}
      User
    </button>
  );
};

export default UserButton;
