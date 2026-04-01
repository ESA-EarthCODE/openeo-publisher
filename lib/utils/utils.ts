
export const normalizeIdentifier = (value: string): string =>
  value.replace(/[ _]/g, "-");