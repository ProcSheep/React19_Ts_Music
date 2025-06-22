import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getBanners } from "../service/recommend"

interface IRecommendState {
  banners: any[]
}

const initialState: IRecommendState = {
  banners: [],
}

const recommendSlice = createSlice({
  name: "recommend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBannerDataAction.fulfilled, (state, { payload }) => {
      state.banners = payload.banners
    })
    builder.addCase(fetchBannerDataAction.rejected, (state, action) => {
      console.log("网络请求失败:", action.error)
    })
  },
})

// 异步请求banners轮播图数据
export const fetchBannerDataAction = createAsyncThunk("banners", async () => {
  const res = await getBanners()
  return res // axios封装自带.data
})

export default recommendSlice.reducer
