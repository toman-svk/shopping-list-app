// src/components/TabSelector.js
import React from "react";
import "./TabSelector.css";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function TabSelector(props) {
  const { type = "tabs" } = props;
  const navigate = useNavigate();   // 👈 hook musí byť volaný vždy

  if (type === "tabs") {
    const { tabs, activeTabId, onTabChange } = props;

    return (
      <div className="tab-selector">
        <div className="tab-selector__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                "tab-selector__tab" +
                (tab.id === activeTabId
                  ? " tab-selector__tab--active"
                  : "")
              }
              onClick={() => onTabChange && onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "users") {
    const { owner, hosts = [], listId } = props;

    const goToUserManagement = () => {
      if (listId) {
        navigate(`/lists/${listId}/users`);
      }
    };

    return (
      <div className="tab-selector" onClick={goToUserManagement}>
        <div className="tab-selector__users">
          <div className="tab-selector__users-left">
            {owner && (
              <>
                <div className="tab-selector__avatar">
                  <span>{owner.name ? owner.name.charAt(0) : "O"}</span>
                </div>
                <span className="tab-selector__label">Owner</span>
              </>
            )}
          </div>

          <div className="tab-selector__users-right">
            <span className="tab-selector__label tab-selector__label--muted">
              Shared with
            </span>

            <div className="tab-selector__hosts">
              {hosts.map((host) => (
                <div
                  key={host.id}
                  className="tab-selector__avatar tab-selector__avatar--host"
                  title={host.name}
                >
                  <span>{host.name ? host.name.charAt(0) : "H"}</span>
                </div>
              ))}

              <button
                type="button"
                className="tab-selector__add-host-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToUserManagement();
                }}
                aria-label="Manage users"
              >
                <FiPlus />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // type === "empty"
  return <div className="tab-selector tab-selector--empty" />;
}

export default TabSelector;