export default function compareCaseInsensitively(string, string1) {
  return 0 === string.localeCompare(string1, "en", { sensitivity: "base" });
}
