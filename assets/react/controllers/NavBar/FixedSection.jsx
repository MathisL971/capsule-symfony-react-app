import React from "react";
import HamburgerButton from "./HamburgerButton";
import Button from "../Utility/Button";
import NavLinks from "./NavLinks";

const FixedSection = ({
  user,
  navCollapsed,
  setNavCollapsed,
  accCollapsed,
  setAccCollapsed,
}) => {
  return (
    <div
      className={`flex flex-row ${
        user ? "justify-end" : "justify-between"
      } w-full h-full`}
    >
      {!user && (
        <a href="/" className="flex">
          <span className="flex flex-row items-center text-2xl text-white font-semibold">
            Capsule
          </span>
        </a>
      )}

      <div className="flex w-fit justify-between gap-3 my-auto">
        <NavLinks user={user} />

        {user && (
          <button
            type="button"
            className="flex text-sm rounded-full my-auto"
            id="user-menu-button"
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
        )}

        {!user && (
          <Button
            text={"Se Connecter"}
            type={"button"}
            style={"primary_1"}
            onClick={() => (window.location.href = "/login")}
          />
        )}

        {!user && (
          <Button
            text={"S'inscrire"}
            type={"button"}
            style={"primary_2"}
            onClick={() => (window.location.href = "/signup")}
          />
        )}

        <HamburgerButton
          toggledState={navCollapsed}
          handleToggle={setNavCollapsed}
          accCollapsed={accCollapsed}
          setAccCollapsed={setAccCollapsed}
        />
      </div>
    </div>
  );
};

export default FixedSection;
