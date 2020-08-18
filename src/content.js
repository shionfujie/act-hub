/* global chrome */
import React, {useState} from "react";
import ReactDOM from "react-dom";
import "./css/content.css";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";
import SearchModal from "./components/SearchModal";
import ReactModal from "react-modal";
import useFocusCallback from "./hooks/useFocusCallback";

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

function KeyBindingModal({ isOpen, onRequestClose }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div class="border-color-shade-013 flexbox flexbox-direction-column flexbox-grow-1 radius-tiny border-width-normal border-solid border-color-shade padding-bottom-tiny">
        <div class="font-size-small font-weight-medium line-height-small shade-087 flexbox flexbox-centered margin-top-medium margin-horizontal-smaller padding-bottom-tiny">
          Press key combination and then confirm ENTER.
        </div>
        <div class="flexbox flexbox-direction-column margin-smaller">
          <KeyBindingInput />
        </div>
      </div>
    </Modal>
  );
}

function useOnKeyDown(onkeydown) {
  return (inputEl) => {
    if (inputEl === null) return
    inputEl.onkeydown = onkeydown
  }
}

function combineFuns(...funs) {
  return (...args) => {
    return funs.map(f => f(...args))
  }
}

function KeyBindingInput() {
  const focusCallback = useFocusCallback()
  const [preview, setPreview] = useState("") 
  const onKeydown = useOnKeyDown(event => {
    event.preventDefault()
    const {shiftKey, ctrlKey, altKey, metaKey, code} = event
    var preview = ""
    const keyPreview = acceptableKeys[code]
    if (ctrlKey) preview += "⌃"
    if (shiftKey) preview += "⇧"
    if (altKey) preview += "⌥"
    if (metaKey) preview += "⌘"
    if (keyPreview !== undefined) preview += keyPreview
    setPreview(preview)
  })
  return (
    <input
      ref={combineFuns(onKeydown, focusCallback)}
      class="border-width-thick no-outline border-solid border-primary radius-small font-size-small font-weight-medium line-height-medium shade-087 text-center padding-tiny"
      id="previewer"
      value={preview}
    />
  );
}

const acceptableKeys = {
  "KeyA": "A",
  "KeyB": "B",
  "KeyC": "C",
  "KeyD": "D",
  "KeyE": "E",
  "KeyF": "F",
  "KeyG": "G",
  "KeyH": "H",
  "KeyI": "I",
  "KeyJ": "J",
  "KeyK": "K",
  "KeyL": "L",
  "KeyM": "M",
  "KeyN": "N",
  "KeyO": "O",
  "KeyP": "P",
  "KeyQ": "Q",
  "KeyR": "R",
  "KeyS": "S",
  "KeyT": "T",
  "KeyU": "U",
  "KeyV": "V",
  "KeyW": "W",
  "KeyX": "X",
  "KeyY": "Y",
  "KeyZ": "Z",
  "Digit0": "0",
  "Digit1": "1",
  "Digit2": "2",
  "Digit3": "3",
  "Digit4": "4",
  "Digit5": "5",
  "Digit6": "6",
  "Digit7": "7",
  "Digit8": "8",
  "Digit9": "9",
  "Minus": "-",
  "Equal": "=",
  "BracketLeft": "[",
  "BracketRight": "]",
  "Semicolon": ";",
  "Quote": "\"",
  "Backslash": "\\",
  "Slash": "/",
  "F1": "F1",
  "F2": "F2",
  "F3": "F3",
  "F4": "F4",
  "F5": "F5",
  "F6": "F6",
  "F7": "F7",
  "F8": "F8",
  "F9": "F9",
  "F10": "F10",
  "F11": "F11",
  "F12": "F12",
  "ArrowLeft": "←",
  "ArrowUp": "↑",
  "ArrowRight": "→",
  "ArrowDown": "↓",
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
