import { useEffect, useState, ChangeEvent, useMemo } from 'react'
import { useAppDispatch } from '../../app/store/store';
import { Outlet, useNavigate, useLocation, Location } from 'react-router-dom'
import { useProductNavigation } from '../../hooks/useProductNavigation';
import { useRecaptcha } from '../../hooks/useRecaptcha';

import { useGetUserProfileQuery, useGetFavoriteProductsQuery } from '../../api/userApi';
import type { IUserProfile } from '../../api/userApi';
import type { Error } from '../../types';
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
import { BotBanner } from '../../components/Banners/BotBanner/BotBanner';

import { BaseInput } from '../../components/Inputs/BaseInput/BaseInput';
import { BaseButton } from '../../components/Buttons/baseButton/BaseButton';
import { userProfileFields } from './userProfileFields';

import { useValidationV2 } from '../../hooks/validation/useValidationV2';
import { notEmptyValidator, phoneValidator } from '../../hooks/validation/validators';
import { Button } from '../../UI/Button/Button';

import { useNotifications } from '../../hooks/useNotifications';
import { NotificationProps } from '../../components/Notifications/_Notification';


export const Profile = () => {
  const { data: profileData, refetch, isError, error, isLoading } = useGetUserProfileQuery()
  const { data: favoriteProduts, isError: isFavoriteProductsError, isLoading: isFavoriteProductsLoading, error: favoriteProductsError } = useGetFavoriteProductsQuery(undefined, { skip: !profileData, refetchOnMountOrArgChange: true })

  const { goToProductDetailWithConstructedInput } = useProductNavigation()
  const { runCaptcha, isBot, setIsBot } = useRecaptcha()
  const {
    showNotification: sendNotification,
    handleSequentialArrayOfNotifications,
    handleStackedNotificationsArray
  } = useNotifications()

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
      const apiError = uploadImageError as ApiError
      // console.log("the error", apiError)
      const message = apiError.data.detail

      showNotification({
        message,
        type: 'danger'
      })
    }
    if (isUploadImageSuccess) {
      showNotification({
        message: 'image uploaded successfully'
      })
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

  // if there is a change in fields show saveChanges btn
  useEffect(() => {
    const sanitizedValidatedFields: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(validatedFields)) {
      sanitizedValidatedFields[key] = value['value']
    }

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
  }, [navigate, isError, error])

  const handleChange = ({ target: { value, name }}: ChangeEvent<HTMLInputElement>) => {
    changeField(name, value)
  }

  useEffect(() => {
    if (isUpdateError) {
      // TODO: the type is wrong -> data.image -> array of errors
      // TODO: handle stack notification. have to show all error messages
      // TODO: error system needs refactoring !!
      const error = updateError as ValidationError
      if (error) {
        const data = error?.data

        if (data?.detail) {
          showNotification({
            message: data.detail,
            type: 'danger'
          })
          return
        }
        const errorArray = Object.values(data).map(value => value[0])

        showNotification({
          message: errorArray[0],
          type: 'danger'
        })
      }
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

  const handleImageUpload = async (data: FormData) => {
    const recaptchaToken = await runCaptcha(null)

    if (!recaptchaToken) {
      setIsBot(true)
      return
    }

    uploadProfileImage({formData: data, recaptchaToken})
  }

  // TODO : use the form validation
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const recaptchaToken = await runCaptcha(null)

    if (!recaptchaToken) {
      setIsBot(true)
      return
    }
    // check if form is valid
    if (!isFormValid) {
      showNotification({
        message: 'form is not valid'
      })
      return
    }
    const data = convertSnakeToCamelV2(profileData as IUserProfile)

    // omit fields if they are not changed
    const filteredData = Object.keys(validatedFields).reduce((ac, key) => {
      if(validatedFields[key].value !== data[key]) {
        ac[key] = validatedFields[key].value
      }
      return ac
    }, {} as Record<string, unknown>)

    const submitData = convertCamelToSnake({
      data: filteredData as Partial<IUserProfile>
    })

    updateUserProfile({
      profile_data: submitData as Partial<IUserProfile>,
      recaptchaToken})
  }

  if (!profileData) {
    return (
      <Outlet/>
    )
  }

  if (isBot) {
    return <BotBanner/>
  }

  const testNotification = () => {
    const notifications: NotificationProps[] = [
      {
        message: 'yoyoy'
      },
      {
        message: 'hey thersfsdfkjldfjksdfsdfsdjfsdfsdksdljfasdfadjsflasdjfdasjfljk',
        duration: 6000
      },
      {
        message: 'try again',
        type: 'danger'
      }
    ]

    // sendNotification({
    //   message: 'its a nice day'
    // })

    handleStackedNotificationsArray(notifications)

    // sendNotification({
    //   message: 'yoyoy'
    // })

    // showNotification({
    //   "message": "test notification"
    // })

    // ShowNotificationV2([
    //   {
    //     id: 1,
    //     message: 'yoyo'
    //   },
    //   {
    //     id: 2,
    //     message: 'yoyoyoyo'
    //   }
    // ])
  }

  return (
    <div className={styles.profileContainer}>
      <h1>User Profile</h1>
      <Button onClick={testNotification}>test</Button>
      <div className={styles.mainContainer}>
        <form className={styles.left}>
          {userProfileFields.filter(field => field.name !== 'image').map(field => (
            <div key={field.name} className={styles.fieldContainer}>
              <BaseInput
                label={field.label}
                name={field.name}
                value={validatedFields[field.name]?.value || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required={validatedFields[field.name]?.required}
                errors={validationErrors[field.name]}
              />
            </div>
          ))}
        </form>
        <div className={styles.right}>
          <div className={styles.imageContainer}>
            {profileData?.image && (
              <ProfileImage
                handleImageUpLoad={(data) => handleImageUpload(data)}
                imageUrl={profileData.image}/>
            )}

          </div>
          {isInEdit && (
            <div className={styles.btnContainer}>
              <BaseButton
                onClick={handleSubmit}
                disabled={!isFormValid}
                >submit changes</BaseButton>
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
          handleProductDetail={goToProductDetailWithConstructedInput}
        />
      </div>
    </div>
  )
}
