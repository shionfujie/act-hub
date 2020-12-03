/*global chrome*/
import React, { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import { extensionSpecToActions, compareDates } from "../util/actions";

export default function ActionSearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [actions, isLoading] = useActions(isOpen);
  return (
    <SearchModal
      hint={"What do you want to Actub to do?"}
      entries={actions}
      isLoading={isLoading}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onSelectEntry={entry => {
        updateActionLastUsed(entry)
        onSelectAction(entry)
      }}
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
        ].sort(compareDates);
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

function saveActionSpecs(actionSpecs) {
  chrome.storage.sync.set({ actionSpecs });
}

function updateActionLastUsed(entry) {
  const t = new Date().toISOString()
  getActionSpecs(actionSpecs => {
    const s = actionSpecs.find(s => s.id === entry.extensionId)
    if (s === undefined) return
    const a = s.actions.find(a => a.name === entry.action.name)
    a['lastUsed'] = t
    saveActionSpecs(actionSpecs)
  })
}

const internalActions = [
  {
    key: "internal-0",
    extensionId: "internal",
    title: "Preferences: Change Keybinding",
    action: { type: "keybinding" }
  }
];
