import React from "react";

const normalClassName =
  "padding-left-small pointer padding-top-smaller padding-bottom-smaller padding-right-tiny";
const highlightedClassName = `background-selected border-selected ${normalClassName}`;
export default function SearchEntry({
  title,
  highlighted,
  onMouseEnter,
  onClick
}) {
  const padding = highlighted ? { padding: "7px 3px 7px 11px" } : null;
  return (
    <li
      className={highlighted ? highlightedClassName : normalClassName}
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
