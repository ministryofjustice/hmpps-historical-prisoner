import formatDate from './dateHelpers'

describe('formatDate', () => {
  it.each([
    ['Empty string', '', ''],
    ['Null string', null, ''],
    ['Valid date string', '2023-10-15', '15/10/2023'],
    ['Valid date string with time', '2023-10-15T14:48:00.000Z', '15/10/2023'],
    ['Invalid date string', 'invalid-date', 'invalid-date'],
    ['Date with different format', '15-10-2023', '15-10-2023'],
    ['Date with slashes', '15/10/2023', '15/10/2023'],
  ])('%s formatDate(%s, %s)', (_: string, date: string, expected: string) => {
    expect(formatDate(date)).toEqual(expected)
  })
})
