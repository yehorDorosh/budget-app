import { ResCodes } from '../enums'

export interface ValidationError {
  location: string
  msg: string
  path: string
  type: string
  value: string
}

export interface ApiRes<T> {
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
