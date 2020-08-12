import React from "react";
import usePDSwitch from "../hooks/usePDSwitch"

function highlightedOnMouseEnter(C) {
  return function({ highlighted, onMouseEnter, ...props }) {
    const [isHighlighted, highlightEntry] = usePDSwitch(highlighted);
    return (
      <C
        isHighlighted={isHighlighted}
        onMouseEnter={() => {
          highlightEntry();
          onMouseEnter();
        }}
        {...props}
      />
    );
  };
}

const normalClassName =
  "padding-left-small pointer padding-top-smaller padding-bottom-smaller padding-right-tiny";
const highlightedClassName = `background-selected border-selected ${normalClassName}`;
const SearchResultEntry = highlightedOnMouseEnter(
  ({ title, isHighlighted, onMouseEnter, onClick }) => {
    const padding = isHighlighted ? { padding: "7px 3px 7px 11px" } : null;
    return (
      <li
        className={isHighlighted ? highlightedClassName : normalClassName}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        style={{ margin: 0, ...padding }}
      >
        <div className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis">
          {title}
        </div>
      </li>
    );
  }
);
export default SearchResultEntry
// function SearchResultEntry({title, highlighted, onMouseEnter, onClick}) {
//     const [isHighlighted, highlightEntry] = usePropSwitch(highlighted)
//     const padding = isHighlighted ? { padding: "7px 3px 7px 11px" } : null
//     return (
//       <li
//         className={isHighlighted ? highlightedClassName : normalClassName}
//         onMouseEnter={() => {
//             highlightEntry()
//             onMouseEnter()
//         }}
//         onClick={onClick}
//         style={{margin: 0, ...padding}}
//       >
//         <div className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis">
//           {title}
//         </div>
//       </li>
//     );
// }
