import React from "react";
import HamburgerButton from "./HamburgerButton";
import Button from "../Utility/Button";
import NavLinks from "./NavLinks";
import UserButton from "./UserButton";
import { PrimaryButton } from "../Utility/Button.styled";

const style = {};

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

        {!user && (
          // <PrimaryButton
          //   variant="dark"
          //   type="button"
          //   onClick={() => (window.location.href = "/login")}
          // >
          //   Se Connecter
          // </PrimaryButton>
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
          // <PrimaryButton
          //   variant="ligth"
          //   type="button"
          //   onClick={() => (window.location.href = "/signup")}
          // >
          //   S'inscrire
          // </PrimaryButton>
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
