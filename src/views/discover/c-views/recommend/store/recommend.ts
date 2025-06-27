import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  getBanners,
  getHotRecommend,
  getNewAlbum,
  getPlayList,
} from "../service/recommend"

interface IRecommendState {
  banners: any[]
  hotRecommends: any[]
  newAlbums: any[]
  rankings: any[]
}

const initialState: IRecommendState = {
  banners: [],
  hotRecommends: [],
  newAlbums: [],
  rankings: [],
}

const recommendSlice = createSlice({
  name: "recommend",
  initialState,
  reducers: {
    changeBannerAction(state, { payload }) {
      state.banners = payload
    },
    changeRecommendAction(state, { payload }) {
      state.hotRecommends = payload
    },
    changeAlbumAction(state, { payload }) {
      state.newAlbums = payload
    },
    changeRankingAction(state, { payload }) {
      state.rankings = payload
    },
  },
})

// 合并的异步请求, _代表忽略这个参数,第一个参数是必选参数payload,调用这个函数时传参用的
// 这么合并也有要求,就是每个网络请求都不需要传递参数,否则还是分开写更好,分别传参更加清晰
export const fetchRecommendDataAction = createAsyncThunk(
  "fetchData",
  (_, { dispatch }) => {
    getBanners().then((res) => {
      dispatch(changeBannerAction(res.banners))
    })
    getHotRecommend().then((res) => {
      dispatch(changeRecommendAction(res.result))
    })
    getNewAlbum().then((res) => {
      dispatch(changeAlbumAction(res.albums))
    })
  }
)

// 获取榜单的数据,由于需要传递参数,所以不便于合并进入fetchRecommendDataAction
const rankingIds = [19723756, 3779629, 2884035]
// 回忆重点: new Promise的泛型是必传类型,它指向resolve参数的类型,同时也是then中res的类型
const promises: Promise<any>[] = []
export const fetchRankingDataAction = createAsyncThunk(
  "rankingData",
  (_, { dispatch }) => {
    // 按顺序将三个数据全部拿到后放入一个数组
    // 顺序的思考: 单纯for循环只能保证发出网络请求的顺序,但是接受res数据的顺序无法保证,这却决于服务器,网络等条件
    for (const id of rankingIds) {
      promises.push(getPlayList(id))
    }
    // 泛型定义的类型: res为any[]类型; 这里的res是保证顺序的网络请求数组集合
    Promise.all(promises).then((res) => {
      const rankings = res.map((item) => item.playlist)
      dispatch(changeRankingAction(rankings))
    })
  }
)

const {
  changeBannerAction,
  changeRecommendAction,
  changeAlbumAction,
  changeRankingAction,
} = recommendSlice.actions
export default recommendSlice.reducer
