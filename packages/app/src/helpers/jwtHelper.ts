import { Buffer } from 'buffer'

export const jwtDecrypt = (token: string): string => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(base64, 'base64').toString('binary')
}

export const tokenAlive = (tokenExpirationTime: string): boolean => {
  const today = new Date()

  const year = tokenExpirationTime.substring(0, 4)
  const month = tokenExpirationTime.substring(5, 7)
  const day = tokenExpirationTime.substring(8, 10)

  const tokenExpirationTimeDate = new Date(+year, +month - 1, +day)

  console.log(today)
  console.log(tokenExpirationTimeDate)
  console.log(today < tokenExpirationTimeDate)
  // console.log(today < tokenExpirationTimeDate.getTime())

  if (today > tokenExpirationTimeDate) return false

  return true
}
