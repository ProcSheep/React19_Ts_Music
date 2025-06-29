import type { ReactNode } from "react"
import { memo } from "react"
import { HeaderV2Wrapper } from "./styled"

interface IProps {
  children?: ReactNode
  title: string
  moreText?: string
  moreLink?: string
}

const AreaHeaderV2: React.FC<IProps> = (props) => {
  const { title, moreText, moreLink } = props
  return (
    <HeaderV2Wrapper>
      <h3 className="title">{title}</h3>
      {moreText && moreLink && <a href={moreLink}>{moreText}</a>}
    </HeaderV2Wrapper>
  )
}

export default memo(AreaHeaderV2)
