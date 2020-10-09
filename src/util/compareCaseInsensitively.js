export default function equalsCaseInsensitively(string, string1) {
  return 0 === string.localeCompare(string1, "en", { sensitivity: "base" });
}
