import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import SelectableList from "./SelectableEntryList";
import { searchEntries } from "../util/actions";

export default function SearchModal({
  isOpen,
  isLoading,
  entries,
  onRequestClose,
  onSelectEntry
}) {
  const [filtered, setFiltered] = useState(entries)
  const [q, setQuery] = useState('')
  useEffect(() => {
    if(isLoading) return
    setFiltered(searchEntries(entries, q))
  }, [q, entries, isLoading])
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <SelectableList
        entries={filtered}
        onQueryChange={setQuery}
        onSelectEntry={onSelectEntry}
        onRequestClose={onRequestClose}
      />
    </Modal>
  );
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
