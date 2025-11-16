// src/App.js
import React from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import UserManagementPage from "./pages/UserManagementPage";

function App() {
  const location = useLocation();
  const navType = useNavigationType(); // "PUSH" | "POP" | "REPLACE"

  // dopredu (click na list) vs späť (back button)
  const direction = navType === "POP" ? -1 : 1;

  const variants = {
    initial: (dir) => ({
      x: dir * 100, // v percentách šírky
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir * -30,
      opacity: 0,
    }),
  };

  return (
    <div className="app-shell">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={location.pathname}
          className="page-transition-wrapper"
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.17, ease: "easeOut" }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/lists/:listId" element={<ItemDetailPage />} />
            <Route
              path="/lists/:listId/users"
              element={<UserManagementPage />}
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;