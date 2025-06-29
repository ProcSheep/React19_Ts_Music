import { hyRequest1 } from "@/service"

// 获取歌曲信息
export function getSongDetail(ids: number) {
  return hyRequest1.get({
    url: "/song/detail",
    params: {
      ids,
    },
  })
}

// 获取歌词信息
export function getSongLyric(id: number) {
  return hyRequest1.get({
    url: "/lyric",
    params: {
      id,
    },
  })
}
