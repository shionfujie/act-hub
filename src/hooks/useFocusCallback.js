import { useCallback } from "react";

export default function useFocusCallback() {
  return useCallback(el => {
    if (el) el.focus();
  }, []);
}
