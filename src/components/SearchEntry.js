import React from "react";

const normalClassName =
  "flexbox flexbox-centered pointer";
const highlightedClassName = `background-selected border-selected ${normalClassName}`;
export default function SearchEntry({
  iconUrl,
  title,
  spans,
  highlighted,
  onMouseEnter,
  onClick
}) {
  const padding = highlighted ? { padding: "7px 13px 7px 13px" } : { padding: "8px 14px 8px 14px"};
  const styledTitle = styleTitle(title, spans)
  console.debug('iconUrl:', iconUrl)
  return (
    <li
      className={highlighted ? highlightedClassName : normalClassName}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={{ margin: 0, ...padding }}
    >
      <img src={iconUrl || ''} style={{width: 16, height: 16}}/>
      <div className="flexbox-grow-1 shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis" style={{marginLeft: 16}}>
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