import { Spinner } from "../../components/Spinner/Spinner";

interface IWithLoadingAndError {
  isLoading: boolean;
  isError: boolean;
  error?: string;
  [key: string]: unknown;
}

// TODO in some case the error is an object with status and message.
// have to refactor
export const withLoadingAndError = (WrappedComponent: React.ComponentType) => {
  return ({ isLoading, isError, error, ...rest }: IWithLoadingAndError) => {
    if (isLoading) {
      return (
        <Spinner/>
      )
    }

    if (isError) {
      console.log("the error", error)
      if (typeof error !== 'string') {
        return (
          <div>something went wrong</div>
        )
      }


      return (
        <div>{error} ? {error} : Something went wrong</div>
      )
    }

    return <WrappedComponent { ...rest }/>
  }
}
