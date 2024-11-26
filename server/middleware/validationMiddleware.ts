import HmppsError from '../interfaces/HmppsError'

export type fieldErrors = {
  [field: string | number | symbol]: string[] | undefined
}

export const buildErrorSummaryList = (array: fieldErrors) => {
  if (!array) return null

  return Object.entries(array).flatMap(([field, error]) =>
    (error as string[]).map(message => ({
      text: message,
      href: `#${field}`,
    })),
  )
}

export const findError = (errors: HmppsError[], fieldName: string) => {
  const item = errors?.find(error => error.href === `#${fieldName}`)
  if (item) {
    return {
      text: item.text,
    }
  }
  return null
}
