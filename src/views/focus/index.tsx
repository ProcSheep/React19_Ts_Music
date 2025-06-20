import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const Focus: React.FC<IProps> = () => {
  return <div className="Focus">Focus</div>
}

export default memo(Focus)
