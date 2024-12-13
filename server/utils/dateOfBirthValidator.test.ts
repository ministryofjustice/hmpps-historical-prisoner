import validateTargetDate from './dateOfBirthValidator'

describe('dateOfBirthValidator', () => {
  Array.of(
    { day: '26', month: '4', year: '24' },
    { day: '26', month: '40', year: '2024' },
    { day: '', month: '02', year: '2040' },
    { day: '26', month: '', year: '2040' },
    { day: '26', month: '02', year: '' },
    { day: '][', month: '8', year: '2025' },
    { day: '2nd', month: '8', year: '2025' },
    { day: '2', month: 'AUG', year: '2025' },
    { day: 'X', month: 'X11', year: 'MMXXV' },
  ).forEach(dateValues => {
    it(`should validate given an invalid date - day: ${dateValues.day}, month: ${dateValues.month}, year: ${dateValues.year}`, () => {
      // Given

      // When
      const errors = validateTargetDate(dateValues.day, dateValues.month, dateValues.year)

      // Then
      expect(errors).toStrictEqual('Enter a valid date of birth in the format DD/MM/YYYY')
    })
  })

  it('should ignore empty strings for all fields', () => {
    Array.of({ day: undefined, month: undefined, year: undefined }, { day: '', month: '', year: '' }).forEach(
      dateValues => {
        // Given

        // When
        const errors = validateTargetDate(dateValues.day, dateValues.month, dateValues.year)

        // Then
        expect(errors).toStrictEqual(null)
      },
    )
  })

  it('should validate given a date in the future', () => {
    // Given
    const day = '26'
    const month = '02'
    const year = '3007'
    // When
    const errors = validateTargetDate(day, month, year)

    // Then
    expect(errors).toStrictEqual('The date of birth cannot be in the future')
  })
})
