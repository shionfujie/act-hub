import React, { useState } from "react";
import useDocumentKeydown from "../hooks/useDocumentKeydown";
import SearchResultEntry from "./SearchResultEntry"

export default function SearchResult({ onSelectAction, entries }) {
  const [selectedIndex, selectEntry] = useState(0);
  const getSelectedEntry = () => entries[selectedIndex];
  useDocumentKeydown(({ key }) => {
    if (key === "ArrowUp") shiftSelection(-1);
    else if (key === "ArrowDown") shiftSelection(1);
    else if (key === "Enter") submitSelection();
  });
  function shiftSelection(offset) {
    const index = selectedIndex + offset;
    if (-1 < index < entries.length) selectEntry(index);
  }
  function submitSelection() {
    const selectedEntry = getSelectedEntry();
    onSelectAction(selectedEntry.extensionId, selectedEntry.action);
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
