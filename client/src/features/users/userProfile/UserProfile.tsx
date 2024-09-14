import { useGetProfileQuery } from '../../../api/userApi'
import styles from './userProfile.module.scss';
import { Input } from '../../../UI/Forms/Inputs';


export const UserProfile = () => {
  // TODO : check how to handle the error
  const { data, isError, isLoading } = useGetProfileQuery('1')

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
