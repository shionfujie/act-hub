/* global chrome */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./css/content.css";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";
import ReactModal from "react-modal";
import useFocusCallback from "./hooks/useFocusCallback";
import useOnKeyDown from "./hooks/useOnKeyDown";
import combineFuns from "./util/combineFuns";
import ActionSearchModal from "./components/ActionSearchModal";
import SearchModal from "./components/SearchModal";

function useOnMessage(listener) {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(listener);
  }, []);
}

function useChoices() {
  const [optionsAndHandler, setOptionsAndHandler] = useState([null, false]);
  useOnMessage((request) => {
    switch (request.type) {
      case "select":
        const setChoice = result => {
          chrome.runtime.sendMessage(request.senderId, {type: 'select/response', ...result})
          setOptionsAndHandler([null, false]);
        };
        setOptionsAndHandler([request.options, true, setChoice]);
        break;
    }
  });
  return optionsAndHandler;
}

function Main() {
  const shortcut = useShortcut();
  const [options, selectModalIsOpen, setChoice] = useChoices();
  const [modalIsOpen, openModal, closeModal] = useSwitch();
  const [keybindingModalIsOpen, openKeybinding, closeKeyBinding] = useSwitch();
  useDocumentKeydown(event => {
    if (shortcut === null) return;
    if (!modalIsOpen && confirmShortcut(shortcut, event)) {
      openModal();
      event.stopPropagation();
    } else if (modalIsOpen && event.code === "Escape") {
      closeModal();
      event.stopPropagation();
    }
  });
  const executeInternalAction = action => {
    switch (action.type) {
      case "keybinding":
        openKeybinding();
        break;
    }
  };
  const requestExecuteAction = ({ extensionId, action }) => {
    closeModal();
    if (extensionId === "internal") executeInternalAction(action);
    else
      chrome.runtime.sendMessage(extensionId, {
        type: "execute action",
        action
      });
  };
  const updateKeyCombination = keyCombination => {
    closeKeyBinding();
    chrome.storage.sync.set({ shortcut: keyCombination });
  };
  return (
    <>
      <ActionSearchModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onSelectAction={requestExecuteAction}
      />
      <KeyBindingModal
        isOpen={keybindingModalIsOpen}
        onRequestClose={closeKeyBinding}
        onConfirmed={updateKeyCombination}
      />
      {selectModalIsOpen && (
        <SearchModal
          entries={options.map(({ displayName, value }) => ({
            title: displayName,
            value
          }))}
          isLoading={false}
          isOpen={selectModalIsOpen}
          onRequestClose={() => setChoice({ cancelled: true })}
          onSelectEntry={selected => setChoice({ selected: selected.value })}
        />
      )}
    </>
  );
}

function confirmShortcut(
  shortcut,
  { shiftKey, ctrlKey, altKey, metaKey, code }
) {
  return (
    shortcut.shiftKey === shiftKey &&
    shortcut.ctrlKey === ctrlKey &&
    shortcut.altKey === altKey &&
    shortcut.metaKey === metaKey &&
    shortcut.code === code
  );
}

function useShortcut() {
  const [shortcut, setShortcut] = useState(null);
  useEffect(() => {
    chrome.storage.sync.get({ shortcut: DEFAULT_SHORTCUT }, ({ shortcut }) =>
      setShortcut(shortcut)
    );
  }, []);
  return shortcut;
}

const DEFAULT_SHORTCUT = {
  shiftKey: true,
  ctrlKey: false,
  altKey: false,
  metaKey: true,
  code: "KeyP"
};

function KeyBindingModal({ isOpen, onRequestClose, onConfirmed }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div class="border-color-shade-013 flexbox flexbox-direction-column flexbox-grow-1 radius-tiny border-width-normal border-solid border-color-shade padding-bottom-tiny">
        <div class="font-size-small font-weight-medium line-height-small shade-087 flexbox flexbox-centered margin-top-medium margin-horizontal-smaller padding-bottom-tiny">
          Press key combination and then confirm ENTER.
        </div>
        <div class="flexbox flexbox-direction-column margin-smaller">
          <KeyBindingInput onConfirmed={onConfirmed} />
        </div>
      </div>
    </Modal>
  );
}

function KeyBindingInput({ onConfirmed }) {
  const focusCallback = useFocusCallback();
  const [preview, onKeydown] = useKeyCombination(onConfirmed);
  return (
    <input
      ref={combineFuns(onKeydown, focusCallback)}
      class="caret-087 border-width-thick no-outline border-solid border-primary radius-small font-size-small font-weight-medium line-height-medium shade-087 text-center padding-tiny"
      id="previewer"
      value={preview}
    />
  );
}

function useKeyCombination(onConfirmed) {
  const [combination, setCombination] = useState({});
  const onKeydown = useOnKeyDown(event => {
    event.preventDefault();
    const { shiftKey, ctrlKey, altKey, metaKey, code } = event;
    if (code === "Enter" && acceptableKeys[combination.code] !== undefined)
      onConfirmed(combination);
    else setCombination({ shiftKey, ctrlKey, altKey, metaKey, code });
  });
  return [preview(combination), onKeydown];
}

function preview({ shiftKey, ctrlKey, altKey, metaKey, code }) {
  var preview = "";
  const keyPreview = acceptableKeys[code];
  if (ctrlKey) preview += "⌃";
  if (shiftKey) preview += "⇧";
  if (altKey) preview += "⌥";
  if (metaKey) preview += "⌘";
  if (keyPreview !== undefined) preview += keyPreview;
  return preview;
}

const acceptableKeys = {
  KeyA: "A",
  KeyB: "B",
  KeyC: "C",
  KeyD: "D",
  KeyE: "E",
  KeyF: "F",
  KeyG: "G",
  KeyH: "H",
  KeyI: "I",
  KeyJ: "J",
  KeyK: "K",
  KeyL: "L",
  KeyM: "M",
  KeyN: "N",
  KeyO: "O",
  KeyP: "P",
  KeyQ: "Q",
  KeyR: "R",
  KeyS: "S",
  KeyT: "T",
  KeyU: "U",
  KeyV: "V",
  KeyW: "W",
  KeyX: "X",
  KeyY: "Y",
  KeyZ: "Z",
  Digit0: "0",
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Semicolon: ";",
  Quote: '"',
  Backslash: "\\",
  Slash: "/",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  ArrowLeft: "←",
  ArrowUp: "↑",
  ArrowRight: "→",
  ArrowDown: "↓"
};

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
