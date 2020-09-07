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
  const [
    entries,
    selectedIndex,
    selectEntry,
    shiftSelection,
    setQuery,
    submitSelection,
    onRequestClose$
  ] = useEntries(onSelectAction, onRequestClose);
  const onkeydownRef = useOnKeyDown(event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "ArrowUp") shiftSelection(-1);
    else if (key === "ArrowDown") shiftSelection(1);
  })
  const onkeyupRef = useOnKeyUp(event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "Enter") submitSelection();
  })
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose$}>
      <div
        ref={combinefuns(onkeydownRef, onkeyupRef)}
        className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden"
      >
        <SearchInput onChange={setQuery} />
        {entries.length > 0 && (
          <SearchResult
            entries={entries}
            selectedIndex={selectedIndex}
            submitSelection={submitSelection}
            selectEntry={selectEntry}
          />
        )}
      </div>
    </Modal>
  );
}

function useEntries(onSelectAction, onRequestClose) {
  const [q, setQuery] = useState("");
  console.debug(`'${q}'`)
  const [entries, setEntries] = useState([]);
  const [selectedIndex, selectEntry] = useState(0);
  useEffect(() => {
    getActionSpecs(actionSpecs => {
      setEntries(constructEntries(actionSpecs, q));
      selectEntry(0);
    });
  }, [q]);
  function shiftSelection(offset) {
    const index = selectedIndex + offset;
    if (-1 < index && index < entries.length) selectEntry(index);
  }
  function submitSelection() {
    const selectedEntry = entries[selectedIndex];
    onSelectAction(selectedEntry.extensionId, selectedEntry.action);
    setQuery("")
  }
  return [
    entries,
    selectedIndex,
    selectEntry,
    shiftSelection,
    setQuery,
    submitSelection,
    () => {
      onRequestClose()
      setQuery("")
    }
  ];
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

function constructEntries(actionSpecs, q) {
  const entries$ = [
    ...internalActions,
    ...actionSpecs.flatMap(extensionSpecToEntries)
  ]
  const r = []
  const entries = []
  for (const entry of entries$) {
    const m = matchResult(entry, q)
    if (m.count >= q.length) {
      for (var j = r.length - 1; j >= 0 && lt(m, r[j]); j--);
      r.splice(j + 1, 0, m)
      entries.splice(j + 1, 0, m.entry)
    }
  }
  return entries
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
