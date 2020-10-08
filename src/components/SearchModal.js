import React from "react";
import ReactModal from "react-modal";
import SearchableList from "./SearchableList";

export default function SearchModal({
  isOpen,
  entries,
  onQueryChange,
  onRequestClose,
  onSelectAction
}) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <SearchableList
        actions={entries}
        onQueryChange={onQueryChange}
        onSelectAction={onSelectAction}
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
