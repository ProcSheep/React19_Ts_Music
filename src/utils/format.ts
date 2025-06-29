// 格式化播放量
export function formatCount(count: number) {
  if (count > 100000) {
    return Math.floor(count / 10000) + "万"
  } else {
    return count
  }
}

// 格式化图片大小尺寸
export function getImageSize(
  imageUrl: string,
  width: number,
  height: number = width // 大部分图片是正方形,为了方便,如果不传高度,默认宽=高
) {
  return imageUrl + `?param=${width}y${height}` // x不精确,换为y
}

// 格式化播放歌曲时间
export function formatTime(time: number) {
  // 1.毫秒转为秒
  const timeSeconds = time / 1000

  // 2.获取分钟/秒钟
  // 向下取整 例如: 100/60 = 1分钟余40秒
  const minutes = Math.floor(timeSeconds / 60)
  // 毫秒转秒可能会有小数,向下取整删除额外的小数点
  const seconds = Math.floor(timeSeconds % 60)

  // 3.格式化 MM:SS,数字不足0补位
  const formatMinutes = String(minutes).padStart(2, "0")
  const formatSeconds = String(seconds).padStart(2, "0")

  return `${formatMinutes}:${formatSeconds}`
}
