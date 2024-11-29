const rawAcronyms: string[] = [
  'ARD',
  'ARP',
  'CRC',
  'CJA',
  'CS',
  'DTO',
  'EPP',
  'GOAD',
  'HDC',
  'HDCED',
  'HMP',
  'HMYOI',
  'IPP',
  'NFA',
  'NPS',
  'OMU',
  'PO',
  'PS',
  'SPO',
  'YMCA',
  'YO',
  'YOI',
  'YP',
]

const acronyms = rawAcronyms.map(ac => {
  const pattern = `\\b(${ac})\\b`
  return {
    raw: ac,
    regEx: new RegExp(pattern, 'gi'),
  }
})

export default function acronymsToUpperCase(text: string): string {
  return acronyms.reduce((returnText, acronym) => {
    return returnText.replace(acronym.regEx, acronym.raw)
  }, text)
}
