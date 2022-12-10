import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { AppDispatch, AppState } from "./index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
