import React from "react";
import SearchResultEntry from "./SearchResultEntry"

export default function SearchResult({ actions, selectedIndex, selectIndex, submitAction }) {
  return (
    <div>
      <div className="border-top-width-normal border-top-solid border-top-color-shade-013" style={{marginLeft: 7, marginRight: 7}}></div>
      <ul className="list-style-type-none">
        {actions.map((action, index) => {
          return (
            <SearchResultEntry
              key={action.key}
              title={action.title}
              highlighted={index === selectedIndex}
              onMouseEnter={() => selectIndex(index)}
              onClick={submitAction}
            />
          );
        })}
      </ul>
    </div>
  );
}
