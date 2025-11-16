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

  // nájdem aktuálny list + názov pre navbar
  const currentList = shoppingListsData.find((list) => list.id === listId);
  const listTitle = currentList ? currentList.name : "Shopping list";

  // --- 👤 OWNER (z shoppingLists.ownerId + users.json) ---
  let owner = null;
  if (currentList) {
    owner = usersData.find((user) => user.id === currentList.ownerId) || null;
  }

  // --- 👥 HOSTS (z listMembers + users.json) ---
  const hosts = listMembersData
    .filter((lm) => lm.listId === listId && lm.status === "active")
    .map((lm) => {
      const user = usersData.find((u) => u.id === lm.userId);
      return {
        id: lm.id,           // id z listMembers
        userId: lm.userId,
        name: user ? user.name : "Unknown user",
        role: lm.role,
        status: lm.status,
      };
    });

  // položky len pre aktuálny zoznam
  const [items, setItems] = useState(
    itemsData.filter((item) => item.listId === listId)
  );

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

  return (
    <div className="page-container">
      <Navbar title={listTitle} showBackButton onMenuClick={handleMenuClick} />

      {/* 👤👥 info o ownerovi + hostoch */}
      <TabSelector
        type="users"
        owner={owner}
        hosts={hosts}
        onAddHost={() => {
          console.log("Add new host – later you can open invite dialog here");
        }}
        listId={listId}
      />

      <main>
        <h2>Items</h2>

        <List
          type="itemDetailView"
          items={items}
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
            createdBy: "677f00000000000000000001", // current user (Filip) ako sample
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