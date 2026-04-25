export interface MemoryStore<T extends object, Key extends keyof T> {
  list: () => T[]
  findById: (id: T[Key]) => T | undefined
  insert: (record: T) => T
  updateById: (id: T[Key], patch: Partial<T>) => T | undefined
  removeById: (id: T[Key]) => boolean
}

export function createMemoryStore<T extends object, Key extends keyof T>(
  seed: T[],
  idKey: Key,
): MemoryStore<T, Key> {
  const state = [...seed]

  function findIndexById(id: T[Key]) {
    return state.findIndex(item => item[idKey] === id)
  }

  return {
    list: () => state,
    findById: (id) => {
      const index = findIndexById(id)
      return index >= 0 ? state[index] : undefined
    },
    insert: (record) => {
      state.push(record)
      return record
    },
    updateById: (id, patch) => {
      const index = findIndexById(id)
      if (index < 0) {
        return undefined
      }

      const target = state[index]!
      Object.assign(target, patch)
      return target
    },
    removeById: (id) => {
      const index = findIndexById(id)
      if (index < 0) {
        return false
      }

      state.splice(index, 1)
      return true
    },
  }
}
