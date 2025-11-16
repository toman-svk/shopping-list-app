// src/components/AddListItem.js
import React, { useState } from "react";
import "./ListItem.css";

function AddListItem({ type, onSave, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [value, setValue] = useState("");

  const getPlaceholder = () => {
    switch (type) {
      case "addList":
        return "New list name";
      case "addListItem":
        return "New item name";
      case "addUser":
        return "New user name";
      default:
        return "New value";
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const handleCloseClick = () => {
    // nespúšťame hneď collapse, najprv animácia
    setIsClosing(true);
  };

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (onSave) onSave(trimmed);

    // po save to tiež zavrieme – tiež cez closing animáciu
    setIsClosing(true);
  };

  // po skončení animácie zavretia skutočne „schováme“ riadok
  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false);
      setIsOpen(false);
      setValue("");
      if (onClose) onClose();
    }
  };

  if (!isOpen) {
    // Collapsed – len zelené plusko
    return (
      <div className="add-list-item">
        <button
          type="button"
          className="add-list-item__collapsed-button"
          onClick={handleOpen}
          aria-label="Add new"
        >
          +
        </button>
      </div>
    );
  }

  // Expanded – riadok podobný ListItem
  return (
    <div
      className={
        "add-list-item add-list-item__expanded" +
        (isClosing ? " add-list-item__expanded--closing" : "")
      }
      onAnimationEnd={handleAnimationEnd}
    >
      <input
        className="add-list-item__input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={getPlaceholder()}
      />

      <div className="add-list-item__actions">
        <button
          type="button"
          className="add-list-item__button add-list-item__button--close"
          onClick={handleCloseClick}
        >
          Close
        </button>
        <button
          type="button"
          className="add-list-item__button add-list-item__button--save"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default AddListItem;