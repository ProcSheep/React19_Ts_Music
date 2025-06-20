import type { ReactNode } from "react"
import { memo } from "react"

interface IProps {
  children?: ReactNode
}

const Djradio: React.FC<IProps> = () => {
  return <div className="Djradio">Djradio</div>
}

export default memo(Djradio)
