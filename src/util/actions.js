import compareCaseInsensitively from "../util/compareCaseInsensitively";

export function extensionSpecToEntries({ id, name, actions }) {
  return actions.map((action, index) => {
    return {
      key: `${id}-${index}`,
      extensionId: id,
      title: action.displayName || `${name}: ${action.name}`,
      action
    };
  });
}

// Sorts actions according to the match results of their titles
// against q.
export function sortActions(actions, q) {
  const ms = [];
  const sorted = [];
  for (const action of actions) {
    const m = match(action.title, q);
    if (m.count < q.length) continue;
    for (var j = ms.length - 1; j >= 0 && lt(m, ms[j]); j--);
    ms.splice(j + 1, 0, m);
    sorted.splice(j + 1, 0, action);
  }
  return sorted;
}

// Calculates parameters for the sorting.
function match(title, q) {
  const ts = Array.from(title);
  const qs = Array.from(q);
  var position = -1; // The first position that matches
  var density = 0;   // The sum of distances between matches
  var p;             // The Previous position that matched
  for (var i = 0, j = 0; i < ts.length && j < qs.length; i++) {
    if (compareCaseInsensitively(ts[i], qs[j])) {
      if (j === 0) position = i;
      else density += i - p;
      p = i;
      j++;
    }
  }
  return { position, density, count: j };
}

// Compares lexicographically.
const lt = (m, m1) => {
  if (m.count > m1.count) return true;
  else if (m.count < m1.count) return false;
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
