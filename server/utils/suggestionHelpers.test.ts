import { PrisonerSearchForm } from 'express-session'
import getSearchSuggestions from './suggestionHelpers'

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
    const userInput = { searchType: 'name', prisonNumber: 'AB123456' } as PrisonerSearchForm

    expect(getSearchSuggestions(userInput)).toEqual([])
  })

  it('should suggest nothing when not name search type', () => {
    const userInput = { searchType: 'identifier', firstName: 'Joe' } as PrisonerSearchForm

    expect(getSearchSuggestions(userInput)).toEqual([])
  })

  describe('forename suggestions', () => {
    it('should not suggest initial if already using initial', () => {
      const userInput = { searchType: 'name', firstName: 'f' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual([{ type: 'swap', val: ' f', query: 'firstName=&lastName=f' }])
    })

    it('should suggest changing forename to initial and adding wildcard', () => {
      const userInput = { searchType: 'name', firstName: 'first' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual(
        expect.arrayContaining([
          { type: 'useInitial', val: 'f', query: 'firstName=f' },
          { type: 'addForenameWildcard', val: 'first*', query: 'firstName=first*' },
        ]),
      )
    })

    it('should not suggest adding wildcard if already using wildcard *', () => {
      const userInput = { searchType: 'name', firstName: 'first*' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput).map(suggestion => suggestion.type)).not.toContain('addForenameWildcard')
    })

    it('should not suggest adding wildcard if already using wildcard %', () => {
      const userInput = { searchType: 'name', firstName: 'first%' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput).map(suggestion => suggestion.type)).not.toContain('addForenameWildcard')
    })
  })
  describe('surname suggestions', () => {
    it('should suggest adding wildcard and shorter wildcard to surname', () => {
      const userInput = { searchType: 'name', lastName: 'last' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual(
        expect.arrayContaining([
          { type: 'addSurnameWildcard', val: 'last*', query: 'lastName=last*' },
          { type: 'addShorterWildcard', val: 'la*', query: 'lastName=la*' },
        ]),
      )
    })

    it('should not suggest adding wildcard to surname if already ends with *', () => {
      const userInput = { searchType: 'name', lastName: 'last*' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual([
        { type: 'swap', val: 'last* ', query: 'firstName=last*&lastName=' },
      ])
    })

    it('should not suggest adding wildcard to surname if already ends with %', () => {
      const userInput = { searchType: 'name', lastName: 'last%' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput).map(suggestion => suggestion.type)).not.toContain('addSurnameWildcard')
    })
  })

  describe('forename and surname swap suggestions', () => {
    it('should suggest swapping forename and surname', () => {
      const userInput = { searchType: 'name', firstName: 'first*', lastName: 'last*' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual(
        expect.arrayContaining([{ type: 'swap', val: 'last* first*', query: 'firstName=last*&lastName=first*' }]),
      )
    })
  })

  describe('age suggestions', () => {
    it('should suggest using age range instead of date of birth', () => {
      const userInput = { searchType: 'name', dobYear: '2000' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual(
        expect.arrayContaining([{ type: 'convertToAgeRange', val: '21-25', query: 'age=21-25' }]),
      )
    })

    it('should suggest using age range instead of single age', () => {
      const userInput = { searchType: 'name', age: '23' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual(
        expect.arrayContaining([{ type: 'widenAgeRange', val: '21-25', query: 'age=21-25' }]),
      )
    })

    it('should suggest nothing if using age range already', () => {
      const userInput = { searchType: 'name', age: '21-25' } as PrisonerSearchForm
      expect(getSearchSuggestions(userInput)).toEqual([])
    })
  })

  describe('multiple suggestions', () => {
    it('should suggest multiple changes', () => {
      const userInput = { searchType: 'name', firstName: 'first', lastName: 'last', age: '23' } as PrisonerSearchForm
      const expected = [
        { type: 'useInitial', val: 'f', query: 'firstName=f' },
        { type: 'addForenameWildcard', val: 'first*', query: 'firstName=first*' },
        { type: 'addSurnameWildcard', val: 'last*', query: 'lastName=last*' },
        { type: 'addShorterWildcard', val: 'la*', query: 'lastName=la*' },
        { type: 'swap', val: 'last first', query: 'firstName=last&lastName=first' },
        { type: 'widenAgeRange', val: '21-25', query: 'age=21-25' },
      ]
      expect(getSearchSuggestions(userInput)).toEqual(expected)
    })
  })
})
