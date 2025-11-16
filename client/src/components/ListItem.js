
// src/components/ListItem.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListItem.css";
import { FiDownload, FiTrash2, FiLogOut } from "react-icons/fi";

function ListItem({
  type,

  // common
  itemName,
  listId,          // 👈 nový prop

  // myListView / archivedListView
  isArchived,
  onToggleArchive,
  onDelete,

  // sharedListView
  onLeave,
  onAccept,

  // itemDetailView
  isPurchased,
  quantity,
  onTogglePurchased,
  onQuantityChange,
  onDeleteItem,

  // userManagementView
  roleLabel,
  onDeleteUser,
}) {
  const navigate = useNavigate();

  const handleQuantityChange = (delta) => {
    if (!onQuantityChange) return;
    const newQuantity = Math.max(1, (quantity || 1) + delta);
    onQuantityChange(newQuantity);
  };

  // klik na názov zoznamu
  const handleNameClick = () => {
    if (
      (type === "myListView" ||
        type === "archivedListView" ||
        type === "sharedListView") &&
      listId
    ) {
      navigate(`/lists/${listId}`);
    }
  };

  const renderActions = () => {
    switch (type) {
      case "myListView":
      case "archivedListView":
        return (
          <div className="list-item__actions">
            {onToggleArchive && (
                <button
                className="list-item__button list-item__button--icon list-item__button--archive"
                onClick={onToggleArchive}
                >
                <FiDownload />
                </button>
            )}
            {onDelete && (
                <button
                className="list-item__button list-item__button--icon list-item__button--delete"
                onClick={onDelete}
                >
                <FiTrash2 />
                </button>
            )}
          </div>
        );

      case "sharedListView":
        return (
            <div className="list-item__actions">
            {onLeave && (
                <button
                className="list-item__button list-item__button--icon list-item__button--leave"
                onClick={onLeave}
                aria-label="Leave shared list"
                >
                <FiLogOut />
                </button>
            )}
            </div>
        );

      case "itemDetailView":
        return (
          <div className="list-item__actions">
            {onTogglePurchased && (
              <button
                className="list-item__button list-item__button--pill"
                onClick={onTogglePurchased}
              >
                {isPurchased ? "Uncheck" : "Check"}
              </button>
            )}

            <div className="list-item__quantity-picker">
              <button
                className="list-item__button list-item__button--icon"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="list-item__quantity-value">
                {quantity ?? 1}
              </span>
              <button
                className="list-item__button list-item__button--icon"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>

            {onDeleteItem && (
                <button
                className="list-item__button list-item__button--icon list-item__button--delete"
                onClick={onDeleteItem}
                >
                <FiTrash2 />
                </button>
            )}
          </div>
        );

      case "userManagementView":
        return (
          <div className="list-item__actions">
            {roleLabel && (
              <span className="list-item__role-label">
                {roleLabel}
              </span>
            )}
            {onDeleteUser && (
              <button
                className="list-item__button list-item__button--icon list-item__button--delete"
                onClick={onDeleteUser}
              >
                <FiTrash2 />
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`list-item list-item--${type}`}>
      <span
        className={
          type === "myListView" ||
          type === "archivedListView" ||
          type === "sharedListView"
            ? "list-item__name list-item__name--link"
            : "list-item__name"
        }
        onClick={handleNameClick}
      >
        {itemName}
      </span>

      {renderActions()}
    </div>
  );
}

export default ListItem;