import equalsCaseInsensitively from "../util/compareCaseInsensitively";

export function extensionSpecToActions({ id, name, actions, installedAt }) {
  return actions.map((action, index) => {
    return {
      key: `${id}-${index}`,
      extensionId: id,
      title: action.displayName || `${name}: ${action.name}`,
      action: {...action, installedAt}
    };
  });
}

// Sorts entries according to the match results of their titles
// against q.
export function searchEntries(entries, q) {
  if (q === '') 
    return entries

  const sorted = [];
  const ms = []; // Match results that represent ranks of entries

  for (const entry of entries) {
    const m = match(entry.title, q);
    if (m.length !== q.length) continue;
    for (
      var j = ms.length - 1;
      j >= 0 && (ms.length === 0 || lt(m, ms[j]));
      j--
    );
    ms.splice(j + 1, 0, m);
    sorted.splice(j + 1, 0, {...entry, spans: m.spans});
  }
  return sorted;
}

export function compareDates(e, e1) {
  const primaryDate = (e) => {
    const a = e.action
    if ('lastUsed' in a)
      return a['lastUsed']
    else if ('installedAt' in a) 
      return a['installedAt']
    return ""
  }
  const p = primaryDate(e)
  const p1 = primaryDate(e1)
  if (p > p1) return - 1
  else if (p === p1) return 0
  else return 1
}

// Compute a match with minimum density.
function match(title, q) {
  const ts = Array.from(title);
  const qs = Array.from(q);
  const matches = [{ next: 0, density: 0, length: 0 }];
  for (var i = 0; i < ts.length; i++) {
    var c; // Current match
    for (var j = 0; j < matches.length; j++) {
      c = matches[j]
      if (c.length === qs.length || !equalsCaseInsensitively(ts[i], qs[c.next])) {
        continue;
      }

      if (c.length === 0) {
        c.spans = [{start: i, end: i + 1}]
      } else {
        c.density += i - c.last;
        const lastSpan = c.spans[c.spans.length - 1]
        if (lastSpan.end === i)
          lastSpan.end = i + 1
        else
          c.spans.push({ start: i, end: i + 1 })
      }
      c.next += 1;
      c.last = i;
      c.length += 1;

      const p = matches[j - 1] // Previous match
      if (j === 0 || c.length !== p.length) {
        continue
      }
      if (lt(c, p)) {
        console.debug("Comparing:", "text:", title, ": q:", q, "current:", JSON.stringify(c), "< previous:", JSON.stringify(matches[j - 1]))
        matches.splice(j - 1, 1);
        j--; 
      } else if (p.last === i) {
        console.debug("Comparing:", "text:", title, ": q:", q, "current:", JSON.stringify(c), ">= previous:", JSON.stringify(matches[j - 1]))
        matches.splice(j, 1);
        j--; 
      }
    }
    if (c.length !== 0)
      matches.push({ next: 0, density: 0, length: 0 });
  }
  console.debug("Matching:", "text:", title, ": q:", q,":final stacks:", matches)
  return matches[0];
}

// Compares lexicographically.
const lt = (m, m1) => {
  if (m.length > m1.length) return true;
  else if (m.length < m1.length) return false;
  else {
    if (m.density < m1.density) return true;
    else if (m.density > m1.density) return false;
    else {
      if (m.spans[0].start < m1.spans[0].start) return true;
      else if (m.spans[0].start > m1.spans[0].start) return false;
      else return false;
    }
  }
};
