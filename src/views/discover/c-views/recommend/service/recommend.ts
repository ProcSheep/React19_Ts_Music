import { hyRequest1 } from "@/service"

export function getBanners() {
  return hyRequest1.get({
    url: "/banner",
  })
}

export function getHotRecommend() {
  return hyRequest1.get({
    url: "/personalized",
  })
}

export function getNewAlbum() {
  return hyRequest1.get({
    url: "/album/newest",
  })
}

export function getPlayList(id: number) {
  return hyRequest1.get({
    url: "/playlist/detail",
    params: { id },
  })
}

export function getArtistList(limit = 5) {
  return hyRequest1.get({
    url: "/artist/list",
    params: {
      limit,
    },
  })
}
