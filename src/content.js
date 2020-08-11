/* global chrome */
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import "./css/content.css";
import usePort from "./hooks/chrome/usePort";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";
import SearchResultEntry from "./components/SearchResultEntry"

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

function SearchModal({isOpen, onRequestClose, onSelectAction}) {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden">
                <SearchInput/> 
                <SearchResult onSelectAction={onSelectAction}/>
            </div>
    </Modal>
    )
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

function useFocusCallback() {
  return useCallback(el => {
    if (el) el.focus();
  }, []);
}

function SearchInput() {
    const focusCallback = useFocusCallback()
    return (
        <div className="flexbox flexbox-align-center  padding-left-small padding-right-tiny" style={{ height: 44 }} >
            <div className="flexbox flexbox-centered padding-left-smaller padding-right-medium shade-087">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ stroke: "currentColor", strokeWidth: 4, height: 16, width: 16, display: "block" }}>
                    <g fill="none">
                        <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                    </g>
                </svg>
            </div>
            <div class="flexbox-grow-1">
                <input type="text" className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis no-border no-outline no-box-shadow full-width background-none" ref={focusCallback}/>
            </div>
        </div>
    )
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

const entries = extensionSpecToEntries(extensionSpec);

function SearchResult({onSelectAction}) {
  const [selectedIndex, selectEntry] = useState(0);
  const getSelectedEntry = () => entries[selectedIndex]
  useDocumentKeydown(({key}) => {
    if (key === "ArrowUp") shiftSelection(-1);
    else if (key === "ArrowDown") shiftSelection(1);
    else if (key === "Enter") submitSelection()
  })
  function shiftSelection(offset) {
    const index = selectedIndex + offset
    if (- 1 < index < entries.length) selectEntry(index)
  }
  function submitSelection() {
    const selectedEntry = getSelectedEntry()
    onSelectAction(selectedEntry.extensionId, selectedEntry.action)
  }
  return (
    <div>
      <ul className="list-style-type-none">
        {entries.map((entry, index) => {
          return (
            <SearchResultEntry
              key={entry.key}
              title={entry.title}
              highlighted={entry.key === getSelectedEntry().key}
              onMouseEnter={() => selectEntry(index)}
              onClick={submitSelection}
            />
          );
        })}
      </ul>
    </div>
  );
}

const app = document.createElement("div");
app.id = "act-hub-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
