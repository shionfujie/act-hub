export default function useOnKeyUp(onkeyup) {
  return inputEl => {
    if (inputEl === null) return;
    inputEl.onkeyup = onkeyup;
  };
}
