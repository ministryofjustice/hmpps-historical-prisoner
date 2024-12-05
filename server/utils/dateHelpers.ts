import logger from '../../logger'

export function formatDate(date: string): string {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat(['en-GB']).format(new Date(date))
  } catch (e) {
    logger.warn(`Invalid date found ${date}`, e)
    return date
  }
}
export function formatDateNoHyphens(date: string): string {
  if (!date) return ''
  if (date.length !== 8) {
    logger.warn(`Invalid date found ${date}, wrong length ${date.length}, should be 8`)
    return date
  }
  return date.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1')
}

export function getAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const diffMs = Date.now() - dob.getTime()
  const ageDt = new Date(diffMs)

  return Math.abs(ageDt.getUTCFullYear() - 1970)
}
