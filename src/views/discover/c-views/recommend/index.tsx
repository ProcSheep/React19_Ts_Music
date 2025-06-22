import { useAppDispatch } from "@/store"
import type { ReactNode } from "react"
import { memo, useEffect } from "react"
import TopBanner from "./c-cpns/top-banner"
import { fetchBannerDataAction } from "./store/recommend"

interface IProps {
  children?: ReactNode
}

const Recommend: React.FC<IProps> = () => {
  // 1.请求banners的数据
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchBannerDataAction())
  }, [])
  return (
    <div className="Recommend">
      <TopBanner />
    </div>
  )
}

export default memo(Recommend)
