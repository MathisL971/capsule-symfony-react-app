// JSX found at https://flowbite.com/docs/components/navbar/

import React, { useEffect, useState } from "react";
import logoutService from "../services/logout";
import HamburgerMenu from "./NavBar/HamburgerMenu";
import FixedSection from "./NavBar/FixedSection";
import UserMenu from "./NavBar/UserMenu";

const NavBar = ({ userObj, userRole }) => {
  const [user, setUser] = useState("");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [accCollapsed, setAccCollapsed] = useState(true);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLogout = () => {
    setTimeout(async () => {
      try {
        sessionStorage.setItem("sessionUser", "");
        setUser("");
        window.location.href = "/login";
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  };

  return (
    <nav className="bg-teal-600 shadow h-16">
      <div className="flex flex-col py-2.5 px-4 wrap gap-2 h-16">
        <FixedSection
          user={user}
          navCollapsed={navCollapsed}
          setNavCollapsed={setNavCollapsed}
          accCollapsed={accCollapsed}
          setAccCollapsed={setAccCollapsed}
        />
      </div>
      <div className="flex p-2">
        <HamburgerMenu user={user} isCollapsed={navCollapsed} />
        <UserMenu
          user={user}
          handleLogout={handleLogout}
          isCollapsed={accCollapsed}
        />
      </div>
    </nav>
  );
};

export default NavBar;
