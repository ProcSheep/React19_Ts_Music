// 非懒加载,所有文件打包到一个js文件中
// import DisCover from "@/views/discover" .....
import React from "react"
import { Navigate, type RouteObject } from "react-router-dom"

// 懒加载,文件分包打包到不同js文件,用到的时候再加载
const DisCover = React.lazy(() => import("@/views/discover"))
// Discover的二级路由
const Recommend = React.lazy(() => import("@/views/discover/c-views/recommend"))
const Songs = React.lazy(() => import("@/views/discover/c-views/songs"))
const Ranking = React.lazy(() => import("@/views/discover/c-views/ranking"))
const Djradio = React.lazy(() => import("@/views/discover/c-views/djradio"))
const Album = React.lazy(() => import("@/views/discover/c-views/album"))
const Artist = React.lazy(() => import("@/views/discover/c-views/artist"))

const DownLoad = React.lazy(() => import("@/views/download"))
const Focus = React.lazy(() => import("@/views/focus"))
const Mine = React.lazy(() => import("@/views/mine"))
// 注册路由
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/discover" />,
  },
  {
    path: "/discover",
    element: <DisCover />,
    children: [
      {
        path: "/discover",
        element: <Navigate to="/discover/recommend" />,
      },
      {
        path: "/discover/recommend",
        element: <Recommend />,
      },
      {
        path: "/discover/songs",
        element: <Songs />,
      },
      {
        path: "/discover/ranking",
        element: <Ranking />,
      },
      {
        path: "/discover/djradio",
        element: <Djradio />,
      },
      {
        path: "/discover/album",
        element: <Album />,
      },
      {
        path: "/discover/artist",
        element: <Artist />,
      },
    ],
  },
  {
    path: "/mine",
    element: <Mine />,
  },
  {
    path: "/download",
    element: <DownLoad />,
  },
  {
    path: "/focus",
    element: <Focus />,
  },
]

export default routes
