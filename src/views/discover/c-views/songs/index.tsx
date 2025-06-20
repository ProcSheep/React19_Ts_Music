import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const Songs: React.FC<IProps> = () => {
  return <div className="Songs">Songs</div>
}

export default memo(Songs)
