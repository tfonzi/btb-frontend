
const writeToCache = (url, data) =>
  localStorage.setItem(url, JSON.stringify(data))

const readFromCache = url => JSON.parse(localStorage.getItem(url)) || null

const deleteCache = (url) =>
  localStorage.removeItem(url) || null
  
export { readFromCache, writeToCache, deleteCache }