import compareCaseInsensitively from "./compareCaseInsensitively";

export default function containsSparsely(array, array1) {
  if (array1.length === 0) return true;
  else if (array.length === 0) return false;
  else {
    const [a1, ...rest1] = array1;
    const index = array.findIndex(a => compareCaseInsensitively(a, a1));
    if (index < 0) return false;
    else return containsSparsely(array.slice(index + 1), rest1);
  }
}
