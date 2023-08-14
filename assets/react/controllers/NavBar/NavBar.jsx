import React from "react";

const NavBar = () => {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light d-flex p-2 justify-content-between px-4">
      <a class="navbar-brand" href="/">
        Capsule
      </a>

      <div>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <div class="d-flex gap-2">
            <ul class="navbar-nav mr-auto d-flex gap-1">
              <li class="nav-item active">
                <a class="nav-link" href="/">
                  Home
                </a>
              </li>
            </ul>
            <button
              class="btn btn-outline-success my-2 my-sm-0"
              type="button"
              id="loginButton"
            >
              Se Connecter
            </button>
            <button
              class="btn btn-outline-success my-2 my-sm-0"
              type="button"
              id="signupButton"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
