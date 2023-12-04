import axios from 'axios'

export const actionErrorHandler = (err: unknown) => {
  if (axios.isAxiosError(err) && err.response) {
    return { data: err.response.data, status: err.response.status }
  } else if (err instanceof Error) {
    return { data: { errMsg: err.message }, status: null }
  } else {
    return { data: { errMsg: 'Something went wrong.' }, status: null }
  }
}