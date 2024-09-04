import { useState } from 'react'


export const useSort = (initValue: string) => {
  const [sortValue, setSortValue] = useState(initValue)

  return {
    sortValue,
    setSortValue,
  }
}
