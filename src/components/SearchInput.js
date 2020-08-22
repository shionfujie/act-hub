import React from "react";
import useFocusCallback from "../hooks/useFocusCallback";

export default function SearchInput({onChange}) {
  const focusCallback = useFocusCallback();
  return (
    <div
      className="flexbox flexbox-align-center  padding-left-small padding-right-tiny"
      style={{ height: 44 }}
    >
      <div className="flexbox flexbox-centered padding-left-smaller padding-right-medium shade-087">
        <svg
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            stroke: "currentColor",
            strokeWidth: 4,
            height: 16,
            width: 16,
            display: "block"
          }}
        >
          <g fill="none">
            <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
          </g>
        </svg>
      </div>
      <div class="flexbox-grow-1">
        <input
          type="text"
          className="shade-087 font-size-medium font-weight-medium line-height-medium overflow-ellipsis no-border no-outline no-box-shadow full-width background-none"
          onChange={event => {
            event.stopPropagation();
            onChange(event.target.value);
          }}
          ref={focusCallback}
        />
      </div>
    </div>
  );
}
