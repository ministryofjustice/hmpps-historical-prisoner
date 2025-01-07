import { PrisonerSearchForm } from 'express-session'

export interface Suggestion {
  type: string
  val: string
  query: string
}

export default function getSearchSuggestions(form: PrisonerSearchForm) {
  if (form.searchType !== 'name') return []

  const suggestions: Suggestion[] = []
  if (form.firstName) {
    if (form.firstName.length > 1) {
      suggestions.push({
        type: 'useInitial',
        val: form.firstName[0],
        query: `firstName=${form.firstName[0]}`,
      })
      if (!(form.firstName.endsWith('%') || form.firstName.endsWith('*'))) {
        suggestions.push({
          type: 'addForenameWildcard',
          val: `${form.firstName}*`,
          query: `firstName=${form.firstName}*`,
        })
      }
    }
  }
  if (form.lastName && !(form.lastName.endsWith('%') || form.lastName.endsWith('*'))) {
    suggestions.push({
      type: 'addSurnameWildcard',
      val: `${form.lastName}*`,
      query: `lastName=${form.lastName}*`,
    })
    if (form.lastName.length > 2) {
      suggestions.push({
        type: 'addShorterWildcard',
        val: `${form.lastName.substring(0, form.lastName.length - 2)}*`,
        query: `lastName=${form.lastName.substring(0, form.lastName.length - 2)}*`,
      })
    }
  }
  if (form.firstName || form.lastName) {
    suggestions.push({
      type: 'swap',
      val: `${form.lastName || ''} ${form.firstName || ''}`,
      query: `firstName=${form.lastName || ''}&lastName=${form.firstName || ''}`,
    })
  }
  if (form.age && !form.age.includes('-')) {
    const start = Number.parseInt(form.age, 10) - 2
    const end = start + 4
    suggestions.push({
      type: 'widenAgeRange',
      val: `${start}-${end}`,
      query: `age=${start}-${end}`,
    })
  }
  if (form.dobYear) {
    const currentYear = new Date().getFullYear()
    const start = currentYear - Number.parseInt(form.dobYear, 10) - 2
    const end = start + 4
    suggestions.push({
      type: 'convertToAgeRange',
      val: `${start}-${end}`,
      query: `age=${start}-${end}`,
    })
  }
  return suggestions
}
