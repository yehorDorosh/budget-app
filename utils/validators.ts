export type ValidationFunction = (value: string | number, matchValue?: string | number) => boolean

export const emailValidator: ValidationFunction = (value) => {
  const isValid = String(value)
    .trim()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  return !!isValid
}

export const passwordValidator: ValidationFunction = (value) => {
  const isValid = String(value)
    .trim()
    .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  return !!isValid
}

export const notEmptyValidator: ValidationFunction = (value) => {
  const isValid = String(value).trim().length > 0
  return isValid
}

export const isCheckedValidator = (value: string) => {
  const booleanValue = /true|false/.test(value)
  if (booleanValue) {
    return value === 'true' ? true : false
  }
  return false
}

export const shouldMatchValidator: ValidationFunction = (value, matchValue) => {
  if (matchValue === undefined) {
    throw new Error('client/src/utils/validators.ts: shouldMatchValidator requires a matchValue')
  }
  const isValid = String(value).trim() === String(matchValue).trim() && String(value).trim().length > 0
  return isValid
}
