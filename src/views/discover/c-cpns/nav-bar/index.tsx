import { discoverMenu } from "@/assets/data/local-data"
import type { ReactNode } from "react"
import { memo } from "react"
import { NavLink } from "react-router-dom"
import { NavWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const NavBar: React.FC<IProps> = () => {
  return (
    <div className="NavBar">
      {/* 使用common.less中的预制样式 */}
      <NavWrapper>
        <div className="nav wrap-v1">
          {discoverMenu.map((item) => {
            return (
              <div className="item" key={item.link}>
                <NavLink to={item.link}>{item.title}</NavLink>
              </div>
            )
          })}
        </div>
      </NavWrapper>
    </div>
  )
}

export default memo(NavBar)
