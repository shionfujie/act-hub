/*global chrome*/
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import SearchableList from "./SearchableList";
import compareCaseInsensitively from "../util/compareCaseInsensitively";


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

const internalActions = [
  {
    key: "internal-0",
    extensionId: "internal",
    title: "Preferences: Change Keybinding",
    action: { type: "keybinding" }
  }
];

function getActionSpecs(callback) {
  chrome.storage.sync.get({ actionSpecs: [] }, ({ actionSpecs }) => callback(actionSpecs))
}

function extensionSpecToEntries({ id, name, actions }) {
  return actions.map((action, index) => {
    return {
      key: `${id}-${index}`,
      extensionId: id,
      title: action.displayName || `${name}: ${action.name}`,
      action
    };
  });
}

function sortActions(actions, q) {
  const ms = []
  const sorted = []
  for (const action of actions) {
    const m = match(action.title, q)
    if (m.count >= q.length) {
      for (var j = ms.length - 1; j >= 0 && lt(m, ms[j]); j--);
      ms.splice(j + 1, 0, m)
      sorted.splice(j + 1, 0, action)
    }
  }
  return sorted
}

function match(title, q) {
  const ec = Array.from(title)
  const qc = Array.from(q)
  var m
  var position = - 1
  var density = 0
  var count = 0
  for (var i = 0, j = 0; i < ec.length && j < qc.length; i++) {
    if (compareCaseInsensitively(ec[i], qc[j])) {
      if (j === 0) position = i
      else density += i - m
      m = i
      j++; count++
    }
  }
  return {position, density, count}
}

const lt = (m, m1) => {
  if (m.count > m1.count) return true
  else if (m.count < m1.count) return false
  else {
    if (m.density < m1.density) return true
    else if (m.density > m1.density) return false
    else {
      if(m.position < m1.position) return true
      else if (m.position > m1.position) return false
      else return false
    }
  }
}

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
