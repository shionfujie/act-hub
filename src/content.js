/* global chrome */
import React from "react";
import ReactDOM from "react-dom";
import "./css/content.css";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";
import SearchModal from "./components/SearchModal";
import ReactModal from "react-modal";

function Main() {
  const [modalIsOpen, openModal, closeModal] = useSwitch();
  useDocumentKeydown(({ key, shiftKey, metaKey }) => {
    if (key == "p" && shiftKey && metaKey) openModal();
  });
  return (
    <KeyBindingModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    // <SearchModal
    //   isOpen={modalIsOpen}
    //   onRequestClose={closeModal}
    //   onSelectAction={(id, action) => {
    //     closeModal();
    //     chrome.runtime.sendMessage(id, { type: "execute action", action });
    //   }}
    // />
  );
}

function KeyBindingModal({isOpen, onRequestClose}) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div>Test</div>
    </Modal>
  );
}

function KeyBindingInput() {
  return <div></div>;
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
          maxWidth: 400,
          flexGrow: 1,
          border: 0,
          borderRadius: 2,
          boxShadow: "rgba(29, 17, 17, 0.15) 0px 5px 12px"
        }
      }}
    >
      {children}
    </ReactModal>
  );
}

const app = document.createElement("div");
app.id = "act-hub-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
