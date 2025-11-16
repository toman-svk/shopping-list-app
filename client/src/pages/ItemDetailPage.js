// src/pages/ItemDetailPage.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import List from "../components/List";
import TabSelector from "../components/TabSelector";
import itemsData from "../data/items.json";
import shoppingListsData from "../data/shoppingLists.json";
import listMembersData from "../data/listMembers.json";
import usersData from "../data/users.json";
import AddListItem from "../components/AddListItem";

function ItemDetailPage() {
  const { listId } = useParams();

  const currentList = shoppingListsData.find((list) => list.id === listId);
  const initialTitle = currentList ? currentList.name : "Shopping list";

  const [listTitle, setListTitle] = useState(initialTitle);

  // --- OWNER ---
  let owner = null;
  if (currentList) {
    owner = usersData.find((user) => user.id === currentList.ownerId) || null;
  }

  // --- HOSTS ---
  const hosts = listMembersData
    .filter((lm) => lm.listId === listId && lm.status === "active")
    .map((lm) => {
      const user = usersData.find((u) => u.id === lm.userId);
      return {
        id: lm.id,
        userId: lm.userId,
        name: user ? user.name : "Unknown user",
        role: lm.role,
        status: lm.status,
      };
    });

  const [items, setItems] = useState(
    itemsData.filter((item) => item.listId === listId)
  );

  const [filterMode, setFilterMode] = useState("all");

  const handleMenuClick = () => {
    console.log("Open menu from detail page");
  };

  const handleTogglePurchased = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleQuantityChange = (id, newQty) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cycleFilterMode = () => {
    setFilterMode((prev) => {
      if (prev === "all") return "checked";
      if (prev === "checked") return "unchecked";
      return "all";
    });
  };

  const filterLabel =
    filterMode === "all"
      ? "All"
      : filterMode === "checked"
      ? "Checked"
      : "Unchecked";

  const filteredItems = items.filter((item) => {
    if (filterMode === "checked") return item.completed === true;
    if (filterMode === "unchecked") return item.completed === false;
    return true;
  });

  return (
    <div className="page-container">
      <Navbar
        title={listTitle}
        showBackButton
        onMenuClick={handleMenuClick}
        isTitleEditable      // 👈 povolíme edit
        onTitleChange={setListTitle}
      />

      <TabSelector type="users" owner={owner} hosts={hosts} listId={listId} />

      <main>
        <div className="items-header">
          <h2>Items</h2>
          <button
            type="button"
            className="items-header__filter-button"
            onClick={cycleFilterMode}
          >
            {filterLabel}
          </button>
        </div>

        <List
          type="itemDetailView"
          items={filteredItems}
          onTogglePurchased={handleTogglePurchased}
          onQuantityChange={handleQuantityChange}
          onDeleteItem={handleDeleteItem}
        />

        <AddListItem
          type="addListItem"
          onSave={(newName) => {
            const now = new Date().toISOString();
            const newItem = {
              id: "temp-" + Date.now(),
              listId,
              name: newName,
              quantity: 1,
              unit: "pcs",
              completed: false,
              createdBy: "677f00000000000000000001",
              createdAt: now,
              updatedAt: now,
            };

            setItems((prev) => [...prev, newItem]);
          }}
        />
      </main>
    </div>
  );
}

export default ItemDetailPage;