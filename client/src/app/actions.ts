import type { IUserProfile } from "../api/userApi";

export const enum ActionTypesProfile {
  CHANGE = 'CHANGE',
  SET_PROFILE_DATA = 'SET_PROFILE_DATA'
}

export type ActionChangeField = { type: ActionTypesProfile.CHANGE; name: string; value: string | File };

export type ActionSetProfileData = { type: ActionTypesProfile.SET_PROFILE_DATA, payload: IUserProfile }
