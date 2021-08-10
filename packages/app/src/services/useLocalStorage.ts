export const setLocal = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const getLocal = (key: string) => {
  return localStorage.getItem(key)
}

export const clearLocal = () => {
  localStorage.clear()
}
