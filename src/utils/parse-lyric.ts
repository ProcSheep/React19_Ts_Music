interface ILyric {
  time: number
  text: string
}

// 匹配-正则表达式
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricString: string) {
  // 将解析好的歌词放入数组并返回出去
  const lyrics: ILyric[] = []
  // 1.歌词以\n分割,把整体字符串切割为一句一句的歌词数组
  const lines: string[] = lyricString.split("\n")
  // 2.把每句歌词解析为格式正确的对象
  /**  匹配效果如下:
   *  "[02:01.95]还有糖纸染上的香" ==> { time: xxx, text: "xxx" } (数组lyrics中的某一项item)
   */
  for (const line of lines) {
    // 匹配歌词时间 可以打印看看res的结构
    const res = timeRegExp.exec(line)
    if (!res) continue

    // 2.获取每一组的时间部分数据, 例如: 04 24 890 代表分,秒,毫秒 (统一转为毫秒)
    const time1 = Number(res[1]) * 60 * 1000
    const time2 = Number(res[2]) * 1000
    // 如果毫秒数为2位,例如:04 24 89,这个89代表890ms而不是89ms,所以乘10
    const time3 = res[3].length === 3 ? Number(res[3]) : Number(res[3]) * 10
    const time = time1 + time2 + time3

    // 3.获取每一组的文本数据
    // 可以传入正则表达式,把时间部分替换为空字符串,剩下的不就是歌词数据了吗
    const text = line.replace(timeRegExp, "")

    // 4.把整理好的一组数据(时间+文本)放入数组lyrics
    lyrics.push({ time, text })
  }

  return lyrics
}
