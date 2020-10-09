import React, { useState, useEffect } from "react";
import SearchEntryList from "./SearchEntryList";
import useOnKeyDown from "../hooks/useOnKeyDown";
import useOnKeyUp from "../hooks/useOnKeyUp";
import combinefuns from "../util/combineFuns";

export default function SelectableList({
  entries,
  onSelectEntry,
  onRequestClose
}) {
  const [selectedIndex, selectIndex] = useState(0);
  useEffect(() => selectIndex(0), [entries]);
  function shiftSelection(offset) {
    const index = selectedIndex + offset;
    if (-1 < index && index < entries.length) selectIndex(index);
  }
  function submitEntry() {
    const { extensionId, action } = entries[selectedIndex];
    onSelectEntry(extensionId, action);
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
    if (key === "Enter") submitEntry();
    else if (key == "Escape") {
      onRequestClose();
    }
  });
  return (
    <div
      ref={combinefuns(onkeydownRef, onkeyupRef)}
    >
      {entries.length > 0 && (
        <SearchEntryList
          entries={entries}
          selectedIndex={selectedIndex}
          submitEntry={submitEntry}
          selectIndex={selectIndex}
        />
      )}
    </div>
  );
}
