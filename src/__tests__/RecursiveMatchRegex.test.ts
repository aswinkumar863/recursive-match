import { recursiveMatch } from '../index';

describe('Regex Delimiters', () => {
  test('Identical Delimiters', () => {
    expect(() => recursiveMatch('abc"def"gh"i"jkl', /"/, /"/)).toThrow(Error);
  });

  test('Single match', () => {
    expect(recursiveMatch('abc{def}ghi', /{/, /}/)).toEqual([
      { start: 3, end: 8, bodyStart: 4, bodyEnd: 7, match: '{def}', children: [] },
    ]);
  });

  test('Multiple match', () => {
    expect(recursiveMatch('abc{def}ghi{jkl}mn', /{/, /}/)).toEqual([
      { start: 3, end: 8, bodyStart: 4, bodyEnd: 7, match: '{def}', children: [] },
      { start: 11, end: 16, bodyStart: 12, bodyEnd: 15, match: '{jkl}', children: [] },
    ]);
  });

  test('Multiple Nested match', () => {
    expect(recursiveMatch('abc{{{def}g{hi}}}jk', /{/, /}/)).toEqual([
      {
        start: 3,
        end: 17,
        bodyStart: 4,
        bodyEnd: 16,
        match: '{{{def}g{hi}}}',
        children: [
          {
            start: 4,
            end: 16,
            bodyStart: 5,
            bodyEnd: 15,
            match: '{{def}g{hi}}',
            children: [
              { start: 5, end: 10, bodyStart: 6, bodyEnd: 9, match: '{def}', children: [] },
              { start: 11, end: 15, bodyStart: 12, bodyEnd: 14, match: '{hi}', children: [] },
            ],
          },
        ],
      },
    ]);
  });

  test('Unbalanced start match', () => {
    expect(recursiveMatch('abc{def{ghi}jkl', /{/, /}/)).toEqual([
      { start: 7, end: 12, bodyStart: 8, bodyEnd: 11, match: '{ghi}', children: [] },
    ]);
    expect(recursiveMatch('a<<b>cd', /</, />/)).toEqual([
      { start: 2, end: 5, bodyStart: 3, bodyEnd: 4, match: '<b>', children: [] },
    ]);
  });

  test('Unbalanced end match', () => {
    expect(recursiveMatch('abc}{de{fgh}}ijk', /{/, /}/)).toEqual([
      {
        start: 4,
        end: 13,
        bodyStart: 5,
        bodyEnd: 12,
        match: '{de{fgh}}',
        children: [{ start: 7, end: 12, bodyStart: 8, bodyEnd: 11, match: '{fgh}', children: [] }],
      },
    ]);
    expect(recursiveMatch('a<b>>cd', /</, />/)).toEqual([
      { start: 1, end: 4, bodyStart: 2, bodyEnd: 3, match: '<b>', children: [] },
    ]);
  });

  test('No match', () => {
    expect(recursiveMatch('abcd', /\(/, /\)/)).toEqual([]);
  });

  test('Empty match', () => {
    expect(recursiveMatch('(a(b)c)()d', /\(/, /\)/)).toEqual([
      {
        start: 0,
        end: 7,
        bodyStart: 1,
        bodyEnd: 6,
        match: '(a(b)c)',
        children: [{ start: 2, end: 5, bodyStart: 3, bodyEnd: 4, match: '(b)', children: [] }],
      },
      { start: 7, end: 9, bodyStart: 8, bodyEnd: 8, match: '()', children: [] },
    ]);
  });

  test('Complicated Delimiters', () => {
    expect(recursiveMatch('abc{{{de}}}fgh', /{+/, /}+/)).toEqual([
      { start: 3, end: 11, bodyStart: 6, bodyEnd: 8, match: '{{{de}}}', children: [] },
    ]);
    expect(recursiveMatch('<|a<b<|c|>d|>efg', /<\|/, /\|>/)).toEqual([
      {
        start: 0,
        end: 13,
        bodyStart: 2,
        bodyEnd: 11,
        match: '<|a<b<|c|>d|>',
        children: [{ start: 5, end: 10, bodyStart: 7, bodyEnd: 8, match: '<|c|>', children: [] }],
      },
    ]);
  });

  test('Multiline', () => {
    expect(recursiveMatch('{\n  "a": {\n    "b": {\n      "c": "d",\n      "e": "f"\n    }\n  }\n}', /{/, /}/)).toEqual(
      [
        {
          start: 0,
          end: 64,
          bodyStart: 1,
          bodyEnd: 63,
          match: '{\n  "a": {\n    "b": {\n      "c": "d",\n      "e": "f"\n    }\n  }\n}',
          children: [
            {
              start: 9,
              end: 62,
              bodyStart: 10,
              bodyEnd: 61,
              match: '{\n    "b": {\n      "c": "d",\n      "e": "f"\n    }\n  }',
              children: [
                {
                  start: 20,
                  end: 58,
                  bodyStart: 21,
                  bodyEnd: 57,
                  match: '{\n      "c": "d",\n      "e": "f"\n    }',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    );
  });
});
