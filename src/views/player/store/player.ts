import type { IRootState } from "@/store"
import { parseLyric } from "@/utils/parse-lyric"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getSongDetail, getSongLyric } from "../service/player"

interface IThunkState {
  state: IRootState
}

// (记住即可,类型问题)类型定义的参数: 第一个是函数, 第二个是传递参数的类型, 第三个是给getState定义类型,默认unknow
// IRootState是统一的store导出的类型
// * 处理获取歌曲的异步函数
export const fetchCurrentSongAction = createAsyncThunk<
  void,
  number,
  IThunkState
>("currentSong", (id: number, { dispatch, getState }) => {
  // 补: 从播放列表中尝试获取这首歌
  const playSongList = getState().player.playSongList
  const findIndex = playSongList.findIndex((item) => item.id === id)
  if (findIndex === -1) {
    // console.log("没找到歌曲")
    // 1.获取歌曲信息
    getSongDetail(id).then((res) => {
      if (!res.songs.length) return
      const song = res.songs[0]
      // 2.没有歌曲就添加进歌单 (末尾添加)
      const newPlaySongList = [...playSongList]
      newPlaySongList.push(song)
      dispatch(changeCurrentSongAction(song))
      dispatch(changeplaySongListAction(newPlaySongList))
      dispatch(changeplaySongIndexAction(newPlaySongList.length - 1))
    })
  } else {
    // 找到歌曲
    const song = playSongList[findIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changeplaySongIndexAction(findIndex))
  }

  // 2.获取歌词数据
  getSongLyric(id).then((res) => {
    if (!res.lrc.lyric) return
    const lyricString = res.lrc.lyric // 字符串

    // 解析歌词,封装为工具函数 /utils/parse-lyric.ts
    const lyrics = parseLyric(lyricString)

    // 将歌词保存进入store中
    dispatch(changeLyricsAction(lyrics))
  })
})

// * 处理歌曲播放模式的异步函数
export const changeMusicAction = createAsyncThunk<void, boolean, IThunkState>(
  "changeMusic",
  (isNext, { dispatch, getState }) => {
    // 1.获取state中的值
    const player = getState().player
    const songList = player.playSongList
    const songIndex = player.playSongIndex
    const playMode = player.playMode

    // 只有歌单歌曲大于1首,切换歌曲才有意义
    // 当然我默认给了2首歌的数据,所以这种情况不可能出现,只是提醒一下可能有的特殊情况
    if (songList.length < 1) return
    // 2.根据不同的切换模式切换歌曲索引
    let newIndex = songIndex
    if (playMode === 2) {
      // 随机模式 (防止随机到自己)
      let tempIndex = Math.floor(Math.random() * songList.length)
      while (tempIndex === newIndex) {
        tempIndex = Math.floor(Math.random() * songList.length)
      }
      newIndex = tempIndex
    } else {
      // 顺序模式和循环模式 (循环模式仅指歌曲循环,但是在切换模式上还是按照顺序来)
      newIndex = isNext ? newIndex + 1 : newIndex - 1
      // 处理越界问题
      if (newIndex > songList.length - 1) newIndex = 0
      if (newIndex < 0) newIndex = songList.length - 1
    }

    // 3.获取到当前歌曲
    const song = songList[newIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changeplaySongIndexAction(newIndex))

    // 4.同理获取新歌的新歌词
    getSongLyric(song.id).then((res) => {
      if (!res.lrc.lyric) return
      const lyricString = res.lrc.lyric // 字符串

      // 解析歌词,封装为工具函数 /utils/parse-lyric.ts
      const lyrics = parseLyric(lyricString)

      // 将歌词保存进入store中
      dispatch(changeLyricsAction(lyrics))
    })
  }
)

interface ILyric {
  time: number
  text: string
}

interface IPlayerState {
  currentSong: any
  lyrics: ILyric[]
  lyricIndex: number
  playSongList: any[]
  playSongIndex: number
  playMode: number
}

const initialState: IPlayerState = {
  // 自带默认一首歌,防止进入页面数据还未请求到时出现页面显示缺失,网易云会把最后听的歌曲信息保存在本地,然后下次进入后,优先从本地获取歌曲数据先顶替显示
  currentSong: {
    name: "想自由",
    mainTitle: null,
    additionalTitle: null,
    id: 2709792992,
    pst: 0,
    t: 0,
    ar: [
      {
        id: 29804746,
        name: "王安宇",
        tns: [],
        alias: [],
      },
    ],
    alia: [],
    pop: 100,
    st: 0,
    rt: "",
    fee: 8,
    v: 38,
    crbt: null,
    cf: "",
    al: {
      id: 273468247,
      name: "想自由",
      picUrl:
        "https://p2.music.126.net/pV6YcSA_kYyEdj5qhgADig==/109951171127712388.jpg",
      tns: [],
      pic_str: "109951171127712388",
      pic: 109951171127712380,
    },
    dt: 268605,
    h: {
      br: 320000,
      fid: 0,
      size: 10746819,
      vd: -15581,
      sr: 44100,
    },
    m: {
      br: 192000,
      fid: 0,
      size: 6448109,
      vd: -12946,
      sr: 44100,
    },
    l: {
      br: 128000,
      fid: 0,
      size: 4298754,
      vd: -11182,
      sr: 44100,
    },
    sq: {
      br: 718729,
      fid: 0,
      size: 24136767,
      vd: -15579,
      sr: 44100,
    },
    hr: null,
    a: null,
    cd: "01",
    no: 1,
    rtUrl: null,
    ftype: 0,
    rtUrls: [],
    djId: 0,
    copyright: 1,
    s_id: 0,
    mark: 17179877376,
    originCoverType: 2,
    originSongSimpleData: {
      songId: 108281,
      name: "想自由",
      artists: [
        {
          id: 3685,
          name: "林宥嘉",
        },
      ],
      albumMeta: {
        id: 10757,
        name: "美妙生活",
      },
    },
    tagPicList: null,
    resourceState: true,
    version: 4,
    songJumpInfo: null,
    entertainmentTags: null,
    awardTags: null,
    displayTags: null,
    single: 0,
    noCopyrightRcmd: null,
    mv: 0,
    rtype: 0,
    rurl: null,
    mst: 9,
    cp: 7003,
    publishTime: 1748707200000,
  },
  lyrics: [], // 保存解析过的歌词数据
  lyricIndex: -1, // 当前匹配歌词的序列
  playSongList: [
    // 歌单列表,默认放入2首歌
    {
      name: "想自由",
      mainTitle: null,
      additionalTitle: null,
      id: 2709792992,
      pst: 0,
      t: 0,
      ar: [
        {
          id: 29804746,
          name: "王安宇",
          tns: [],
          alias: [],
        },
      ],
      alia: [],
      pop: 100,
      st: 0,
      rt: "",
      fee: 8,
      v: 38,
      crbt: null,
      cf: "",
      al: {
        id: 273468247,
        name: "想自由",
        picUrl:
          "https://p2.music.126.net/pV6YcSA_kYyEdj5qhgADig==/109951171127712388.jpg",
        tns: [],
        pic_str: "109951171127712388",
        pic: 109951171127712380,
      },
      dt: 268605,
      h: {
        br: 320000,
        fid: 0,
        size: 10746819,
        vd: -15581,
        sr: 44100,
      },
      m: {
        br: 192000,
        fid: 0,
        size: 6448109,
        vd: -12946,
        sr: 44100,
      },
      l: {
        br: 128000,
        fid: 0,
        size: 4298754,
        vd: -11182,
        sr: 44100,
      },
      sq: {
        br: 718729,
        fid: 0,
        size: 24136767,
        vd: -15579,
        sr: 44100,
      },
      hr: null,
      a: null,
      cd: "01",
      no: 1,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 1,
      s_id: 0,
      mark: 17179877376,
      originCoverType: 2,
      originSongSimpleData: {
        songId: 108281,
        name: "想自由",
        artists: [
          {
            id: 3685,
            name: "林宥嘉",
          },
        ],
        albumMeta: {
          id: 10757,
          name: "美妙生活",
        },
      },
      tagPicList: null,
      resourceState: true,
      version: 4,
      songJumpInfo: null,
      entertainmentTags: null,
      awardTags: null,
      displayTags: null,
      single: 0,
      noCopyrightRcmd: null,
      mv: 0,
      rtype: 0,
      rurl: null,
      mst: 9,
      cp: 7003,
      publishTime: 1748707200000,
    },
    {
      name: "官窑",
      mainTitle: null,
      additionalTitle: null,
      id: 2720074244,
      pst: 0,
      t: 0,
      ar: [
        {
          id: 13699781,
          name: "马赫mood",
          tns: [],
          alias: [],
        },
      ],
      alia: [],
      pop: 100,
      st: 0,
      rt: "",
      fee: 8,
      v: 38,
      crbt: null,
      cf: "",
      al: {
        id: 276548899,
        name: "官窑",
        picUrl:
          "https://p2.music.126.net/B-SjQ39OHNxfx0T1CydBfg==/109951171367522991.jpg",
        tns: [],
        pic_str: "109951171367522991",
        pic: 109951171367522990,
      },
      dt: 173000,
      h: {
        br: 320002,
        fid: 0,
        size: 6922493,
        vd: -27623,
        sr: 44100,
      },
      m: {
        br: 192002,
        fid: 0,
        size: 4153513,
        vd: -25019,
        sr: 44100,
      },
      l: {
        br: 128002,
        fid: 0,
        size: 2769023,
        vd: -23516,
        sr: 44100,
      },
      sq: {
        br: 1630252,
        fid: 0,
        size: 35257399,
        vd: -27590,
        sr: 44100,
      },
      hr: null,
      a: null,
      cd: "01",
      no: 1,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 0,
      s_id: 0,
      mark: 17179877376,
      originCoverType: 0,
      originSongSimpleData: null,
      tagPicList: null,
      resourceState: true,
      version: 4,
      songJumpInfo: null,
      entertainmentTags: null,
      awardTags: null,
      displayTags: null,
      single: 0,
      noCopyrightRcmd: null,
      mv: 0,
      rtype: 0,
      rurl: null,
      mst: 9,
      cp: 0,
      publishTime: 0,
    },
  ],
  playSongIndex: -1, // 当前歌曲在歌单中的序列号
  playMode: 1, // 1: 顺序播放 2: 随机播放 3: 单曲循环
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    changeCurrentSongAction(state, { payload }) {
      state.currentSong = payload
    },
    changeLyricsAction(state, { payload }) {
      state.lyrics = payload
    },
    changeLyricIndexAction(state, { payload }) {
      state.lyricIndex = payload
    },
    changeplaySongIndexAction(state, { payload }) {
      state.playSongIndex = payload
    },
    changeplaySongListAction(state, { payload }) {
      state.playSongList = payload
    },
    changeplayModeAction(state, { payload }) {
      state.playMode = payload
    },
  },
})
export const {
  changeCurrentSongAction,
  changeLyricsAction,
  changeLyricIndexAction,
  changeplaySongIndexAction,
  changeplaySongListAction,
  changeplayModeAction,
} = playerSlice.actions
export default playerSlice.reducer
