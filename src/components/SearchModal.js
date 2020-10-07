/*global chrome*/
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import SearchableList from "./SearchableList";
import { extensionSpecToEntries, sortActions } from "../util/actions";


export default function SearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [actions, onQueryChange] = useActions()
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <SearchableList
          actions={actions}
          onQueryChange={onQueryChange}
          onSelectAction={onSelectAction}
          onRequestClose={onRequestClose}
        />
    </Modal>
  );
}

function useActions() {
  const [q, setQuery] = useState("");
  const [actions, setActions] = useState([]);
  useEffect(() => {
    getActionSpecs(actionSpecs => {
      const actions = [
        ...internalActions,
        ...actionSpecs.flatMap(extensionSpecToEntries)
      ]
      setActions(sortActions(actions, q));
    });
  }, [q]);
  return [actions, setQuery];
}

function getActionSpecs(callback) {
  chrome.storage.sync.get({ actionSpecs: [] }, ({ actionSpecs }) => callback(actionSpecs))
}

const internalActions = [
  {
    key: "internal-0",
    extensionId: "internal",
    title: "Preferences: Change Keybinding",
    action: { type: "keybinding" }
  }
];

function Modal({ isOpen, onRequestClose, children }) {
  return (
    <ReactModal
      id="act-hub-modal-root"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, .0)",
          zIndex: 100000
        },
        content: {
          position: null,
          padding: 0,
          top: null,
          right: null,
          left: null,
          bottom: null,
          marginTop: "20vh",
          marginLeft: 24,
          marginRight: 24,
          maxWidth: 683,
          flexGrow: 1,
          border: 0,
          borderRadius: 4,
          boxShadow: "rgba(29, 17, 17, 0.15) 0px 5px 12px"
        }
      }}
    >
      {children}
    </ReactModal>
  );
}
