import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const Ranking: React.FC<IProps> = () => {
  return <div className="Ranking">Ranking</div>
}

export default memo(Ranking)
