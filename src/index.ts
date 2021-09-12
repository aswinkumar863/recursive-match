/**
 * Recursively match input string with begin and end delimiters.
 *
 * @param {string} str - The input string to match recursively.
 * @param {string | RegExp} begin - The begin delimiter.
 * @param {string | RegExp} end - The end delimiter.
 * @returns {Match[]} Recursively matched list.
 */
export function recursiveMatch(str: string, begin: string | RegExp, end: string | RegExp): Match[] {
  const results: Match[] = [];
  const openTokens: Token[] = [];

  /* Prepare delimiters */
  const opener = begin instanceof RegExp ? begin.source : escapeRegExp(begin);
  const closer = end instanceof RegExp ? end.source : escapeRegExp(end);

  if (opener === closer) {
    throw new Error('Begin and end delimiter cannot be identical');
  }

  /* Use regex character class when begin and end delimiters are one character each */
  const regExp = (opener + closer).length === 2 ? '[' + opener + closer + ']' : opener + '|' + closer;
  const iterator = new RegExp(regExp, 'g');

  let match;
  while ((match = iterator.exec(str)) !== null) {
    if (match[0].search(opener) > -1) {
      openTokens.push({
        parent: openTokens[openTokens.length - 1]?.children || results,
        start: match.index,
        bodyStart: iterator.lastIndex,
        children: [],
      });
    } else if (openTokens.length) {
      const openToken = openTokens.pop();
      openToken.parent.push({
        start: openToken.start,
        end: iterator.lastIndex,
        bodyStart: openToken.bodyStart,
        bodyEnd: match.index,
        match: str.slice(openToken.start, iterator.lastIndex),
        children: openToken.children,
      });
    }
  }

  /* Handle unclosed delimiters */
  for (const openToken of openTokens) {
    if (openToken.children.length) results.push(...openToken.children);
  }

  return results;
}

function escapeRegExp(str: string): string {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}
