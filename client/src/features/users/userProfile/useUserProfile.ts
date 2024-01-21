import { RootState } from '../../../app/store/store';
import { useGetProfileQuery, useLazyGetProfileQuery } from "../../../api/userApi";
import type { IUserProfile } from "../../../api/userApi";
import { useSelector } from "react-redux";

import { setProfile } from '../userSliceV2';
import { useDispatch } from 'react-redux';

/**
 * 
 * @returns takes the userid from store and if there is no profile it fetches profile for back 
 */
export const useProfile = () => {
  // const userId = useSelector((state: RootState) => state.auth.userId)
  // const profile = useSelector((state: RootState) => state.user.profile)
  const [trigger, result] = useLazyGetProfileQuery()
  // const dispatch = useDispatch()

  // if (userId && profile === null) {
    // trigger(userId.toString())
  // }
  
  const { data, error } = result

  if (data) {
    // dispatch(setProfile(data))
  }
  return { trigger, data, error }
}