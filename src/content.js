import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import "./css/content.css";
import usePort from "./hooks/chrome/usePort";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";

function Main() {
  const port = usePort("ActHub");
  const [modalIsOpen, openModal, closeModal] = useSwitch();
  useDocumentKeydown(({code, shiftKey, metaKey}) => {
    if (code == "KeyP" && shiftKey && metaKey) openModal()
  })
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden">
                <div className="flexbox flexbox-align-center  padding-left-small padding-right-tiny" style={{height: 44}} > 
                    <div className="flexbox flexbox-centered padding-left-smaller padding-right-medium shade-087">
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{stroke: "currentColor", strokeWidth: 4, height: 16, width: 16, display: "block"}}>
                            <g fill="none">
                                <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                            </g>
                        </svg>
                    </div>
                    <div class="flexbox-grow-1">
                        <input type="text" className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis no-border no-outline no-box-shadow full-width background-none"/>
                    </div>
                </div>  
                <div>
                    <ul className="list-style-type-none">
                        <li className="background-selected border-selected padding-left-small pointer padding-top-smaller padding-bottom-smaller padding-right-tiny" style={{padding: "7px 3px 7px 11px"}}>
                            <div className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis">Test</div>
                        </li>
                        <li className="padding-left-small pointer padding-top-smaller padding-bottom-smaller padding-right-tiny">
                            <div className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis">Test1</div>
                        </li>
                        <li className="padding-left-small pointer padding-top-smaller padding-bottom-smaller padding-right-tiny">
                            <div className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis">Test2</div>
                        </li>
                        <li className="padding-left-small pointer padding-top-smaller padding-bottom-smaller padding-right-tiny">
                            <div className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis">Test3</div>
                        </li>
                    </ul>
                </div>
            </div>
    </Modal>
  );
}

function SearchModal() {
    return <div></div>
}

function Modal({ isOpen, onRequestClose, children }) {
    return (
      <ReactModal
        id="act-hub-modal-root"
        // className="padding-horizontal-larger"
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

function SearchInput() {
    return <div></div>
}

function SearchResult() {
    return <div></div>
}

function SearchResultEntry() {
    return <div></div>
}


  



const app = document.createElement("div");
app.id = "act-hub-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
