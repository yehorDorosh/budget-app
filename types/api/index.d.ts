import { ResCodes } from '../enums'
import { BudgetItem } from '../../store/budget/budget-item-slice.tsx'
import { Category } from '../../store/categories/category-slice.tsx'

export interface ValidationError {
  location: string
  msg: string
  path: string
  type: string
  value: string
}

export interface CategoryRate {
  name: string
  sum: number
}

export interface ApiRes<T = void> {
  message: string
  code: ResCodes
  payload?: T
  validationErrors?: ValidationError[]
  error?: {
    details: string
    cause: string
  }
}

export interface LoginPayload {
  user: {
    id: string
    email: string
    token: string
  }
}

export interface BudgetItemsPayload {
  budgetItems: BudgetItem[]
  total: number
}

export interface BudgetItemPayload {
  budgetItem: BudgetItem
}

export interface CategoriesPayload {
  categories: Category[]
}

export interface StatisticsPayload {
  sum: string | null
  expenses: string | null
  incomes: string | null
  categoriesRates: CategoryRate[]
}
