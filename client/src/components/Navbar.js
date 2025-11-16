// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FiEdit2 } from "react-icons/fi";

function Navbar({
  title = "Shopping list",
  onMenuClick,
  showBackButton = false,
  onBackClick,
  // nové props:
  isTitleEditable = false,
  onTitleChange,
}) {
  const navigate = useNavigate();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  // keď sa title zvonku zmení (napr. iný list), zosynchronizuj draft
  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const startEditTitle = () => {
    if (!isTitleEditable) return;
    setDraftTitle(title);
    setIsEditingTitle(true);
  };

  const commitTitle = () => {
    setIsEditingTitle(false);
    if (onTitleChange && draftTitle.trim() !== "" && draftTitle !== title) {
      onTitleChange(draftTitle.trim());
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTitle();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setDraftTitle(title);
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

        {isTitleEditable ? (
          <div className="navbar__title-wrapper">
            {isEditingTitle ? (
              <input
                autoFocus
                className="navbar__title-input"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={handleTitleKeyDown}
              />
            ) : (
              <>
                <h1 className="navbar__title">{title}</h1>
                <button
                  type="button"
                  className="navbar__edit-title-button"
                  onClick={startEditTitle}
                  aria-label="Edit list name"
                >
                  <FiEdit2 />
                </button>
              </>
            )}
          </div>
        ) : (
          <h1 className="navbar__title">{title}</h1>
        )}
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