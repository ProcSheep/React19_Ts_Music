import HeaderTitle from "@/assets/data/header_titles.json"
import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"
import type { ReactNode } from "react"
import { memo } from "react"
import { NavLink } from "react-router-dom"
import { HeaderLeft, HeaderRight, HeaderWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

interface IItem {
  title: string
  type: string
  link: string
}

const AppHeader: React.FC<IProps> = () => {
  function showItem(item: IItem) {
    if (item.type === "path") {
      return (
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          to={item.link}
        >
          {item.title}
          <i className="icon sprite_01"></i>
        </NavLink>
      )
    } else {
      return (
        <a href={item.link} target="_blank">
          {item.title}
        </a>
      )
    }
  }

  return (
    <HeaderWrapper>
      <div className="content wrap-v1">
        <HeaderLeft>
          <a className="logo sprite_01" href="/">
            网易云音乐
          </a>
          <div className="title-list">
            {HeaderTitle.map((item) => {
              return (
                <div className="item" key={item.title}>
                  {showItem(item)}
                </div>
              )
            })}
          </div>
        </HeaderLeft>
        <HeaderRight>
          <Input
            className="search"
            placeholder="音乐/视频/电台/用户"
            prefix={<SearchOutlined />}
          />
          <div className="center">创作者中心</div>
          <div className="login">登录</div>
        </HeaderRight>
      </div>
      {/* 分割线 */}
      <div className="divider"></div>
    </HeaderWrapper>
  )
}

export default memo(AppHeader)
