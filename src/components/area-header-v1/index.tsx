import type { ReactNode } from "react"
import { memo } from "react"
import { Link } from "react-router-dom"
import { AreaHeaderV1Wrapper } from "./style"

interface IProps {
  children?: ReactNode
  title: string
  keywords?: string[]
  moreText?: string
  moreLink?: string
}

const AreaHeaderV1: React.FC<IProps> = (props) => {
  const { title, keywords = [], moreText = "更多", moreLink = "/" } = props

  return (
    <AreaHeaderV1Wrapper className="sprite_02">
      <div className="left">
        <h3 className="title">{title}</h3>
        <div className="keywords">
          {/* 如果keywords为空数组,map不会执行内部的回调函数 */}
          {keywords.map((item) => {
            return (
              <div className="item" key={item}>
                <span className="link">{item}</span>
                <span className="divider">|</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="right">
        <Link className="more" to={moreLink}>
          {moreText}
        </Link>
        <i className="icon sprite_02"></i>
      </div>
    </AreaHeaderV1Wrapper>
  )
}

export default memo(AreaHeaderV1)
