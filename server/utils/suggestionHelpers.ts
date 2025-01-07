import { PrisonerSearchForm } from 'express-session'

export interface Suggestion {
  type: string
  term: string
  val: string
}

export interface SuggestionFields {
  firstName: Suggestion[]
  lastName: Suggestion[]
  age: Suggestion[]
}

export default function getSearchSuggestions(form: PrisonerSearchForm) {
  const suggestions: SuggestionFields = { firstName: [], lastName: [], age: [] }
  if (form.firstName) {
    if (form.firstName.length > 1) {
      suggestions.firstName.push({
        type: 'useInitial',
        term: 'forename',
        val: form.firstName[0],
      })
    }
    if (form.firstName.length > 2) {
      suggestions.firstName.push({
        type: 'addShorterWildcard',
        term: 'forename',
        val: `${form.firstName.substring(0, form.firstName.length - 2)}%`,
      })
    }
  }
  if (form.lastName) {
    suggestions.lastName.push({
      type: 'addWildcard',
      term: 'surname',
      val: `${form.lastName}%`,
    })
    if (form.lastName.length > 2) {
      suggestions.lastName.push({
        type: 'addShorterWildcard',
        term: 'surname',
        val: `${form.lastName.substring(0, form.lastName.length - 2)}%`,
      })
    }
  }
  if (form.firstName || form.lastName) {
    suggestions.firstName.push({
      type: 'swap',
      term: 'forename',
      val: form.lastName || '',
    })
    suggestions.lastName.push({
      type: 'swap',
      term: 'surname',
      val: form.firstName || '',
    })
  }
  if (form.age && !form.age.includes('-')) {
    const start = Number.parseInt(form.age, 10) - 2
    const end = start + 4
    suggestions.age.push({
      type: 'widenAgeRange',
      term: 'age',
      val: `${start}-${end}`,
    })
  }
  if (form.dobYear) {
    const currentYear = new Date().getFullYear()
    const start = currentYear - Number.parseInt(form.dobYear, 10) - 2
    const end = start + 4
    suggestions.age.push({
      type: 'convertToAgeRange',
      term: 'age',
      val: `${start}-${end}`,
    })
  }
  return suggestions
}
