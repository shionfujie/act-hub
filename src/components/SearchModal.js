/*global chrome*/
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import SearchResult from "./SearchResult";
import SearchInput from "./SearchInput";
import containsSparsely from "../util/containsSparsely";
import useOnKeyDown from "../hooks/useOnKeyDown";
import useOnKeyUp from "../hooks/useOnKeyUp";
import combinefuns from "../util/combineFuns";
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

function SearchableList({actions, onQueryChange, onSelectAction, onRequestClose}) {
  const [selectedIndex, selectIndex] = useState(0);
  useEffect(() => selectIndex(0), [actions]);
  function shiftSelection(offset) {
    const index = selectedIndex + offset;
    if (-1 < index && index < actions.length) selectIndex(index);
  }
  function submitAction() {
    const {extensionId, action} = actions[selectedIndex];
    onSelectAction(extensionId, action);
    onQueryChange("")
  }
  const onkeydownRef = useOnKeyDown(event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "ArrowUp") shiftSelection(-1);
    else if (key === "ArrowDown") shiftSelection(1);
  })
  const onkeyupRef = useOnKeyUp(event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "Enter") submitAction();
    else if (key == "Escape") {
      onRequestClose()
      onQueryChange("")
    }
  })
  return (
    <div
        ref={combinefuns(onkeydownRef, onkeyupRef)}
        className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden"
      >
        <SearchInput onChange={onQueryChange} />
        {actions.length > 0 && (
          <SearchResult
            actions={actions}
            selectedIndex={selectedIndex}
            submitAction={submitAction}
            selectIndex={selectIndex}
          />
        )}
    </div>
  )
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

function sortActions(actions, q) {
  const ms = []
  const sorted = []
  for (const entry of actions) {
    const m = matchResult(entry, q)
    if (m.count >= q.length) {
      for (var j = ms.length - 1; j >= 0 && lt(m, ms[j]); j--);
      ms.splice(j + 1, 0, m)
      sorted.splice(j + 1, 0, entry)
    }
  }
  return sorted
}

function matchResult(entry, q) {
  const ec = Array.from(entry.title)
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
  return {entry, position, density, count}
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
