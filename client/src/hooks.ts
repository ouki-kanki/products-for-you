import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './app/store/store'


// TODO: thes same inside store . check if this is used someweher and delete it
// NOTE: the default useDispatch does not know about thunk
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
