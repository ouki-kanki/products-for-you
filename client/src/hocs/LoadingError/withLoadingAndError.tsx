interface IWithLoadingAndError {
  isLoading: boolean;
  isError: boolean;
  error?: string;
  [key: string]: unknown;
}

export const withLoadingAndError = (WrappedComponent: React.ComponentType) => {
  return ({ isLoading, isError, error, ...rest }: IWithLoadingAndError) => {
    if (isLoading) {
      return (
        <div>IsLoading</div>
      )
    }

    if (isError) {
      return (
        <div>{error} ? {error} : Something went wrong</div>
      )
    }

    return <WrappedComponent { ...rest }/>
  }
}
