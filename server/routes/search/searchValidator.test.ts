import { isAlphabeticOrWildcard } from './searchValidator'

describe('isAlphabeticOrWildcard', () => {
  it('should return true for a valid string with only letters', () => {
    expect(isAlphabeticOrWildcard('John')).toBe(true)
  })

  it('should return true for a valid string with letters and apostrophes', () => {
    expect(isAlphabeticOrWildcard("O'Connor")).toBe(true)
  })
  it('should return true for a valid string with a hyphen', () => {
    expect(isAlphabeticOrWildcard('smith-jones')).toBe(true)
  })

  it('should return false for a string with numbers', () => {
    expect(isAlphabeticOrWildcard('John123')).toBe(false)
  })

  it('should return false for a string with special characters', () => {
    expect(isAlphabeticOrWildcard('John@Doe')).toBe(false)
  })

  it('should return false for a string with spaces', () => {
    expect(isAlphabeticOrWildcard('John Doe')).toBe(false)
  })

  it('should return true for an empty string', () => {
    expect(isAlphabeticOrWildcard('')).toBe(true)
  })

  it('should return true for a string with * wildcard', () => {
    expect(isAlphabeticOrWildcard('sd*wew')).toBe(true)
  })

  it('should return true for a string with % wildcard', () => {
    expect(isAlphabeticOrWildcard('sd%wew')).toBe(true)
  })
})
