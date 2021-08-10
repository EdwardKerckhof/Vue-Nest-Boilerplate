import { Buffer } from 'buffer'

export const jwtDecrypt = (token: string): string => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(base64, 'base64').toString('binary')
}
