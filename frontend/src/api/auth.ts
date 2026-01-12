import { api } from './axios'

export interface LoginRequest {
  email: string
  password: string
}

export async function login(data: LoginRequest) {
  const res = await api.post('/auth/login', data)
  return res.data
}
