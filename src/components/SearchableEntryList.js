import React, { useState, useEffect } from "react";
import SelectableList from "./SelectableEntryList";
import SearchInput from "./SearchInput";
import { searchEntries } from "../util/actions";

export default function SearchableEntryList({
  isLoading,
  entries,
  onRequestClose,
  onSelectEntry
}) {
  const [filtered, setFiltered] = useState(entries);
  const [q, setQuery] = useState("");
  useEffect(() => {
    if (isLoading) return;
    setFiltered(searchEntries(entries, q));
  }, [q, entries, isLoading]);
  return (
    <div className="flexbox flexbox-direction-column flexbox-grow-1 radius-small border-width-normal border-solid border-color-shade-013 background-shade-003 overflow-hidden">
      <SearchInput onChange={setQuery} />
      <SelectableList
        entries={filtered}
        onSelectEntry={(extensionId, action) => {
          onSelectEntry(extensionId, action);
          setQuery("");
        }}
        onRequestClose={() => {
          onRequestClose();
          setQuery("");
        }}
      />
    </div>
  );
}
