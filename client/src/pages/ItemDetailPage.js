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

// aktuálne prihlásený user – sample: Filip
const CURRENT_USER_ID = "677f00000000000000000001";

function ItemDetailPage() {
  const { listId } = useParams();

  // nájdem aktuálny list + pôvodný názov
  const currentList = shoppingListsData.find((list) => list.id === listId);
  const initialTitle = currentList ? currentList.name : "Shopping list";

  const [listTitle, setListTitle] = useState(initialTitle);

  // je aktuálny user owner?
  const isOwner = currentList && currentList.ownerId === CURRENT_USER_ID;

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

  // položky len pre aktuálny zoznam
  const [items, setItems] = useState(
    itemsData.filter((item) => item.listId === listId)
  );

  // filter: all / checked / unchecked
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

  // prepínanie filter režimu
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

  // prefiltrované položky podľa režimu
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
        isTitleEditable={!!isOwner}     // len owner môže meniť názov
        onTitleChange={setListTitle}
      />

      {/* info o ownerovi + hostoch */}
      <TabSelector
        type="users"
        owner={owner}
        hosts={hosts}
        listId={listId}
        canManageUsers={!!isOwner}      // plusko na pravej strane len pre ownera
      />

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

        {/* položky môžu pridávať aj hostia – logika práv len pre názov & userov */}
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
              createdBy: CURRENT_USER_ID,
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