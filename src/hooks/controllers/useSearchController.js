import { useState, useEffect } from "react";
import { searchEntries } from "../../util/actions";

export default function useSearchController(entries, isLoading) {
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
