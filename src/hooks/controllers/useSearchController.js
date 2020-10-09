import { useState, useEffect } from "react";
import { searchEntries } from "../../util/actions";

export default function useSearch(entries, isLoading) {
  const [q, setQuery] = useState("");
  const [controller, setController] = useState({
    result: entries,
    setQuery: setQuery
  });
  useEffect(() => {
    if (isLoading) return;
    setController({ ...controller, result: searchEntries(entries, q) });
  }, [q, entries, isLoading]);
  return controller;
}
