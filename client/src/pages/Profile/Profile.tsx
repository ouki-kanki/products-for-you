import { useEffect, useReducer, useState, ChangeEvent, useMemo } from 'react'
import { useAppDispatch } from '../../app/store/store';
import { fieldsReducer } from '../../app/reducers';
import { Outlet, useNavigate, useLocation, Location } from 'react-router-dom'

import { useGetUserProfileQuery, useGetFavoriteProductsQuery } from '../../api/userApi';
import type { IUserProfile, IUserProfileBase } from '../../api/userApi';
import { ActionTypesProfile } from '../../app/actions';
import { useUpdateUserProfileMutation } from '../../api/userApi';
import { useUploadProfileImageMutation } from '../../api/userProfileApi';

import styles from './profile.module.scss'
import { convertSnakeToCamelV2, convertCamelToSnake } from '../../utils/converters';
import { haveSameValue } from '../../utils/objUtils';
import { showNotification } from '../../components/Notifications/showNotification';

import { ProfileImage } from './ProfileImage/ProfileImage';
import { ApiError, ValidationError } from '../../types';
import { userApi } from '../../api/userApi';

import { FavoriteProducts } from './FavoriteProducts/FavoriteProducts';
import { Spinner } from '../../components/Spinner/Spinner';

import { BaseInput } from '../../components/Inputs/BaseInput/BaseInput';
import { userProfileFields } from './userProfileFields';

import { useValidationV2 } from '../../hooks/validation/useValidationV2';
import { notEmptyValidator, phoneValidator } from '../../hooks/validation/validators';

type Error = {
  status: number;
  data: {
    message: string
  }
}

type ProfileState = Omit<IUserProfileBase, 'image'>

// OBSOLETE
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
  const { data: profileData, refetch, isError, error, isLoading } = useGetUserProfileQuery()
  const { data: favoriteProduts, isError: isFavoriteProductsError, isLoading: isFavoriteProductsLoading, error: favoriteProductsError } = useGetFavoriteProductsQuery(undefined, { skip: !profileData })


  // *** VALIDATION ***
  const fieldsWithNotEmptyValidator = ['firstName', 'lastName', 'ShippingAddress', 'BillingAddress', 'city']
  const groupWithCommonValidators = Object.fromEntries(fieldsWithNotEmptyValidator.map(field => [field, [notEmptyValidator]])
  )


  const {fields: validatedFields, errors: validationErrors, isFormValid, registerField, changeField, touchField} = useValidationV2({
    ...groupWithCommonValidators,
    phoneNumber: [phoneValidator],
    cellPhoneNumber: [phoneValidator],
    image: []
  })

  const fieldNamesArray = useMemo(() => {
    return userProfileFields.map(field => field.name)
  }, [])

  useEffect(() => {
    fieldNamesArray.forEach(field => registerField(field))
  }, [registerField, fieldNamesArray])

  // load profileDAta


  // TODO: need the zip code in the profile

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { target: { name }}= e
    touchField(name)
  }

  const [updateUserProfile, {data: updateData, isSuccess: isUpdateSuccess, error: updateError, isError: isUpdateError, isLoading: udpateLoading}] = useUpdateUserProfileMutation()
  const [uploadProfileImage, { data: uploadImageData, isSuccess: isUploadImageSuccess, isError: isUploadImageError, error: uploadImageError }] = useUploadProfileImageMutation()

  const apiDispatch = useAppDispatch()
  const { usePrefetch } = userApi
  const { util: { resetApiState, upsertQueryData } } = userApi
  const prefetchUserProfile = usePrefetch('getUserProfile')

  const navigate = useNavigate()
  const [isInEdit, setIsInEdit] = useState(false)
  const location: Location = useLocation()
  // const [state, dispatch] = useReducer(fieldsReducer, initialState)

  const profileStr = JSON.stringify(profileData)

  //  ******
  // TODO: check validation Hook useMemo does not solve the problem with the validators dep
  // that makes sense but i cannot use stringify because i cannot serialize the array of funtions that the validator is . whith the removed dep the hook works as expected but i have to adressd this issue ********
  useEffect(() => {
    if (profileStr) {
      const data = JSON.parse(profileStr)
      // console.log("the data of field", fields, data)
      fieldNamesArray.forEach(field => changeField(field, data[field]))
    }
  }, [profileStr, fieldNamesArray])

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
    }
  }, [isUploadImageError, isUploadImageSuccess, uploadImageError, apiDispatch, resetApiState, refetch])


  const strLocation = JSON.stringify(location)
  useEffect(() => {
    const location = JSON.parse(strLocation)
    if (location.pathname === '/profile') {
      refetch()
    }
  }, [refetch, strLocation])

  console.log(validatedFields)

  // if there is a change in fields show saveChanges btn
  useEffect(() => {

    // const sanitizedValidatedFields = Object.entries(validatedFields).map(([key, value ]) => ({ [key]: value['value'] }))
    // console.log("comparison", profileData,sanitizedValidatedFields)

    const sanitizedValidatedFields: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(validatedFields)) {
      sanitizedValidatedFields[key] = value['value']
      // sanitizedValidatedFields[]
    }

    console.log("the sanitized fieds", profileData, sanitizedValidatedFields)


    if (profileData) {
      // useCallback on the function on objUtils
      if (!haveSameValue(profileData, sanitizedValidatedFields)) {
        setIsInEdit(true)
      } else {
        if (isInEdit) {
          setIsInEdit(false)
        }
      }
    }
  }, [isInEdit, profileData, validatedFields])

  useEffect(() => {
    if (isError && (error as Error).status === 404) {
      navigate('/profile/create')
    }
    // TODO: stringify error. (it does not seems to cause problem cause it's null and the it bacames an object?)
  }, [navigate, isError, error])

  const handleChange = ({ target: { value, name }}: ChangeEvent<HTMLInputElement>) => {
    changeField(name, value)
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
      showNotification({
        message: 'profile updated successfully'
      })
    }
  }, [isUpdateSuccess, updateData, updateError, isUpdateError])

  if (isLoading) {
    return (
      <Spinner/>
    )
  }

  // TODO : use the form validation
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
          {userProfileFields.map(field => (
            <BaseInput
              key={field.name}
              label={field.label}
              name={field.name}
              value={validatedFields[field.name]?.value || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
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
      <div className={styles.favoriteProductsContainer}>
        <h2 className={styles.underline}>Favorite Products</h2>
        <FavoriteProducts
          data={favoriteProduts}
          isLoading={isFavoriteProductsLoading}
          isError={isFavoriteProductsError}
        />
      </div>
      {/* <Outlet/> */}
    </div>
  )
}
