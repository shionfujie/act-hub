import { useState, useEffect } from "react";
import { cyclicModulo } from "../../util/math";

export default function useSelection(entries, onSelectEntry) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  function select(index) {
    if (-1 < index && index < entries.length) setSelectedIndex(index);
  }
  function shiftBy(offset) {
    console.log(`selectionController.shiftSelection: selectedIndex=${selectedIndex}`)
    select(cyclicModulo(selectedIndex + offset, entries.length));
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
