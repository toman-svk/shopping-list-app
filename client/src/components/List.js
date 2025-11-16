// src/components/List.js
import React from "react";
import ListItem from "./ListItem";

function List({
  type,
  items,
  onToggleArchive,
  onDelete,
  onLeave,
  onAccept,
  onTogglePurchased,
  onQuantityChange,
  onDeleteItem,
  onDeleteUser,
}) {
  if (!items || items.length === 0) {
    return <div className={`list list--${type}`}>No items to display.</div>;
  }

  return (
    <div className={`list list--${type}`}>
      {items.map((item) => {
        // špeciálne riešenie pre userManagementView – owner nemá delete
        let deleteUserHandler;
        if (onDeleteUser) {
          if (type === "userManagementView" && item.isOwner) {
            deleteUserHandler = undefined;
          } else {
            deleteUserHandler = () => onDeleteUser(item.id);
          }
        }

        return (
          <ListItem
            key={item.id}
            type={type}
            itemName={item.name}
            listId={
              type === "sharedListView"
                ? item.listId
                : item.id
            }
            isArchived={item.archived === true}
            onToggleArchive={
              onToggleArchive ? () => onToggleArchive(item.id) : undefined
            }
            onDelete={onDelete ? () => onDelete(item.id) : undefined}
            onLeave={onLeave ? () => onLeave(item.id) : undefined}
            onAccept={onAccept ? () => onAccept(item.id) : undefined}
            isPurchased={item.completed === true}
            quantity={item.quantity}
            onTogglePurchased={
              onTogglePurchased ? () => onTogglePurchased(item.id) : undefined
            }
            onQuantityChange={
              onQuantityChange
                ? (newQty) => onQuantityChange(item.id, newQty)
                : undefined
            }
            onDeleteItem={
              onDeleteItem ? () => onDeleteItem(item.id) : undefined
            }
            roleLabel={item.role}
            onDeleteUser={deleteUserHandler}
          />
        );
      })}
    </div>
  );
}

export default List;