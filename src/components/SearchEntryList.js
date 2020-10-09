import React from "react";
import SearchEntry from "./SearchEntry"

export default function SearchEntryList({ entries, selectedIndex, selectIndex, submitEntry }) {
  return (
    <div>
      <div className="border-top-width-normal border-top-solid border-top-color-shade-013" style={{marginLeft: 7, marginRight: 7}}></div>
      <ul className="list-style-type-none">
        {entries.map((entry, index) => {
          return (
            <SearchEntry
              key={entry.key}
              title={entry.title}
              highlighted={index === selectedIndex}
              onMouseEnter={() => selectIndex(index)}
              onClick={submitEntry}
            />
          );
        })}
      </ul>
    </div>
  );
}