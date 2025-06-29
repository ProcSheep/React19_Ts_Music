import { AppShallowEqual, useAppDispatch, useAppSelector } from "@/store"
import { formatTime, getImageSize } from "@/utils/format"
import { getPlayerUrl } from "@/utils/handle-player"
import { Slider, message } from "antd"
import type { ReactNode } from "react"
import { memo, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  changeLyricIndexAction,
  changeMusicAction,
  changeplayModeAction,
} from "../store/player"
import {
  BarControl,
  BarOperator,
  BarPlayerInfo,
  PlayerBarWrapper,
} from "./style"

interface IProps {
  children?: ReactNode
}

const AppPlayerBar: React.FC<IProps> = () => {
  /** 定义组件的状态 */
  const [isPlaying, setIsPlaying] = useState(false) // 播放器状态
  const [process, setProcess] = useState(0) // 播放进度条
  const [duration, setDuration] = useState(0) // 歌曲总时间
  const [currentTime, setCurrentTime] = useState(0) // 歌曲的当前时间
  const audioRef = useRef<HTMLAudioElement>(null)
  const { currentSong, lyrics, lyricIndex, playMode } = useAppSelector(
    (state) => ({
      currentSong: state.player.currentSong,
      lyrics: state.player.lyrics,
      lyricIndex: state.player.lyricIndex,
      playMode: state.player.playMode,
    }),
    AppShallowEqual
  )
  const dispatch = useAppDispatch()

  /** 组件内副作用操作 */
  useEffect(() => {
    // 1.音乐播放,audioRef一定有值,effect在dom挂载结束后才执行 (非空断言!)
    audioRef.current!.src = getPlayerUrl(currentSong.id)
    // 2.播放音乐,play()函数会返回promise函数,可以监听播放情况
    // 特性: 浏览器禁止在用户刚进入页面,且在没有任何操作的情况下自动播放音乐
    // 不过这个地方的代码也有用,比如后续切换歌曲的时候还是要播放的,这时可以执行play()
    audioRef
      .current!.play()
      .then((res) => {
        console.log("播放歌曲成功", res)
        setIsPlaying(true)
      })
      .catch((err) => {
        console.log("播放歌曲失败", err)
        setIsPlaying(false) // 严谨性: 只要是播放失败的歌曲一律暂停
      })

    // 获取音乐的总时间
    setDuration(currentSong.dt)
  }, [currentSong]) // currentSong改变时(切换歌曲),重新执行一次里面的代码,播放新歌曲

  /** 组件内部的事件处理函数 */
  // 点击播放按钮
  function handlePlayBtnClick() {
    // 1.控制音乐的播放与暂停
    // 顺序上(1->2)防止异步问题,因为setIsPlaying操作是异步的,不会立马改变isPlaying的值
    // 如果按钮是播放的,立即停止,并改变isPlaying为false; 如果按钮是暂停的,立即播放,并改变isPlaying为true
    isPlaying
      ? audioRef.current?.pause()
      : audioRef.current?.play().catch(() => setIsPlaying(false)) // 严谨性: 只要是播放失败的歌曲一律暂停
    // 2.改变播放按钮的状态
    setIsPlaying(!isPlaying)
  }

  /** audio默认事件函数 */
  // 音乐播放进度条的更新
  function handleTimeUpdate() {
    // 1.获取当前的播放时间和总时间(网易云给的总时间是毫秒,audio获取的时间单位是秒)
    const currentTime = audioRef.current!.currentTime * 1000 // 统一单位为毫秒

    // 2.计算当前歌曲的进度
    const progress = (currentTime / duration) * 100
    setProcess(progress)
    setCurrentTime(currentTime)

    // 3.根据当前时间匹配当前的歌词数据
    let index = lyrics.length - 1 // 默认最后一句歌词,下面算法除了最后一句歌词都能匹配到
    for (let i = 0; i < lyrics.length; i++) {
      const lyric = lyrics[i]
      if (lyric.time > currentTime) {
        index = i - 1
        break
      }
    }

    // 4.匹配成功后,保存歌词序列,同时减少多余的匹配操作,每句歌词只会匹配一次
    if (lyricIndex === index || index === -1) return
    dispatch(changeLyricIndexAction(index))

    // 5.组件message歌词显示 (注意在antd5版本下,使用react19需要下载兼容包才能使用这个组件)
    message.open({
      content: lyrics[index].text,
      key: "lyric", // 显示唯一一个
      duration: 0, // 不会自动关闭
    })
  }
  // 音乐播放结束
  function handleTimeEnded() {
    if (playMode === 3) {
      // 单曲循环
      audioRef.current!.currentTime = 0
      audioRef.current!.play()
    } else {
      // 相当于自动点击"下一首"按钮,执行下一首歌函数代码
      handleChangeMusic(true)
    }
  }

  /** 经测试,onChange功能无论拖拽还是点击都能完美执行功能,涵盖onChangeComplete功能,所以只用3即可 */
  // 3.点击音乐进度条都会触发(例如50)
  function handleSliderChange(value: number) {
    // 1.获取点击位置的时间
    const currentTime = (value / 100) * duration
    // 2.设置当前播放器的时间audio (接受单位秒,而上面计算时duration单位为毫秒,统一下单位)
    audioRef.current!.currentTime = currentTime / 1000
    // 3.修改currentTime和progress,立即改变进度条,其实不改在handleTimeUpdate函数内也会修改currentTime,只不过需要等待audio播放1s去触发
    setCurrentTime(currentTime)
    setProcess(value)
  }

  // 4.拖拽进度条鼠标抬起时触发,接受当前位置的进度条参数 (测试)
  function handleSliderChangeComplete(value: number) {
    console.log(value)
  }

  // 5.改变播放模式
  function onChangePlayMode() {
    let newPlayMode = playMode + 1
    // playMode = 1/2/3
    if (newPlayMode > 3) newPlayMode = 1
    dispatch(changeplayModeAction(newPlayMode))
  }

  // 6.切换歌曲的函数
  function handleChangeMusic(isNext: boolean) {
    dispatch(changeMusicAction(isNext))
  }

  return (
    <PlayerBarWrapper className="sprite_playbar">
      <div className="content wrap-v2">
        {/* 左侧播放按钮 */}
        <BarControl $isPlaying={isPlaying}>
          <button
            className="btn sprite_playbar prev"
            onClick={() => handleChangeMusic(false)}
          ></button>
          <button
            className="btn sprite_playbar play"
            onClick={handlePlayBtnClick}
          ></button>
          <button
            className="btn sprite_playbar next"
            onClick={() => handleChangeMusic(true)}
          ></button>
        </BarControl>

        {/* 中间播放器 */}
        <BarPlayerInfo>
          {/* 歌曲图片,可跳转player页面 */}
          <Link to="/player">
            <img
              className="image"
              src={getImageSize(currentSong?.al?.picUrl, 50)}
            />
          </Link>
          {/* 歌手信息 */}
          <div className="info">
            <div className="song">
              <span className="song-name">{currentSong.name}</span>
              <span className="singer-name">{currentSong?.ar?.[0]?.name}</span>
            </div>
            <div className="progress">
              {/* 播放进度条,antd组件 */}
              {/* 属性介绍: 
                  value: 百分比推动进度条的位置(类似50%),传入的值不能是0.5,而是50
                  step: 步长,默认为1,即改变1%进度条移动一次
                  tooltip: 删除进度条上的默认提示
                  onChange: 当 Slider 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入, 无论拖拽和点击都会触发
                  onChangeComplete: 与mouseup和keyup触发时机一致，把当前值作为参数传入, 即当用户拖动滑块并释放鼠标时触发，此时返回的value是最终位置的百分比
              */}
              <Slider
                value={process}
                step={0.5}
                tooltip={{ formatter: null }}
                onChangeComplete={handleSliderChangeComplete}
                onChange={handleSliderChange}
              />
              {/* 播放时间 */}
              <div className="time">
                <span className="current">{formatTime(currentTime)}</span>
                <span className="divider">/</span>
                <span className="duration">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </BarPlayerInfo>

        {/* 右侧操作 */}
        <BarOperator $playMode={playMode}>
          {/* 左侧按钮区域  信息 收藏 转发 */}
          <div className="left">
            <button className="btn pip"></button>
            <button className="btn sprite_playbar favor"></button>
            <button className="btn sprite_playbar share"></button>
          </div>
          {/* 右侧按钮区域 音量 播放模式 歌单 */}
          <div className="right sprite_playbar">
            <button className="btn sprite_playbar volume"></button>
            <button
              className="btn sprite_playbar loop"
              onClick={onChangePlayMode}
            ></button>
            <button className="btn sprite_playbar playlist"></button>
          </div>
        </BarOperator>
      </div>
      {/* <audio>是用于嵌入音频内容的原生标签，属于 HTML5 新增的多媒体元素 */}
      {/* 
          onTimeUpdate: 媒体播放时,执行回调函数
      */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTimeEnded}
      />
    </PlayerBarWrapper>
  )
}

export default memo(AppPlayerBar)
