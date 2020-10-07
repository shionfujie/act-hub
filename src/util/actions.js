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
    if (m.count >= q.length) {
      for (var j = ms.length - 1; j >= 0 && lt(m, ms[j]); j--);
      ms.splice(j + 1, 0, m);
      sorted.splice(j + 1, 0, action);
    }
  }
  return sorted;
}

// Calculates parameters for the sorting.
function match(title, q) {
  const ec = Array.from(title);
  const qc = Array.from(q);
  var m;
  var position = -1;
  var density = 0;
  var count = 0;
  for (var i = 0, j = 0; i < ec.length && j < qc.length; i++) {
    if (compareCaseInsensitively(ec[i], qc[j])) {
      if (j === 0) position = i;
      else density += i - m;
      m = i;
      j++;
      count++;
    }
  }
  return { position, density, count };
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
