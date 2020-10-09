/*global chrome*/
import React, { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import { extensionSpecToActions } from "../util/actions";

export default function ActionSearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [actions, isLoading] = useActions(isOpen);
  return (
    <SearchModal
      entries={actions}
      isLoading={isLoading}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onSelectEntry={onSelectAction}
    />
  );
}

// Loads actions while indicating the loading state 
// and reloads as reopened
function useActions(isOpen) {
  const [actions, setActions] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (!isOpen) return;
    getActionSpecs(
      actionSpecs => {
        const actions = [
          ...internalActions,
          ...actionSpecs.flatMap(extensionSpecToActions)
        ];
        setActions(actions, "");
        setLoading(false);
      }
    );
  }, [isOpen]);
  return [actions, isLoading];
}

function getActionSpecs(callback) {
  chrome.storage.sync.get({ actionSpecs: [] }, ({ actionSpecs }) =>
    callback(actionSpecs)
  );
}

const internalActions = [
  {
    key: "internal-0",
    extensionId: "internal",
    title: "Preferences: Change Keybinding",
    action: { type: "keybinding" }
  }
];
