export default function useOnKeyDown(onkeydown) {
  return inputEl => {
    if (inputEl === null) return;
    inputEl.onkeydown = onkeydown;
  };
}
