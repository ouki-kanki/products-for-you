import { useEffect, useReducer, useCallback, useState, ChangeEvent } from 'react'
import { useAppDispatch } from '../../app/store/store';
import { fieldsReducer } from '../../app/reducers';
import { Outlet, useNavigate, useLocation, Location } from 'react-router-dom'

import { useLazyGetUserProfileQuery, useGetUserProfileQuery } from '../../api/userApi';
import type { IUserProfile, IUserProfileBase } from '../../api/userApi';
import { ActionTypesProfile } from '../../app/actions';
import { useUpdateUserProfileMutation } from '../../api/userApi';
import { useUploadProfileImageMutation } from '../../api/userProfileApi';

import styles from './profile.module.scss'
import { Input } from '../../UI/Forms/Inputs';
import { convertSnakeToCamelV2, convertCamelToSnake } from '../../utils/converters';
import { haveSameValue } from '../../utils/objUtils';
import { showNotification } from '../../components/Notifications/showNotification';

import { ProfileImage } from './ProfileImage/ProfileImage';
import { ApiError, ValidationError } from '../../types';

import { userApi } from '../../api/userApi';

type Error = {
  status: number;
  data: {
    message: string
  }
}

type ProfileState = Omit<IUserProfileBase, 'image'>

const initialState: ProfileState = {
  firstName: '',
  lastName: '',
  addressOne: '',
  addressTwo: '',
  city: '',
  country: '',
  email: ''
}

export const Profile = () => {
  // const [trigger, { data: profileData, isError, error, isLoading, }] = useLazyGetUserProfileQuery()
  const { data: profileData, refetch, isError, error, isLoading } = useGetUserProfileQuery()

  const [updateUserProfile, {data: updateData, isSuccess: isUpdateSuccess, error: updateError, isError: isUpdateError, isLoading: udpateLoading}] = useUpdateUserProfileMutation()
  const [uploadProfileImage, { data: uploadImageData, isSuccess: isUploadImageSuccess, isError: isUploadImageError, error: uploadImageError }] = useUploadProfileImageMutation()

  const apiDispatch = useAppDispatch()
  const { usePrefetch } = userApi
  const { util: { resetApiState, upsertQueryData } } = userApi
  const prefetchUserProfile = usePrefetch('getUserProfile')


  const navigate = useNavigate()
  const [isInEdit, setIsInEdit] = useState(false)
  const location: Location = useLocation()
  const [state, dispatch] = useReducer(fieldsReducer, initialState)

  // let strProfileData = {};
  // if (profileData) {
    // strProfileData = JSON.stringify(profileData)
  // }
  useEffect(() => {
    // const data = JSON.parse(strProfileData)
    if (profileData) {
      dispatch({
        type: ActionTypesProfile.SET_PROFILE_DATA,
        payload: convertSnakeToCamelV2(profileData) as IUserProfile
      })
    }
  }, [profileData])

  // const fetchData = useCallback(async () => {
  //   const data = await trigger().unwrap()
  //   dispatch({
  //     type: ActionTypesProfile.SET_PROFILE_DATA,
  //     payload: convertSnakeToCamelV2(data) as IUserProfile
  //   })
  // }, [trigger])

  // UPLOAD IMAGE
  useEffect(() => {
    if (isUploadImageError) {
      console.log("the error from upload image", uploadImageError)
      const apiError = uploadImageError as ApiError
      const message = apiError.data.detail

      showNotification({
        message,
        type: 'danger'
      })
    }
    if (isUploadImageSuccess) {
      console.log("isndie the success")
      // prefetchUserProfile()

      apiDispatch(resetApiState())
      refetch()
      // fetchData()

      // apiDispatch(userApi.endpoints.getUserProfile.initiate(undefined, {
      //   // subscribe: false,
      //   forceRefetch: true
      // }))
    }
  }, [isUploadImageError, isUploadImageSuccess, uploadImageError, apiDispatch, resetApiState, refetch])


  const strLocation = JSON.stringify(location)
  useEffect(() => {
    const location = JSON.parse(strLocation)
    if (location.pathname === '/profile') {
      refetch()
    }
  }, [refetch, strLocation])

  // useEffect(() => {
  //   if (location.pathname === '/profile') {
  //     fetchData()
  //   }
  // }, [location, fetchData])

  // if there is a change in fields show saveChanges btn
  useEffect(() => {
    if (profileData) {
      const convertedData = convertSnakeToCamelV2(profileData)
      // useCallback on the function on objUtils
      if (!haveSameValue(convertedData, state as IUserProfile)) {
        setIsInEdit(true)
      } else {
        if (isInEdit) {
          setIsInEdit(false)
        }
      }
    }
  }, [isInEdit, profileData, state]) // TODO: stringify state and data

  useEffect(() => {
    if (isError && (error as Error).status === 404) {
      navigate('/profile/create')
    }
    // TODO: stringify error. (it does not seems to cause problem cause it's null and the it bacames an object?)
  }, [navigate, isError, error])

  const handleChange = ({ target: { value, name }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionTypesProfile.CHANGE,
      name,
      value
    })
  }

  useEffect(() => {
    if (isUpdateError) {
      const error = updateError as ValidationError
      console.log("the update error", error)
      // TODO: handle stack notification. have to show all error messages
      const message = error.data.non_field_errors[0]

      showNotification({
        message,
        type: 'danger'
      })
    }
    if (isUpdateSuccess) {
      // console.log("the udpated data", updateData)
      showNotification({
        message: 'profile updated successfully'
      })
    }
  }, [isUpdateSuccess, updateData, updateError, isUpdateError])

  if (isLoading) {
    // use a spinner or skeleton
    return (
      <div>is loading...</div>
    )
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    // filter unchanged fields
    const data = convertSnakeToCamelV2(profileData as IUserProfile)
    const profileState = state as IUserProfile
    // omit fields if they are not changed
    const filteredData = Object.keys(profileState as IUserProfile).reduce((ac, key) => {
      if(profileState[key] !== data[key]) {
        ac[key] = profileState[key]
      }
      return ac
    }, {} as Record<string, unknown>)

    const submitData = convertCamelToSnake({
      data: filteredData as Partial<IUserProfile>
    })
    updateUserProfile(submitData as Partial<IUserProfile>)
  }
  // console.log("the data", profileData)
  if (!profileData) {
    return (
      <Outlet/>
    )
  }

  return (
    <div className={styles.profileContainer}>
      <h1>User Profile</h1>
      <div className={styles.mainContainer}>
        <form className={styles.left}>
          {/* {data && Object.entries(convertSnakeToCamelV2(data)) */}
          {Object.entries(state as IUserProfile)
            .filter(([key]) => key !== 'image')
            .map(([property, value], id) => (
            <div className={styles.inputContainer} key={id}>
              <label htmlFor={property}>{property}</label>
              <Input
                name={property}
                type='text'
                value={value}
                onChange={handleChange}
              />
            </div>
          ))}
        </form>
        <div className={styles.right}>
          <div className={styles.imageContainer}>
            {profileData?.image && (
              <ProfileImage
                handleImageUpLoad={(data) => uploadProfileImage(data)}
                imageUrl={profileData.image}/>
            )}

          </div>
          {isInEdit && (
            <div className={styles.btnContainer}>
              <button onClick={handleSubmit}>submit changes</button>
            </div>
          )}
        </div>
      </div>
      {/* <Outlet/> */}
    </div>
  )
}
