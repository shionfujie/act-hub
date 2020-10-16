import equalsCaseInsensitively from "../util/compareCaseInsensitively";

export function extensionSpecToActions({ id, name, actions }) {
  return actions.map((action, index) => {
    return {
      key: `${id}-${index}`,
      extensionId: id,
      title: action.displayName || `${name}: ${action.name}`,
      action
    };
  });
}

// Sorts entries according to the match results of their titles
// against q.
export function searchEntries(entries, q) {
  const sorted = [];
  const ms = []; // Match results that represent ranks of entries
  
  for (const entry of entries) {
    const m = match(entry.title, q);
    if (m.length !== q.length) continue;
    for (var j = ms.length - 1; j >= 0 && (ms.length === 0 || lt(m, ms[j])); j--);
    ms.splice(j + 1, 0, m);
    sorted.splice(j + 1, 0, entry);
  }
  return sorted;
}

// Compute a match with minimum density.
function match(title, q) {
  const ts = Array.from(title);
  const qs = Array.from(q);
  const stacks = [{ next: 0, density: 0, length: 0 }]
  for (var i = 0; i < ts.length; i++) {
    var prevLen = - 1
    for (var j = 0; j < stacks.length; j++) {
      const { next, length, last } = stacks[j]
      if (length === qs.length || !equalsCaseInsensitively(ts[i], qs[next])) {
        prevLen = length
        continue;
      }
      if (length === 0) {
        stacks[j].position = i
      } else {
        stacks[j].density += i - last
      }
      if (stacks[j].length === qs.length) {
        stacks[j].next = null;
      } else {
        stacks[j].next = next + 1
      }
      stacks[j].length = length + 1
      if (stacks[j].length === prevLen) {
        stacks.splice(--j, 1);
      }
      stacks[j].last = i
      prevLen = stacks[j].length;
    }
    if (stacks[stacks.length - 1].length !== 0) {
      stacks.push({ next: 0, density: 0, length: 0 })
    }
  }
  return stacks[0];
}
// function match(title, q) {
//   const ts = Array.from(title);
//   const qs = Array.from(q);
//   var position = -1; // The first position that matches
//   var density = 0;   // The sum of distances between matches
//   var p;             // The Previous position that matched
//   var i = 0
//   var j = 0;
//   for (; i < ts.length && j < qs.length; i++) {
//     if (equalsCaseInsensitively(ts[i], qs[j])) {
//       if (j === 0) position = i;
//       else density += i - p;
//       p = i;
//       j++;
//     }
//   }
//   return { position, density, count: j };
// }

// Compares lexicographically.
const lt = (m, m1) => {
  if (m.length > m1.length) return true;
  else if (m.length < m1.length) return false;
  else {
    if (m.density < m1.density) return true;
    else if (m.density > m1.density) return false;
    else {
      if (m.position < m1.position) return true;
      else if (m.position > m1.position) return false;
      else return false;
    }
  }
};
