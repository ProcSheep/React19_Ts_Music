import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const Recommend: React.FC<IProps> = () => {
  return <div className="Recommend">Recommend</div>
}

export default memo(Recommend)
