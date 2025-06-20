import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const Mine: React.FC<IProps> = () => {
  return <div className="Mine">Mine</div>
}

export default memo(Mine)
