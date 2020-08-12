/* global chrome */
import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import "./css/content.css";
import usePort from "./hooks/chrome/usePort";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";
import SearchResult from "./components/SearchResult";
import SearchInput from "./components/SearchInput"

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
}

function Main() {
  const port = usePort("ActHub");
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

function SearchModal({ isOpen, onRequestClose, onSelectAction }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden">
        <SearchInput />
        <SearchResult
          entries={extensionSpecToEntries(extensionSpec)}
          onSelectAction={onSelectAction}
        />
      </div>
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

function extensionSpecToEntries({id, name, actions}) {
  return actions.map((action, index) => {
    return {
      key: index,
      extensionId: id,
      title: action.displayName || `${name}: ${action.name}`,
      action
    }
  })
}

const app = document.createElement("div");
app.id = "act-hub-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
