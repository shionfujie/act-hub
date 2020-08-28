export default function combinefuns(...funs) {
  return (...args) => {
    return funs.map(f => f(...args));
  };
}
