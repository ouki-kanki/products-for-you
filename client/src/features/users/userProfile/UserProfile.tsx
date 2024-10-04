import { useGetUserProfileQuery } from '../../../api/userApi';
import { userProfileFields } from './userProfileFields';

import styles from './userProfile.module.scss';
import { Input } from '../../../UI/Forms/Inputs';

type Error = {
  status: number;
  data: {
    message: string
  }
}

export const UserProfile = () => {
  const { data, isError, error, isLoading } = useGetUserProfileQuery()
  const myError = error as Error // TODO: find a better way to type this

  if (isLoading) {
    // use a spinner or skeleton
    return (
      <div>is loading...</div>
    )
  }

  // TODO: type the error
  if (isError) {
    // show a form to fill user details
    if (myError.status === 404) {
      return (
        <form>
          <h1>New User Profile</h1>
          {userProfileFields.map(field => (
            <div
              key={field.id}
              className={styles.inputContainer}>
              <label htmlFor={field.name}>{field.label}</label>
              <Input
                id={field.id}
                name={field.name}
                type={field.type} />
            </div>
          ))}
        </form>
      )
    }


    return (
      <>
        <h2>Something went wrong</h2>
        <div>{error.originalStatus}</div>
      </>
    )
  }

  return (
    <div className={styles.profileContainer}>
      <h1>User Profile</h1>
      <div className={styles.mainContainer}>
        <div className={styles.left}>
          {data && Object.entries(data)
            .filter(([key]) => key !== 'image')
            .map(([property, value], id) => (
            <div className={styles.inputContainer} key={id}>
              <label htmlFor={property}>{property}</label>
              <Input
                name={property}
                type='text'
                value={value}
                onChange={() => {}}
              />
            </div>
          ))}
        </div>
        <div className={styles.right}>
          {data?.image && (
            <img src={data.image} alt='profile image'/>
          )}
        </div>
      </div>
    </div>
  )
}
