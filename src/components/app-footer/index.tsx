import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const AppFooter: React.FC<IProps> = () => {
  return <div className="AppFooter">AppFooter</div>
}

export default memo(AppFooter)
