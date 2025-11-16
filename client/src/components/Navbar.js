// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({
  title = "Shopping list",
  onMenuClick,
  showBackButton = false,   // 👈 nový voliteľný prop
  onBackClick,              // 👈 ak chceš vlastné správanie
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // univerzálne "choď späť"
      navigate(-1);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        {showBackButton && (
          <button
            type="button"
            className="navbar__back-button"
            onClick={handleBack}
            aria-label="Go back"
          >
            ‹
          </button>
        )}

        <h1 className="navbar__title">{title}</h1>
      </div>

      <button
        className="navbar__menu-button"
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <span className="navbar__menu-line" />
        <span className="navbar__menu-line" />
        <span className="navbar__menu-line" />
      </button>
    </header>
  );
}

export default Navbar;