import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Custom hook for dispatch with correct types
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook for selector with correct types
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
