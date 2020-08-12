import usePDState from "./usePDState";

export default function usePDSwitch(initial = false) {
  const [v, setState] = usePDState(initial);
  return [v, () => setState(true), () => setState(false)];
}
