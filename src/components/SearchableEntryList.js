import React, { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import SearchEntryList from "./SearchEntryList";
import useOnKeyDown from "../hooks/useOnKeyDown";
import useOnKeyUp from "../hooks/useOnKeyUp";
import combinefuns from "../util/combineFuns";
import useSearchController from "../hooks/controllers/useSearchController";
import useSelectionController from "../hooks/controllers/useSelectionController";

export default function SearchableEntryList({
  isLoading,
  entries,
  onRequestClose,
  onSelectEntry
}) {
  const searchController = useSearchController(entries, isLoading);
  const selectionController = useSelectionController(
    searchController.searchResult,
    entry => {
      onSelectEntry(entry);
      searchController.setQuery("");
    }
  );
  const handleKeyDown = event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "ArrowUp") selectionController.shiftSelection(-1);
    else if (key === "ArrowDown") selectionController.shiftSelection(1);
  }
  const handleKeyUp = event => {
    event.stopPropagation();
    const key = event.key;
    if (key === "Enter") selectionController.submitEntry();
    else if (key == "Escape") {
      onRequestClose();
    }
  }
  const onkeydownRef = useOnKeyDown(handleKeyDown);
  const onkeyupRef = useOnKeyUp(handleKeyUp);
  return (
    <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden">
      <div ref={combinefuns(onkeydownRef, onkeyupRef)}>
        <SearchInput onChange={searchController.setQuery} />
      </div>
      {searchController.searchResult.length > 0 && (
        <SearchEntryList
          entries={searchController.searchResult}
          selectedIndex={selectionController.selectedIndex}
          submitEntry={selectionController.submitEntry}
          selectIndex={selectionController.selectIndex}
        />
      )}
    </div>
  );
}

