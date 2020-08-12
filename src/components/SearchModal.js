/*global chrome*/
import React, {useState, useEffect} from "react";
import ReactModal from "react-modal";
import SearchResult from "./SearchResult";
import SearchInput from "./SearchInput";

export default function SearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [entries, setEntries] = useState([])
  console.debug(entries)
  useEffect(() => {
    chrome.storage.sync.get({actionSpecs: []}, ({actionSpecs}) => 
      setEntries(actionSpecs.flatMap(extensionSpecToEntries)))
  }, [])
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden">
        <SearchInput />
        <SearchResult
          entries={entries}
          onSelectAction={onSelectAction}
        />
      </div>
    </Modal>
  );
}

const extensionSpec = {
  id: "mocjdmglnkelnbnfnklgfgphebdbaopl",
  name: "WiNager",
  actions: [
    {
      name: "list stash entries",
      displayName: "List Stash Entries"
    },
    {
      name: "detach",
      displayName: "Detach Tabs"
    },
    {
      name: "duplicate",
      displayName: "Duplicate Current Tab"
    },
    {
      name: "stash",
      displayName: "Stash Tabs"
    }
  ]
};

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
