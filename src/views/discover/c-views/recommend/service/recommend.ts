import { hyRequest1 } from "@/service"

export function getBanners() {
  return hyRequest1.get({
    url: "/banner",
  })
}
