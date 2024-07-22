import { expect, test } from 'vitest'
import { settingsFromExamples, expandRange } from './utils'

test('expandRange plain', () => {
  expect(expandRange('abc')).toBe('abc');
});

test('expandRange range', () => {
  expect(expandRange('0-9')).toBe('0123456789');
});

test('expandRange multiple ranges', () => {
  expect(expandRange('a-zA-N')).toBe('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN');
});

test('expandRange combination', () => {
  expect(expandRange('abc1-4')).toBe('abc1234');
});

test('settingsFromExamples finds max length', () => {
  expect(settingsFromExamples(`
a
aaa
aa
`)).toEqual({ length: 3, charset: 'a' });
});

test('settingsFromExamples extracts full charset', () => {
  expect(settingsFromExamples(`
8372
1014
5699
`)).toEqual({ length: 4, charset: '0-9' });
});

test('settingsFromExamples guesses missing 0-9', () => {
  expect(settingsFromExamples(`
309986
978140
481148
`)).toEqual({ length: 6, charset: '0-9' });
});

test('settingsFromExamples guesses missing A-Za-z', () => {
  expect(settingsFromExamples(`
brczUIOivVYyVrOl
uTAFlgkNzyEzqIyR
xxPrkgPVcZhlQTQH
`)).toEqual({ length: 16, charset: 'A-Za-z' });
});

test('settingsFromExamples guesses missing 0-9A-Za-z', () => {
  expect(settingsFromExamples(`
6fzUpMz0PXhjy58aaI3a
feBYNCZUxNZ9BRTPqcTd
nSa6dUYuIwVQeKAFnKWg
`)).toEqual({ length: 20, charset: '0-9A-Za-z' });
});

test('settingsFromExamples guesses missing 0-9a-f', () => {
  expect(settingsFromExamples(`
799cd012
9228087f
fb5cb99d
`)).toEqual({ length: 8, charset: '0-9a-f' });
});

test('settingsFromExamples keeps digits intact', () => {
  expect(settingsFromExamples(`
023
233
320
`)).toEqual({ length: 3, charset: '023' });
});

test('settingsFromExamples keeps letters intact', () => {
  expect(settingsFromExamples(`
acbb
bcaa
accd
`)).toEqual({ length: 4, charset: 'abcd' });
});

test('settingsFromExamples keeps sequences intact', () => {
  expect(settingsFromExamples(`
12345678
87654321
`)).toEqual({ length: 8, charset: '12345678' });
});
