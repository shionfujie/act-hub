/*global chrome*/
import React, {useState, useEffect} from "react";
import ReactModal from "react-modal";
import SearchResult from "./SearchResult";
import SearchInput from "./SearchInput";
import compareCaseInsensitively from "../util/compareCaseInsensitively"

export default function SearchModal({
  isOpen,
  onRequestClose,
  onSelectAction
}) {
  const [q, setQuery] = useState("")
  const [entries, setEntries] = useState([])
  console.debug(q)
  console.debug(entries)
  useEffect(() => {
    chrome.storage.sync.get({actionSpecs: []}, ({actionSpecs}) => 
      setEntries(
        actionSpecs.flatMap(extensionSpecToEntries)
          .filter(({title}) => containsSparsely(Array.from(title), Array.from(q)))
      )
    )
  }, [q])
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden">
        <SearchInput onChange={setQuery} />
        {entries.length > 0 && (
          <SearchResult entries={entries} onSelectAction={onSelectAction} />
        )}
      </div>
    </Modal>
  );
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

function containsSparsely(array, array1) {
  if (array1.length === 0) return true
  else if (array.length === 0) return false
  else {
    const [a1, ...rest1] = array1
    const index = array.findIndex(a => compareCaseInsensitively(a, a1))
    if (index < 0) return false
    else return containsSparsely(array.slice(index + 1), rest1)
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
