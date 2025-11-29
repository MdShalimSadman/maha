
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store'; // Assuming your store file is at './store'


export const useAppDispatch = useDispatch.withTypes<AppDispatch>();


export const useAppSelector = useSelector.withTypes<RootState>();