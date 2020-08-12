import { useState, useEffect } from "react";

export default function usePDState(initial) {
  const [v, setState] = useState(initial);
  useEffect(() => {
    if (v !== initial) setState(initial);
  }, [initial]);
  return [v, setState];
}
