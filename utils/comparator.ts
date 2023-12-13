export const arraysAreEqual = (array1: any[] | undefined, array2: any[] | undefined) => {
  if (!array1 || !array2) return array1 === array2

  if (array1.length !== array2.length) {
    return false
  }

  for (let i = 0; i < array1.length; i++) {
    if (Array.isArray(array1[i]) && Array.isArray(array2[i])) {
      if (!arraysAreEqual(array1[i], array2[i])) {
        return false
      }
    } else if (typeof array1[i] === 'object' && typeof array2[i] === 'object') {
      if (!objectAreEqual(array1[i], array2[i])) {
        return false
      }
    } else if (array1[i] !== array2[i]) {
      return false
    }
  }

  return true
}

export const objectAreEqual = <T extends { [key: string]: any }>(obj1: T, obj2: T) => {
  if (!obj1 || !obj2) return obj1 === obj2

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      if (!arraysAreEqual(obj1[key], obj2[key])) {
        return false
      }
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!objectAreEqual(obj1[key], obj2[key])) {
        return false
      }
    } else {
      if (obj1[key] !== obj2[key]) return false
    }
  }

  return true
}
