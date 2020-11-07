import React from "react";

const normalClassName =
  "padding-left-small pointer padding-top-smaller padding-bottom-smaller padding-right-tiny";
const highlightedClassName = `background-selected border-selected ${normalClassName}`;
export default function SearchEntry({
  title,
  spans,
  highlighted,
  onMouseEnter,
  onClick
}) {
  const padding = highlighted ? { padding: "7px 3px 7px 11px" } : null;
  const styledTitle = styleTitle(title, spans)
  return (
    <li
      className={highlighted ? highlightedClassName : normalClassName}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={{ margin: 0, ...padding }}
    >
      <div className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis">
        {styledTitle}
      </div>
    </li>
  );
}

function styleTitle(title, spans) {
  if (!spans) 
    return [title]
  const parts = []
  var p = 0
  for (const span of spans) {
    parts.push(
      <span style={{fontWeight: 500}}>{
        title.slice(p, span.start)
      }</span>
    )
    parts.push(title.slice(span.start, span.end))
    p = span.end
  }
  parts.push(
    <span style={{fontWeight: 500}}>{
      title.slice(p)
    }</span>
  )
  return parts
}