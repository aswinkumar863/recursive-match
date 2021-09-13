# Recursive Match

Recursively match input string with begin and end delimiters.

![build status](https://img.shields.io/travis/aswinkumar863/recursive-match)
![npm](https://img.shields.io/npm/v/recursive-match)
![dependencies](https://status.david-dm.org/gh/aswinkumar863/recursive-match.svg)
![downloads](https://img.shields.io/npm/dw/recursive-match)
![license](https://img.shields.io/npm/l/recursive-match)

## Highlights

- Builds with typescript.
- No dependencies.
- Supports both string and regex delimiters.
- Supports nested matches.

**Note:** May not be suitable for handling identical delimiters.

## Installation

Using [npm](https://npmjs.org):

```bash
npm install recursive-match
```

## Usage

```js
import { recursiveMatch } from 'recursive-match'

recursiveMatch('a{b{c}d}e', '{', '}')
/* [{"start":1,"end":8,"bodyStart":2,"bodyEnd":7,"match":"{b{c}d}",
"children":[{"start":3,"end":6,"bodyStart":4,"bodyEnd":5,"match":"{c}","children":[]}]}] */

recursiveMatch('abc{{{de}}}fgh', /{+/, /}+/)
/* [{"start":3,"end":11,"bodyStart":6,"bodyEnd":8,"match":"{{{de}}}","children":[]}] */
```
## API

### `recursiveMatch(string, begin, end)`

- **string**  `{string}` - The input string to match recursively.
- **begin** `{string|RegExp}` - The begin delimiter.
- **end** `{string|RegExp}` - The end delimiter.

## Credits

recursive-match is heavily inspired by the [jbnicolai/match-recursive](https://github.com/jbnicolai/match-recursive). Ultimately recursive-match is an effort to provide usable information like start and end index about the match.

## License

recursive-match is licensed under a [MIT License](https://github.com/aswinkumar863/recursive-match/blob/main/LICENSE).