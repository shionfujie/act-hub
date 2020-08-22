/*global chrome*/
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import SearchResult from "./SearchResult";
import SearchInput from "./SearchInput";
import containsSparsely from "../util/containsSparsely";
import useOnKeyDown from "../hooks/useOnKeyDown";

export default function SearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [entries, selectedIndex, selectEntry, setQuery] = useEntries();
  const elRef = useOnKeyDown(event => {
    event.stopPropagation();
    const key = event.key;
    console.debug("elRef");
    if (key === "ArrowUp") shiftSelection(-1);
    else if (key === "ArrowDown") shiftSelection(1);
    else if (key === "Enter") submitSelection();
  });
  function shiftSelection(offset) {
    const index = selectedIndex + offset;
    if (-1 < index && index < entries.length) selectEntry(index);
  }
  function submitSelection() {
    const selectedEntry = entries[selectedIndex];
    onSelectAction(selectedEntry.extensionId, selectedEntry.action);
  }
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div
        ref={elRef}
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

const internalActions = [
  {
    key: "internal-0",
    extensionId: "internal",
    title: "Preferences: Change Keybinding",
    action: { type: "keybinding" }
  }
];

function useEntries() {
  const [q, setQuery] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedIndex, selectEntry] = useState(0);
  useEffect(() => {
    chrome.storage.sync.get({ actionSpecs: [] }, ({ actionSpecs }) => {
      setEntries(
        [
          ...internalActions,
          ...actionSpecs.flatMap(extensionSpecToEntries)
        ].filter(matchQuery(q))
      );
      selectEntry(0);
    });
  }, [q]);
  return [entries, selectedIndex, selectEntry, setQuery];
}

const matchQuery = q => entry =>
  containsSparsely(Array.from(entry.title), Array.from(q));

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
