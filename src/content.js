import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import "./css/content.css";
import usePort from "./hooks/chrome/usePort";
import useSwitch from "./hooks/useSwitch";

function Main() {
  const port = usePort("ActHub");
  const [modalIsOpen, openModal, closeModal] = useSwitch();
  port.postMessage({ message: "Hello, backgroundJs! -- from contentJs" });
  return (
    <ReactModal isOpen={true} onRequestClose={closeModal}>
      <div>Test</div>
    </ReactModal>
  );
}

const app = document.createElement("div");
app.id = "act-hub-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
