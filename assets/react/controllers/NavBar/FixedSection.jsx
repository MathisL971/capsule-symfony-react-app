import React from "react";
import HamburgerButton from "./HamburgerButton";
import Button from "../Utility/Button";
import NavLinks from "./NavLinks";
import UserButton from "./UserButton";

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

      <div className="flex w-fit justify-between gap-2 my-auto">
        <NavLinks user={user} />

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

        {user && (
          <UserButton
            navCollapsed={navCollapsed}
            setNavCollapsed={setNavCollapsed}
            accCollapsed={accCollapsed}
            setAccCollapsed={setAccCollapsed}
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
