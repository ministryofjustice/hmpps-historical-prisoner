import logger from '../../logger'

export default function formatDate(date: string): string {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat(['en-GB']).format(new Date(date))
  } catch (e) {
    logger.warn(`Invalid date found ${date}`, e)
    return date
  }
}
