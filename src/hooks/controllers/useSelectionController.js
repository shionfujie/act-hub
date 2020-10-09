import { useState, useEffect } from "react";

export default function useSelectionController(entries, onSelectEntry) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  function selectIndex(index) {
    if (-1 < index && index < entries.length) setSelectedIndex(index);
  }
  function shiftSelection(offset) {
    console.log(`selectionController.shiftSelection: selectedIndex=${selectedIndex}`)
    selectIndex(selectedIndex + offset);
  }
  function submitEntry() {
    onSelectEntry(entries[selectedIndex]);
  }
  useEffect(() => {
    selectIndex(0);
  }, [entries]);
  console.log(`selectedIndex=${selectedIndex}`)
  return {
    entries,
    selectedIndex,
    selectIndex,
    shiftSelection,
    submitEntry
  };
}
