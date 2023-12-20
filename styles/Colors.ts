export enum ColorsCodes {
  primary = '#0d6efd',
  white = '#fff',
  black = '#000',
  red = '#dc3545',
  lightGrey = '#ced4da',
  grey = '#6c757d',
  lightOrange = '#f8d7da',
  lightRed = '#f5c2c7',
  lightGreen = '#d4edda'
}

const Colors = {
  error: ColorsCodes.red,
  danger: ColorsCodes.red,
  card: {
    bg: ColorsCodes.white,
    border: ColorsCodes.grey
  },
  btn: {
    bg: ColorsCodes.primary,
    text: ColorsCodes.white,
    activeBg: '#0b5ed7',
    activeText: ColorsCodes.white,
    activeBorder: ColorsCodes.primary
  },
  input: {
    border: ColorsCodes.grey,
    bg: ColorsCodes.lightGrey
  },
  ico: ColorsCodes.primary,
  font: ColorsCodes.black,
  budgetCard: {
    expense: ColorsCodes.lightOrange,
    income: ColorsCodes.lightGreen,
    ignored: ColorsCodes.lightGrey
  }
}

export default Colors
