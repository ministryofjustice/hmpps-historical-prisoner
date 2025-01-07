import { PrisonerSearchForm } from 'express-session'
import getSearchSuggestions, { SuggestionFields } from './suggestionHelpers'

const noSuggestions: SuggestionFields = { firstName: [], lastName: [], age: [] }

describe('getSearchSuggestion', () => {
  const mockCurrentDate = new Date('2023-10-15')
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockCurrentDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should suggest nothing when no suggestible inputs', () => {
    const userInput = { prisonNumber: 'AB123456' } as PrisonerSearchForm

    expect(getSearchSuggestions(userInput)).toEqual(noSuggestions)
  })

  it('should suggest changing forename to initial', () => {
    const userInput = { firstName: 'first' } as PrisonerSearchForm
    const expected = {
      ...noSuggestions,
      firstName: [
        { type: 'useInitial', term: 'forename', val: 'f' },
        { type: 'addShorterWildcard', term: 'forename', val: 'fir%' },
        { type: 'swap', term: 'forename', val: '' },
      ],
      lastName: [{ type: 'swap', term: 'surname', val: 'first' }],
    }

    expect(getSearchSuggestions(userInput)).toEqual(expected)
  })

  it('should suggest adding wildcard and shorter wildcard to surname', () => {
    const userInput = { lastName: 'last' } as PrisonerSearchForm
    const expected = {
      ...noSuggestions,
      firstName: [{ type: 'swap', term: 'forename', val: 'last' }],
      lastName: [
        { type: 'addWildcard', term: 'surname', val: 'last%' },
        { type: 'addShorterWildcard', term: 'surname', val: 'la%' },
        { type: 'swap', term: 'surname', val: '' },
      ],
    }

    expect(getSearchSuggestions(userInput)).toEqual(expected)
  })

  it('should suggest using age range instead of date of birth', () => {
    const userInput = { dobYear: '2000' } as PrisonerSearchForm
    const expected = {
      ...noSuggestions,
      age: [{ type: 'convertToAgeRange', term: 'age', val: '21-25' }],
    }

    expect(getSearchSuggestions(userInput)).toEqual(expected)
  })

  it('should suggest using age range instead of single age', () => {
    const userInput = { age: '23' } as PrisonerSearchForm
    const expected = {
      ...noSuggestions,
      age: [{ type: 'widenAgeRange', term: 'age', val: '21-25' }],
    }

    expect(getSearchSuggestions(userInput)).toEqual(expected)
  })

  it('should suggest nothing if using age range already', () => {
    const userInput = { age: '21-25' } as PrisonerSearchForm
    const expected = { ...noSuggestions }

    expect(getSearchSuggestions(userInput)).toEqual(expected)
  })
})
