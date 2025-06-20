# React+Ts+网易云

## 项目构建
- 1.配置eslint+prettier,==单独做笔记==
- 2.配置网页标题和图标(/public)
- 3.==配置别名==
  - 3.1 配置别名依照爱彼迎配置(vite.config.ts)
  - 3.2 额外的,ts需要识别`@`(tsconfig.app.json),首先下载`npm install --save-dev @types/node`,再添加如下配置
    ```json
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"] // 将 @/* 映射到 src/*
      },
    ```
    > 注意: webpack环境可以借助工具craco配置别名,因为webpack的文件配置是隐藏的,可以eject导出,但是自己直接配可能会出错;
- 4.没有选择配置editorconfig,这是针对不同IDE编辑器差异的配置,暂时不需要,都是vscode,笔记在vue+ts+cms的项目接口文档中
- 5.目录结构划分,和之前一样老样子,略
- 6.css重置: 下载less和默认css `npm i normalize.css less`,配置css文件夹内的文件(略),最后由index.less统一导出,然后在最外层的main.ts引入

## 默认文件配置
- ==**views内默认文件index.ts的格式如下**==
- 使用snippet generator, 并在`typescriptreact.json`中配置代码片段
  ```tsx
    import type { ReactNode } from "react"
    import { memo } from "react"

    interface IProps {
      children?: ReactNode // 可以传入孩子(类似插槽),ReactNode是个联合类型,更好地定义children类型
    }

    // 这样可以更好地定义函数式组件的类型,Templete可以有更多提示
    // FC = FunctionComponent (泛型就是定义props的类型),形参props先不写,用到再写
    const Templete: React.FC<IProps> = () => {
      return (
        <div className="Templete">Templete</div>
      )
    }

    export default memo(Templete) // 性能优化
  ```
## 路由配置
- 路由配置(==爱彼迎中使用的6.x版本,这里使用最新的7.x版本,细节上可能会有改变==)
- 1.配置测试路由 router/index.tsx (==非懒加载==)
  ```jsx
    import type { RouteObject } from "react-router-dom"
    import { Navigate } from "react-router-dom"
    import DisCover from "@/views/discover"
    
    const routes: RouteObject[] = [
      {
        path: "/",
        element: <Navigate to="/discover" />,
      },
      {
        path: "/discover",
        element: <DisCover />,
      },
    ]

    export default routes
  ```
  > 这个文件类型必须为jsx,里面用到了jsx语法,`<DisCover/>`本质是react创建的组件
  
- 2.应用路由App.tsx
  ```jsx
    import { useRoutes } from "react-router-dom"
    import routes from "./router"

    function App() {
      return <div className="App">{useRoutes(routes)}</div>
    }

    export default App
  ```

- 3.配置路由模式main.tsx
  ```tsx
    import { HashRouter } from "react-router-dom" // 路由

    createRoot(document.getElementById("root")!).render(
      <HashRouter>
        <App />
      </HashRouter>,
    )
  ```
- ==4.懒加载改进如下==
  ```tsx
    // 非懒加载,所有文件打包到一个js文件中
    // import DisCover from "@/views/discover"

    // 懒加载,文件分包打包到不同js文件,用到的时候再加载
    const DisCover = React.lazy(() => import("@/views/discover"))
  ```
- 在懒加载过程中,需要下载js文件,在这个过程中需要有个东西顶替显示
- 针对所有的懒加载路由,设置Suspense,临时加载显示
  ```tsx
    function App() {
      return (
        <div className="App">
          <div>
            <Link to="/discover">发现音乐</Link>
            <Link to="/mine">我的音乐</Link>
          </div>
          {/* 懒加载过程中,临时加载显示,可以是字符串,也可以是组件(比如加载页面) */}
          <Suspense fallback="loading....">{useRoutes(routes)}</Suspense>
        </div>
      )
    }
  ```
- ==2.二级路由配置==
- 以discover为例: 进行二级路由配置,新建文件夹`/views/discover/c-pages`,新建二级路由文件并初始化
- ==二级路由懒加载配置==
  ```tsx
    // 懒加载,文件分包打包到不同js文件,用到的时候再加载
    const DisCover = React.lazy(() => import("@/views/discover"))
    // Discover的二级路由
    const Recommend = React.lazy(() => import("@/views/discover/c-views/recommend"))

    // ....
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
        // .....
      ]
    }
  ```
- ==二级路由显示占位符Outlet==
  ```tsx
    // Discover.tsx
    const Discover: React.FC<IProps> = () => {
      return (
        <div className="Discover">
          <div>
            <div>Discover</div>
            <div>二级路由导航</div>
            <div>
              <Link to="/discover/recommend">推荐</Link>
              <Link to="/discover/ranking">排行榜</Link>
              <Link to="/discover/songs">歌单</Link>
              <Link to="/discover/djradio">主播电台</Link>
              <Link to="/discover/artist">歌手</Link>
              <Link to="/discover/album">新碟上架</Link>
            </div>
            {/* 二级路由的占位符Outlet (类似vue中的router-view) */}
            <Suspense fallback="loading...">
              <Outlet />
            </Suspense>
          </div>
        </div>
      )
    }
  ```
  > ==**注意**: 二级路由如果懒加载也要配置一个Suspense,这样在懒加载时可以单独仅在二级路由部分显示loading....,如果二级路由和一级路由公用一个Suspense(即App.jsx里那个),那么二级路由加载会使整个Suspense内的所有路由都显示loading....,即使这时一级路由页面已经加载完了,但是在Suspense内作为一个整体,必须跟着二级路由再次显示一次loading...,这样不好,**所以需要给二级路由们单独设置一个Suspense**,但是如果二级路由没有懒加载就可以忽略这个问题==

## 状态管理
- 状态管理: redux + @redux.js/toolkit(redux工具,更方便使用redux)
- 下载: `npm i react-redux @reduxjs/toolkit`
- 基础使用: 
  - 定义reducer /modules/counter.ts (测试)
    ```ts
      import { createSlice } from "@reduxjs/toolkit"

      const counterSlice = createSlice({
        name: "counter",
        initialState: {
          count: 100,
          name: "hahaha",
        },
        reducers: {},
      })

      export default counterSlice.reducer
    ```
  - 1.store/index.ts
    ```ts
      import { configureStore } from "@reduxjs/toolkit"
      import counterReducer from "./modules/counter"

      const store = configureStore({
        reducer: {
          counter: counterReducer,
        },
      })

      type GetStateFnType = typeof store.getState
      export type IRootState = ReturnType<GetStateFnType>

      export default store
    ```
    > ==在App使用store的时候,需要store内state的具体类型,所以需要获取一下,如下图==
    [![pVVNiv9.png](https://s21.ax1x.com/2025/06/19/pVVNiv9.png)](https://imgse.com/i/pVVNiv9)
  - 2.公开store的信息,main.tsx
    ```tsx
      import store from "@/store"
      import { Provider } from "react-redux" 

      createRoot(document.getElementById("root")!).render(
        <Provider store={store}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>
      )
    ```
  - 3.使用store内的值,例如App.tsx
    ```tsx
      import type { IRootState } from "./store"
      import { shallowEqual, useSelector } from "react-redux"

      function App() {
        const { count, name } = useSelector(
          (state: IRootState) => ({
            count: state.counter.count,
            name: state.counter.name,
          }),
          shallowEqual
        )

        return (
          <div className="App">
            <h2>
              当前计数: {count} 名字: {name}
            </h2>
          </div>
        )
      }
    ```
    > ==使用定义好的类型IRootState,默认形参state的类型是unknown,所以要定义好类型,any太笼统,提示也不好,所以具体化一些==
    > **这个方法也麻烦,还需要额外引入IRootState**
  - ==4.终极方案(来自rudex官方文档)==
  - 改进useSelector函数,使其可以自动推导state的类型,如下
    ```ts
      // store/index.ts 这个操作也可单独封装一个hooks
      type GetStateFnType = typeof store.getState
      type IRootState = ReturnType<GetStateFnType>
      export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
    ```
    ```tsx
      // App.jsx
      import { useAppSelector } from "./store"
      const { count, name } = useAppSelector(
        (state) => ({
          count: state.counter.count,
          name: state.counter.name,
        }),
        shallowEqual
      )
    ```
    > ==详情可见TS笔记/函数签名(已补充,很详细),不影响编程(了解)==
    [![pVVNkuR.png](https://s21.ax1x.com/2025/06/19/pVVNkuR.png)](https://imgse.com/i/pVVNkuR)
- 5.额外的: 非必要封装 shallowEqual/useDispatch
    ```ts
      // 非必要: 本质上等同于hooks函数useDispatch和shallowEqual,这里统一封装仅为格式统一,无实际作用
      export const useAppDispatch: () => DispatchType = useDispatch
      export const AppShallowEqual = shallowEqual
    ```



