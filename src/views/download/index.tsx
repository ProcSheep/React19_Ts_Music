import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const DownLoad: React.FC<IProps> = () => {
  return <div className="DownLoad">DownLoad</div>
}

export default memo(DownLoad)
