import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const Artist: React.FC<IProps> = () => {
  return <div className="Artist">Artist</div>
}

export default memo(Artist)
