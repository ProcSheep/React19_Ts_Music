import type { ReactNode } from "react"
import { memo } from "react"
import { AppFooterWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const AppFooter: React.FC<IProps> = () => {
  return <AppFooterWrapper>AppFooter</AppFooterWrapper>
}

export default memo(AppFooter)
