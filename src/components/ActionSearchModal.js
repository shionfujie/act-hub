/*global chrome*/
import React, { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import { extensionSpecToEntries, sortActions } from "../util/actions";

export default function ActionSearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [actions, loaded] = useActions(isOpen);
  const [q, setQuery] = useState('')
  const [viewModel, setViewModel] = useState([])
  useEffect(() => {
    if (loaded) setViewModel(sortActions(actions, q))
  }, [q, loaded])
  return (
    <SearchModal
      entries={viewModel}
      onQueryChange={setQuery}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onSelectAction={onSelectAction}
    />
  );
}

// Loads actions while indicating the loading state 
// and reloads as reopened
function useActions(isOpen) {
  const [actions, setActions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    getActionSpecs(
      actionSpecs => {
        const actions = [
          ...internalActions,
          ...actionSpecs.flatMap(extensionSpecToEntries)
        ];
        setActions(sortActions(actions, ""));
        setLoaded(true);
      }
    );
  }, [isOpen]);
  return [actions, loaded];
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
