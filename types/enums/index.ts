export enum ResCodes {
  ERROR,
  VALIDATION_ERROR,
  CREATE_USER,
  LOGIN,
  SEND_RESTORE_PASSWORD_EMAIL,
  RESET_PASSWORD,
  SEND_USER,
  UPDATE_USER,
  DELETE_USER,
  CREATE_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CREATE_BUDGET_ITEM,
  GET_BUDGET_ITEMS,
  UPDATE_BUDGET_ITEM,
  DELETE_BUDGET_ITEM,
  GENERAL_RESPONSE,
  GET_STATISTICS,
  GET_MONTHLY_TREND,
  GET_LIST_OF_MATCHES
}

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum QueryFilter {
  ALL,
  YEAR,
  MONTH
}

export enum Months {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11
}
