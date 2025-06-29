import type { ReactNode } from "react"
import { memo } from "react"
import { UserLoginWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const UserLogin: React.FC<IProps> = () => {
  return (
    <UserLoginWrapper className="sprite_02">
      <p>登录网易云,畅想无限收藏的乐趣,并无限同步到手机</p>
      <a href="#" className="sprite_02">
        用户登录
      </a>
    </UserLoginWrapper>
  )
}

export default memo(UserLogin)
