// JSX found at https://flowbite.com/docs/components/navbar/

import React, { useEffect, useState } from "react";
import logoutService from "../services/logout";
import HamburgerMenu from "./NavBar/HamburgerMenu";
import FixedSection from "./NavBar/FixedSection";
import UserMenu from "./NavBar/UserMenu";
import { ThemeProvider } from "styled-components";

import theme from "./theme";

const NavBar = ({ userObj, userRole }) => {
  const user = JSON.parse(userObj);

  console.log("Logged in user:", user);
  console.log("User role:", userRole);

  const [navCollapsed, setNavCollapsed] = useState(true);
  const [accCollapsed, setAccCollapsed] = useState(true);

  const handleLogout = () => {
    setTimeout(async () => {
      try {
        const response = await logoutService.logOut();
        console.log(response);

        // sessionStorage.setItem("sessionUser", "");
        // setUser("");
        window.location.href = "/login";
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  };

  return (
    <ThemeProvider theme={theme}>
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
          {user && (
            <UserMenu
              user={user}
              handleLogout={handleLogout}
              isCollapsed={accCollapsed}
            />
          )}
        </div>
      </nav>
    </ThemeProvider>
  );
};

export default NavBar;
