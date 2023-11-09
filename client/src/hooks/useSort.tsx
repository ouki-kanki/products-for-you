import { useState, useEffect, useCallback } from 'react'


interface IUseSortProps<T> {
  defaultSortValue: keyof T,
  fetchData: (sortBy: keyof T) => Promise<T[]>
}

interface IReturnData<T> {
  data: Array<T>,
  sortBy: keyof T,
  error: Error | null,
  handleSortChange: (value: keyof T) => void
}

const useSort = <T,>({defaultSortValue, fetchData}: IUseSortProps<T>): IReturnData<T> => {
  const [sortBy, setSortBy] = useState(defaultSortValue)
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<Error | null>(null)

  const handleSortChange = (value: keyof T) => {
    setSortBy(value)
  }

  const handleFetchData = useCallback(async () => {
    try {
      const res = await fetchData(sortBy)
      setData(res)
      setError(null) 
    } catch(error) {
      if (error instanceof Error) {
        setError(error)
      }
    }
  }, [])

  useEffect(() => {
    handleFetchData()
  }, [handleFetchData])

  return {
    data,
    sortBy,
    error,
    handleSortChange
  }
}

