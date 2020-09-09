import React from "react";
import SearchResultEntry from "./SearchResultEntry"

export default function SearchResult({ entries, selectedIndex, selectEntry, submitSelection }) {
  console.debug(selectedIndex)
  return (
    <div>
      <div className="border-top-width-normal border-top-solid border-top-color-shade-013" style={{marginLeft: 7, marginRight: 7}}></div>
      <ul className="list-style-type-none">
        {entries.map((entry, index) => {
          return (
            <SearchResultEntry
              key={entry.key}
              title={entry.title}
              highlighted={index === selectedIndex}
              onMouseEnter={() => selectEntry(index)}
              onClick={submitSelection}
            />
          );
        })}
      </ul>
    </div>
  );
}
