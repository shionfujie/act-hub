import { useState, useEffect } from "react";

export default function useSelection(entries, onSelectEntry) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  function select(index) {
    if (-1 < index && index < entries.length) setSelectedIndex(index);
  }
  function shiftBy(offset) {
    console.log(`selectionController.shiftSelection: selectedIndex=${selectedIndex}`)
    select(selectedIndex + offset);
  }
  function submit() {
    onSelectEntry(entries[selectedIndex]);
  }
  useEffect(() => {
    select(0);
  }, [entries]);
  console.log(`selectedIndex=${selectedIndex}`)
  return {
    entries,
    selectedIndex,
    select,
    shiftBy,
    submit
  };
}
