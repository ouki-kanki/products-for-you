import { useSelector } from 'react-redux';
import { getUserId } from '../../auth/authSlice';
import { useGetUserQuery } from '../usersApiSlice';

import styles from './userProfile.module.scss';
import { Input } from '../../../UI/Forms/Inputs';



export const UserProfile = () => {
  const userId = useSelector(getUserId)
  const userIdstr = userId ? userId.toString() : ''

  const { data, isError, error, isLoading } = useGetUserQuery(userIdstr)

  if (isLoading) {
    // use a spinner or skeleton
    return (
      <div>is loading...</div>
    )
  }

  // TODO: type the error
  if (isError) {
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
