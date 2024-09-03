import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'


interface returnParams<T> {
  page: number;
  pageSize: number;
  prepareLink: (queryStringObj: T) => string;
  handleNavigate: (page: number, queryStringObj: any) => void
}


const _prepareLink = (path: string) => (page: number, page_size: number, queryStringObj): string => {
  let queryStr = ''

  // add all the custom querystrings if there are any
  for (const [key, value] of Object.entries(queryStringObj)) {
    !queryStr ? queryStr += `?${key}=${value}` : queryStr += `&${key}=${value}`
  }

  queryStr += !queryStr ? '?' : '&'
  queryStr += `page=${page}&page_size=${page_size}` // TODO: only if page or pagesize exist

  return path + queryStr
}

// *** -- Main -- ***
/**
 * provides the component with page and page_size values,
 * fn prepareLink which can be used to Navlink & Links inside the 'to' property
 * fn nahdleNavigate
 * @param queryStringObj objects with all custom querystring params
 * @returns object
 */
export const usePagination = <T>(queryStringObj: T) => {
  const navigate = useNavigate()
  const [ searchParams ] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const page_size = parseInt(searchParams.get('page_size') || '10')
  const { pathname } = useLocation()

  const preparedLinkWithPath = _prepareLink(pathname)

  /**
   *
   * @param page
   */
  const handleNavigate = (page: number): void => {
    const path = preparedLinkWithPath(page, page_size, queryStringObj)
    navigate(path)
  }

  return {
    // Note: preparelink is returned to be used in Navlinks
    prepareLink: preparedLinkWithPath,
    handleNavigate,
    page,
    page_size
  }

}
