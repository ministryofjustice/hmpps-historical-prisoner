import { acronymsToUpperCase, spaceHyphens } from './textHelpers'

describe('acronymsToUpperCase', () => {
  it.each([
    ['Empty string', '', ''],
    ['No acronyms', 'This is a test sentence.', 'This is a test sentence.'],
    ['Single acronym', 'This is an ARD test.', 'This is an ARD test.'],
    ['Multiple acronyms', 'ARD and HMP are acronyms.', 'ARD and HMP are acronyms.'],
    ['Mixed case acronyms', 'Ard and hmp are acronyms.', 'ARD and HMP are acronyms.'],
    ['Acronyms with punctuation', 'This is an ARD, HMP test.', 'This is an ARD, HMP test.'],
    ['Acronyms at the start', 'ARD is an acronym.', 'ARD is an acronym.'],
    ['Acronyms at the end', 'This is an acronym ARD', 'This is an acronym ARD'],
    ['Acronyms in the middle', 'This ARD is an acronym.', 'This ARD is an acronym.'],
  ])('%s acronymsToUpperCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(acronymsToUpperCase(a)).toEqual(expected)
  })
})

describe('spaceHyphens', () => {
  it.each([
    ['Empty string', '', ''],
    ['No hyphens', 'This is a test sentence.', 'This is a test sentence.'],
    ['Single hyphen', 'This-is-a-test.', 'This - is - a - test.'],
  ])('%s spaceHyphens(%s, %s)', (_: string, a: string, expected: string) => {
    expect(spaceHyphens(a)).toEqual(expected)
  })
})
