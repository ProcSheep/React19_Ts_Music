export function formatCount(count: number) {
  if (count > 100000) {
    return Math.floor(count / 10000) + "万"
  } else {
    return count
  }
}

export function getImageSize(
  imageUrl: string,
  width: number,
  height: number = width // 大部分图片是正方形,为了方便,如果不传高度,默认宽=高
) {
  return imageUrl + `?param=${width}x${height}`
}
