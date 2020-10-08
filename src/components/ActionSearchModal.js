/*global chrome*/
import React, { useState } from "react";
import SearchModal from "./SearchModal";
import { extensionSpecToEntries, sortActions } from "../util/actions";

export default function ActionSearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [actions, setActions] = useState([]);
  const queryActions = q => {
    getActionSpecs(actionSpecs => {
      const actions = [
        ...internalActions,
        ...actionSpecs.flatMap(extensionSpecToEntries)
      ];
      setActions(sortActions(actions, q));
    });
  };
  return (
    <SearchModal
      entries={actions}
      onQueryChange={queryActions}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onSelectAction={onSelectAction}
    />
  );
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
