import { isAlphabetic } from './searchValidator'

describe('isString', () => {
  it('should return true for a valid string with only letters', () => {
    expect(isAlphabetic('John')).toBe(true)
  })

  it('should return true for a valid string with letters and apostrophes', () => {
    expect(isAlphabetic("O'Connor")).toBe(true)
  })

  it('should return false for a string with numbers', () => {
    expect(isAlphabetic('John123')).toBe(false)
  })

  it('should return false for a string with special characters', () => {
    expect(isAlphabetic('John@Doe')).toBe(false)
  })

  it('should return false for a string with spaces', () => {
    expect(isAlphabetic('John Doe')).toBe(false)
  })

  it('should return true for an empty string', () => {
    expect(isAlphabetic('')).toBe(true)
  })
})
