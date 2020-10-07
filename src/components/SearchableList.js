import React, { useState, useEffect } from "react";
import SearchResult from "./SearchResult";
import SearchInput from "./SearchInput";
import useOnKeyDown from "../hooks/useOnKeyDown";
import useOnKeyUp from "../hooks/useOnKeyUp";
import combinefuns from "../util/combineFuns";

export default function SearchableList({
  actions,
  onQueryChange,
  onSelectAction,
  onRequestClose
}) {
  const [selectedIndex, selectIndex] = useState(0);
  useEffect(() => selectIndex(0), [actions]);
  function shiftSelection(offset) {
    const index = selectedIndex + offset;
    if (-1 < index && index < actions.length) selectIndex(index);
  }
  function submitAction() {
    const { extensionId, action } = actions[selectedIndex];
    onSelectAction(extensionId, action);
    onQueryChange("");
  }
  const onkeydownRef = useOnKeyDown(event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "ArrowUp") shiftSelection(-1);
    else if (key === "ArrowDown") shiftSelection(1);
  });
  const onkeyupRef = useOnKeyUp(event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "Enter") submitAction();
    else if (key == "Escape") {
      onRequestClose();
      onQueryChange("");
    }
  });
  return (
    <div
      ref={combinefuns(onkeydownRef, onkeyupRef)}
      className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden"
    >
      <SearchInput onChange={onQueryChange} />
      {actions.length > 0 && (
        <SearchResult
          actions={actions}
          selectedIndex={selectedIndex}
          submitAction={submitAction}
          selectIndex={selectIndex}
        />
      )}
    </div>
  );
}
