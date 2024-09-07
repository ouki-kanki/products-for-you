import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'


export const useSort = (initValue: string) => {
  const [sortValue, setSortValue] = useState(initValue)
  const [searchParams,  setSearchParams] = useSearchParams()

  // const sortValue = searchParams.get('sort_by')


  // get all the list of querystrings
  const paramsObj = {}
  for (let [key, value] of searchParams.entries()) {
    // TODO: fix the types
    paramsObj[key] = value
  }

  // if there is short_by replace it if not create it
  paramsObj['sort_by'] = sortValue
  const obj_of_dep = JSON.stringify(paramsObj)

  useEffect(() => {
    const obj = JSON.parse(obj_of_dep)
    setSearchParams(obj)
    // TODO: check if setSearchParams is memoized
  }, [obj_of_dep, setSearchParams])


  return {
    sortValue,
    setSortValue,
  }
}
