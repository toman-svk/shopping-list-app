// src/pages/UserManagementPage.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TabSelector from "../components/TabSelector";
import List from "../components/List";
import AddListItem from "../components/AddListItem";

import shoppingListsData from "../data/shoppingLists.json";
import listMembersData from "../data/listMembers.json";
import usersData from "../data/users.json";

// aktuálne prihlásený user – sample: Filip
const CURRENT_USER_ID = "677f00000000000000000001";

function UserManagementPage() {
  const { listId } = useParams();

  const currentList = shoppingListsData.find((l) => l.id === listId);
  const listTitle = currentList ? currentList.name : "List";

  // je aktuálny user owner tohto listu?
  const isOwner =
    currentList && currentList.ownerId === CURRENT_USER_ID;

  // owner
  const ownerUser =
    currentList &&
    usersData.find((u) => u.id === currentList.ownerId);

  // host members (listMembers + users)
  const hostMembers = listMembersData
    .filter((lm) => lm.listId === listId && lm.status === "active")
    .map((lm) => {
      const user = usersData.find((u) => u.id === lm.userId);
      return {
        id: lm.id, // membership id
        userId: lm.userId,
        name: user ? user.name : "Unknown user",
        role: lm.role || "host",
        isOwner: false,
      };
    });

  // kombinácia owner + hosts do jedného poľa
  const initialMembers = [
    ownerUser && {
      id: ownerUser.id, // použijeme userId ako id pre ownera
      userId: ownerUser.id,
      name: ownerUser.name,
      role: "owner",
      isOwner: true,
    },
    ...hostMembers,
  ].filter(Boolean);

  const [members, setMembers] = useState(initialMembers);

  const handleDeleteUser = (memberId) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleAddUser = (newName) => {
    const newMember = {
      id: "temp-" + Date.now(),
      userId: "temp-user-" + Date.now(),
      name: newName,
      role: "host",
      isOwner: false,
    };
    setMembers((prev) => [...prev, newMember]);
  };

  return (
    <div className="page-container">
      <Navbar
        title={listTitle}
        showBackButton
        onMenuClick={() => console.log("Open menu")}
      />

      {/* prázdna lišta – podľa wireframu */}
      <TabSelector type="empty" />

      <main>
        <h2>Shared users</h2>

        <List
          type="userManagementView"
          items={members}
          // mazanie userov len pre ownera
          onDeleteUser={isOwner ? handleDeleteUser : undefined}
        />

        {/* pridávanie userov len pre ownera */}
        {isOwner && (
          <AddListItem
            type="addUser"
            onSave={handleAddUser}
          />
        )}
      </main>
    </div>
  );
}

export default UserManagementPage;