// src/pages/HomePage.js
import React, { useState } from "react";
import List from "../components/List";
import shoppingListsData from "../data/shoppingLists.json";
import listMembersData from "../data/listMembers.json";
import Navbar from "../components/Navbar";
import AddListItem from "../components/AddListItem";
import TabSelector from "../components/TabSelector";

function HomePage() {
  const [lists, setLists] = useState(shoppingListsData);
  const [listMembers, setListMembers] = useState(listMembersData);
  const [activeTab, setActiveTab] = useState("my");

  // náš "current user" = Filip
  const currentUserId = "677f00000000000000000001";

  const handleToggleArchive = (id) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === id ? { ...list, archived: !list.archived } : list
      )
    );
  };

  const handleDeleteList = (id) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
  };

  const handleMenuClick = () => {
    console.log("Open menu");
  };

  // --- My lists (owned by Filip) ---
  const myActiveLists = lists.filter(
    (l) => l.ownerId === currentUserId && !l.archived
  );

  const myArchivedLists = lists.filter(
    (l) => l.ownerId === currentUserId && l.archived
  );

  // --- Shared with me (Filip is host, not owner) ---
  const sharedMemberships = listMembers.filter(
  (lm) => lm.userId === currentUserId && lm.status === "active"
  );

  const handleLeaveSharedList = (membershipId) => {
  setListMembers((prev) => prev.filter((m) => m.id !== membershipId));
  };

  const sharedLists = sharedMemberships
    .map((lm) => {
      const list = lists.find((l) => l.id === lm.listId);
      if (!list) return null;
      if (list.ownerId === currentUserId) return null; // nechceme vlastné listy
      return {
        id: lm.id,       // membership id = key pre ListItem
        listId: list.id, // použije sa na navigáciu v ListItem
        name: list.name,
      };
    })
    .filter(Boolean);

  return (
    <div className="page-container">
      <Navbar onMenuClick={handleMenuClick} />

      <TabSelector
        type="tabs"
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "my", label: "My lists" },
          { id: "shared", label: "Shared with me" },
          { id: "archived", label: "Archived" },
        ]}
      />

      <main>
        {activeTab === "my" && (
          <>
            <h2>Active lists</h2>
            <List
              type="myListView"
              items={myActiveLists}
              onToggleArchive={handleToggleArchive}
              onDelete={handleDeleteList}
            />

            <AddListItem
              type="addList"
              onSave={(newName) => {
                const newList = {
                  id: "temp-" + Date.now(),
                  name: newName,
                  ownerId: currentUserId,
                  archived: false,
                };
                setLists((prev) => [...prev, newList]);
              }}
            />
          </>
        )}

        {activeTab === "shared" && (
        <>
            <h2>Shared with me</h2>
            <List
            type="sharedListView"
            items={sharedLists}
            onLeave={handleLeaveSharedList}
            />
        </>
        )}

        {activeTab === "archived" && (
          <>
            <h2>Archived lists</h2>
            <List
              type="archivedListView"
              items={myArchivedLists}
              onToggleArchive={handleToggleArchive}
              onDelete={handleDeleteList}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;