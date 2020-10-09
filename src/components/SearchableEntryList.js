import React, { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import SearchEntryList from "./SearchEntryList";
import { searchEntries } from "../util/actions";
import useOnKeyDown from "../hooks/useOnKeyDown";
import useOnKeyUp from "../hooks/useOnKeyUp";
import combinefuns from "../util/combineFuns";

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
  const [keyUpEvent, onkeyupRef] = useKeyUpEvent();
  const [keyDownEvent, onkeydownRef] = useKeyDownEvent();
  if (keyUpEvent) {
    keyUpEvent.stopPropagation();
    const key = keyUpEvent.key;
    if (key === "ArrowUp") selectionController.shiftSelection(-1);
    else if (key === "ArrowDown") selectionController.shiftSelection(1);
  }
  if (keyDownEvent) {
    keyDownEvent.stopPropagation();
    const key = keyDownEvent.key;
    if (key === "Enter") selectionController.submitEntry();
    else if (key == "Escape") onRequestClose();
  }
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

function useSearchController(entries, isLoading) {
  const [q, setQuery] = useState("");
  const [controller, setController] = useState({
    searchResult: entries,
    setQuery: setQuery
  });
  useEffect(() => {
    if (isLoading) return;
    setController({ ...controller, searchResult: searchEntries(entries, q) });
  }, [q, entries, isLoading]);
  return controller;
}

function useSelectionController(entries, onSelectEntry) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  function selectIndex(index) {
    if (-1 < index && index < entries.length) setSelectedIndex(index);
  }
  function shiftSelection(offset) {
    selectIndex(selectedIndex + offset);
  }
  function submitEntry() {
    onSelectEntry(entries[selectedIndex]);
  }
  useEffect(() => {
    selectIndex(0);
  }, [entries]);
  return {
    entries,
    selectedIndex,
    selectIndex,
    shiftSelection,
    submitEntry
  };
}

function useKeyUpEvent() {
  const [event, setEvent] = useState(null);
  const ref = useOnKeyUp(event => {
    setEvent(event);
    setEvent(null);
  });
  return [event, ref];
}

function useKeyDownEvent() {
  const [event, setEvent] = useState(null);
  const ref = useOnKeyDown(event => {
    setEvent(event);
    setEvent(null);
  });
  return [event, ref];
}
