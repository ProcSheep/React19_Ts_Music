import recommendReducer from "@/views/discover/c-views/recommend/store/recommend"
import playerReducer from "@/views/player/store/player"
import { configureStore } from "@reduxjs/toolkit"
import {
  shallowEqual,
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"

const store = configureStore({
  reducer: {
    recommend: recommendReducer,
    player: playerReducer,
  },
})

type GetStateFnType = typeof store.getState
export type IRootState = ReturnType<GetStateFnType>
type DispatchType = typeof store.dispatch
// 必要的: 最终方案,解决useSelector的参数类型问题
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
// 非必要: 为了格式统一封装
export const useAppDispatch: () => DispatchType = useDispatch
export const AppShallowEqual = shallowEqual

export default store
