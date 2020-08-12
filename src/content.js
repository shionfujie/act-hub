/* global chrome */
import React from "react";
import ReactDOM from "react-dom";
import "./css/content.css";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";
import SearchModal from "./components/SearchModal";

function Main() {
  const [modalIsOpen, openModal, closeModal] = useSwitch();
  useDocumentKeydown(({ key, shiftKey, metaKey }) => {
    if (key == "p" && shiftKey && metaKey) openModal();
  });
  return (
    <SearchModal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      onSelectAction={(id, action) => {
        closeModal()
        chrome.runtime.sendMessage(id, {type: "execute action", action})
      }}
    />
  );
}

const app = document.createElement("div");
app.id = "act-hub-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
