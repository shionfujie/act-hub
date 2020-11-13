import React from "react";
import SearchInput from "./SearchInput";
import SearchEntryList from "./SearchEntryList";
import useOnKeyDown from "../hooks/useOnKeyDown";
import useOnKeyUp from "../hooks/useOnKeyUp";
import combinefuns from "../util/combineFuns";
import useSearch from "../hooks/controllers/useSearchController";
import useSelection from "../hooks/controllers/useSelectionController";

export default function SearchableEntryList({
  isLoading,
  entries,
  onRequestClose,
  onSelectEntry
}) {
  const search = useSearch(entries, isLoading);
  const selection = useSelection(search.result, entry => {
    onSelectEntry(entry);
    search.setQuery("");
  });
  function handleKeyDown(event) {
    event.stopPropagation();
    const key = event.key;
    if (key === "ArrowUp") selection.shiftBy(-1);
    else if (key === "ArrowDown") selection.shiftBy(1);
  }
  function handleKeyUp(event) {
    event.stopPropagation();
    const key = event.key;
    if (key === "Enter") selection.submit();
    else if (key == "Escape") {
      onRequestClose();
    }
  }
  const onkeydownRef = useOnKeyDown(handleKeyDown);
  const onkeyupRef = useOnKeyUp(handleKeyUp);
  return (
    <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 overflow-hidden">
      <div ref={combinefuns(onkeydownRef, onkeyupRef)}>
        <SearchInput onChange={search.setQuery} />
      </div>
      {search.result.length > 0 && (
        <SearchEntryList
          entries={search.result}
          selectedIndex={selection.selectedIndex}
          submitEntry={selection.submit}
          selectIndex={selection.select}
        />
      )}
    </div>
  );
}
