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
- 7.网络请求: 下载 `npm i axios`, 把之前封装好的axios包复制过来,配置好生产/开发环境下的url路径

## 函数/类组件的TS配置
- ==**1.函数组件结合TS的配置(主要)**==
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
- ==2.类组件结合TS的配置(了解,类组件本身就用的越来越少)==
  ```jsx
    <Demo name="coderwhy" age={22} />
  ```
  ```ts
    // 测试: Demo.tsx
    import { PureComponent, type ReactNode } from "react"

    /** 类组件的类型判定 props / state
    * 类型通过泛型定义在PureComponent内部
    * 定义类型后,提示会更加友好
    */

    interface IProps {
      name: string
      age: number
    }

    interface Istate {
      message: string
      counter: number
    }

    class Demo extends PureComponent<IProps, Istate> {
      constructor(props: IProps) {
        super(props)
        this.state = {
          message: "你好",
          counter: 100,
        }
      }

      render(): ReactNode {
        return (
          <div>
            <div>{this.state.message}</div>
            <div>{this.state.counter}</div>
            <div>{this.props.name}</div>
            <div>{this.props.age}</div>
          </div>
        )
      }
    }

    export default Demo
  ```
- 不过可以简写一下,把constructor删除,直接在类中写
  ```jsx
    class Demo extends PureComponent<IProps, Istate> {
      state = {
        message: "你好世界",
        counter: 666,
      }

      render(): ReactNode {
        return (
          <div>
            <div>{this.state.message}</div>
            <div>{this.state.counter}</div>
            <div>{this.props.name}</div>
            <div>{this.props.age}</div>
          </div>
        )
      }
    }
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
  - 另外可以定义state的类型
    ```ts
      import { createSlice } from "@reduxjs/toolkit"
      // 可以定义State类型,自动的类型推导可能不准确
      interface Istate {
        count: number
        name: string
        direction: "left" | "right" | "up" | "down"
        names: string[]
      }

      const initialState: Istate = {
        count: 100,
        name: "hahaha",
        direction: "left",
        names: []
      }
      const counterSlice = createSlice({
        name: "counter",
        initialState,
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
  - ==补充: 还有一个写法==
    ```ts
      // 直接获取返回值,然后获取返回值的类型
      const state = store.getState()
      export type IRootState = typeof state
    ```
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
  > ==补充: useAppDispatch的类型推导还是有用的,所以要写!==
## 结构搭建
- 一级路由导航的搭建,顶部导航是一个整体且一直存在,底部同理有底部信息栏一直存在,所以是一个汉堡结构,顶部和底部不变,中间的内容会切换
- 封装组件`/components` + app-header / app-footer
- App.jsx中整体搭建
  ```tsx
    function App() {
      return (
        <div className="App">
          {/* 顶部: 一级路由导航 */}
          <AppHeader />
          {/* 中间: 懒加载过程中,临时加载显示,可以是字符串,也可以是组件(比如加载页面) */}
          <Suspense fallback="loading....">{useRoutes(routes)}</Suspense>
          {/* 底部: 信息栏 */}
          <AppFooter />
        </div>
      )
    }
  ```
## react中的样式
- 应用styled-components的css in js方案, 下载: `npm i styled-components` (另外的一个优秀库 emotion)
- ==关于通用的样式如何写?== 可以封装为类,也可以混入(theme主题),在爱彼迎都用过的,这里用封装为类的写法,更加简洁
- 在assets/css/common.less,添加通用样式
  ```less
    .wrap-v1 {
      width: 1100px;
      margin: 0 auto;
    }
  ```
- 直接应用在顶部结构 + wrap-v1
  ```tsx
    <HeaderWrapper>
      <div className="content wrap-v1">
        <Link to="/discover">发现音乐</Link>
        <Link to="/mine">我的音乐</Link>
        <Link to="/focus">关注</Link>
        <Link to="/download">下载客户端</Link>
      </div>
    </HeaderWrapper>
  ```
- 新建style.ts文件,写css样式
  ```ts
    import styled from "styled-components"

    const HeaderWrapper = styled.div``
    export default HeaderWrapper
  ```

## 图片资源
- 网易云的图片大多为精灵图,为了节省后端资源,精灵图需要通过定位来显示指定位置来显示对应效果
- 图片资源已经复制进入`assets/img`中,另外,提前配置好图片显示,实例如下
  ```less
    /* common.less */
    // 图片,以背景显示
    .sprite_01 {
      background: url(../img/sprite_01.png) no-repeat 0 9999px;
    }
  ```
- 精灵图如下:
  [![pVZl2EF.png](https://s21.ax1x.com/2025/06/22/pVZl2EF.png)](https://imgse.com/i/pVZl2EF)
## app-header顶部(左)
- 顶部: 分为左侧和右侧,左侧为logo+导航栏,右侧为搜索
- 左侧: ==处理导航数据,为了JSX不臃肿,第一步把导航数据封装为json数据,第二步for循环处理数据==
- assets/data/header_titles.json
  ```json
    [
      {
        "title": "发现音乐",
        "type": "path",
        "link": "/discover"
      },
      // ...
    ]
  ```
  > 数组,每个item是一个对象,对应标题和链接,其中有两个超链接,另外type用于区分使用什么标签
  ```tsx
    // app-header/index.tsx
    const AppHeader: React.FC<IProps> = () => {
      function showItem(item: IItem) {
        if (item.type === "path") {
          return (
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to={item.link}
            >
              {item.title}
              <i className="icon sprite_01"></i>
            </NavLink>
          )
        } else {
          return (
            <a href={item.link} target="_blank">
              {item.title}
            </a>
          )
        }
      }

      return (
        <HeaderWrapper>
          <div className="content wrap-v1">
            <HeaderLeft>
              <a className="logo sprite_01" href="/">
                网易云音乐
              </a>
              <div className="title-list">
                {HeaderTitle.map((item) => {
                  return (
                    <div className="item" key={item.title}>
                      {showItem(item)}
                    </div>
                  )
                })}
              </div>
            </HeaderLeft>
            <HeaderRight>HeaderRight</HeaderRight>
          </div>
          {/* 分割线 */}
          <div className="divider"></div>
        </HeaderWrapper>
      )
  ```
  - 1.遍历每一项数据,然后放入函数处理,减少jsx代码
  - 2.依据type处理返回的标签,NavLink是路由跳转,a是超链接跳转
  - 3.NavLink标签被选中后,会默认添加active(==react-router的知识==),所以这里不写className也行,主要是你可以自定义选中后的添加的class名字
- ==css相关的知识==
  - 1.首先精灵图是为了减少服务器传递图片的次数而设计的集合图,所以如果要显示对应的图标,需要通过定位来移动精灵图,使之刚好露出要显示的那个部分
  - 初始在common.less已经包装所有的精灵图,但是统一向右移动9999px,即使失误引入也不会显示
  - 显示logo的部分,使用"sprite_01"这个类,这个类正是common.less中封装,背景为精灵图
    ```less
      .sprite_01 {
        background: url(../img/sprite_01.png) no-repeat 0 9999px;
      }
    ```
    ```less
      .logo {
        display: block;
        width: 176px; /* 正好给logo框出合适的大小 */
        height: 70px;
        background-position: 0 0; /* 适当的定位,显示logo,这里logo在精灵图最左上角,所以没移动 */
        text-indent: -9999px; /* 向左9999px */
      }
    ```
    [![pVZl2EF.png](https://s21.ax1x.com/2025/06/22/pVZl2EF.png)](https://imgse.com/i/pVZl2EF)
  - 2.导航的最后一个a标签需要加一个HOT显示,所以less定位到后,用精灵图加定位显示
    ```less
      .title-list {
        display: flex;
        line-height: 70px;

        .item {
          position: relative;
          /* 导航所有的item样式 */
          a {
            display: block;
            padding: 0 20px;
            color: #ccc;
          }

          /* 最后一个item下的a标签 */
          &:last-of-type a {
            position: relative; /* 子绝父相 */
            /* 后置伪元素: 显示HOT */
            &::after {
              position: absolute;
              content: "";
              width: 28px;
              height: 28px;
              background-image: url(${sprite_01}); /* 精灵图,记得引入 */
              background-position: -190px 0; /* 把精灵图移动到合适的位置,显示正确的图标 */
              top: 20px;
              right: -15px;
            }
          }

          /* 点击导航给a标签设置hover样式 */
          &:hover a,
          .active { /* 设置active,使得标签选中后,鼠标离开也带样式 */
            color: #fff;
            background: #000;
            text-decoration: none;
          }
          /* active+icon组合className是指导航选中后,底部会显示红色小三角 */
          .active .icon {
            position: absolute;
            display: inline-block;
            width: 12px;
            height: 7px;
            bottom: -1px;
            left: 50%;
            transform: translate(-50%, 0);
            background-position: -226px 0;
          }
        }
      }
    ```
    > ==看清楚html结构后再从列表中选标签,第一次就是选错了,直接选择a的最后一个标签,其实a标签外层还有div标签,所以应当选择最后一个div==
    > 其实NavLink组件最后展示的标签还是a标签,这里的a标签样式没了是因为初始化css中已经把默认样式全部删除了
   [![pVZlRN4.png](https://s21.ax1x.com/2025/06/22/pVZlRN4.png)](https://imgse.com/i/pVZlRN4)
## app-header顶部(右)
- 使用组件ant Design, 为了应用更多组件刻意练习
- 下载: `npm install antd --save`,目前antd(5)版本对react19有一些不兼容,所以如果用到Modal、Notification、Message 等组件,需要下载兼容包(见文档)
- 利用UI组件库中的input组件和Icon组件,使用icon需要另下载`npm install @ant-design/icons@5.x --save`
  ```ts
    <HeaderRight>
      <Input
        className="search"
        placeholder="音乐/视频/电台/用户"
        prefix={<SearchOutlined />}
      />
      <div className="center">创作者中心</div>
      <div className="login">登录</div>
    </HeaderRight>
  ```
## discover的二级路由
- 搭建discover页面的二级路由导航,把discover页面再次分为2个部分,顶部导航和内容区域
- 顶部导航封装组件 -> /discover/c-cpns/nav-bar/idnex.ts 
- 同理这次也把导航要显示的数据信息放入`assets/data/local-data.ts`,有许多数据不止discover
  ```tsx
    const NavBar: React.FC<IProps> = () => {
      return (
        <div className="NavBar">
          {/* 使用common.less中的预制样式 */}
          <NavWrapper>
            <div className="nav wrap-v1">
              {/* 同理,循环数据列表,渲染导航栏 */}
              {discoverMenu.map((item) => {
                return (
                  <div className="item" key={item.link}>
                    <NavLink to={item.link}>{item.title}</NavLink>
                  </div>
                )
              })}
            </div>
          </NavWrapper>
        </div>
      )
    }
  ```
- discover架构如下:
  ```tsx
    const Discover: React.FC<IProps> = () => {
      return (
        <div className="Discover">
          <div>
            {/* 引入二级路由的组件 */}
            <NavBar />
            {/* 二级路由内容的占位符Outlet (类似vue中的router-view) */}
            <Suspense fallback="loading...">
              <Outlet />
            </Suspense>
          </div>
        </div>
      )
    }
  ```
## 文件划分
- 接下来马上进行页面内容渲染
- **需要进行网络请求和存储store可以分为两种封装方式**
  - ==一种是以功能为主,一种是以业务为主==;
  - 之前常常用功能划分方法去封装代码,即在store和service文件夹内新建modules,然后根据页面去创建对应的文件; 而业务划分是直接在recommend文件夹内新建store/service文件夹,内部直接放相关代码;
  - ==本次react项目采用新的划分方式,即"业务"划分法来构建项目==
## 发现-推荐页
- 继续做discover的二级路由-推荐页面,重点做这个页面,其他页面差不多
- 下面根据页面内容划分模块(views/discover/c-views/recommend)
### top-banner
- 组件: /c-cpns/top-banner
- 轮播图示意如下:
  [![pVZBtt1.png](https://s21.ax1x.com/2025/06/22/pVZBtt1.png)](https://imgse.com/i/pVZBtt1)
#### 轮播数据请求
- ==**1.创建Slice + 异步请求数据createAsyncThunk + 保存数据**==
- 还有一个方法,利用reducer来完成,在react-redux的RTK章节有笔记
  ```ts
    interface IRecommendState {
      banners: any[]
    }

    const initialState: IRecommendState = {
      banners: [],
    }

    const recommendSlice = createSlice({
      name: "recommend",
      initialState,
      reducers: {},
      // 保存异步的数据
      extraReducers: (builder) => {
        // payload即fetchBannerDataAction返回值, state可以直接获取initialState内的值
        builder.addCase(fetchBannerDataAction.fulfilled, (state, { payload }) => {
          state.banners = payload.banners
        })
        // 最好有个失败的提醒
        builder.addCase(fetchBannerDataAction.rejected, (state, action) => {
          console.log("网络请求失败:", action.error)
        })
      },
    })

    // 异步请求banners轮播图数据
    export const fetchBannerDataAction = createAsyncThunk("banners", async () => {
      const res = await getBanners()
      return res // axios封装自带.data
    })

    export default recommendSlice.reducer
  ```
- 2.store内注册
  ```ts
    const store = configureStore({
      reducer: {
        recommend: recommendReducer,
      },
    })
  ```
- 3.推荐页面内派发请求
  ```ts
    const dispatch = useAppDispatch()
    useEffect(() => {
      dispatch(fetchBannerDataAction())
    }, [])
  ```
  > ==注意: 状态管理中封装的useAppDispatch更加好用,useDispatch需要对fetchBannerDataAction进行额外的类型判定!==
  > 最后在redux插件中查看保存的结果,是否保存成功
#### 搭建轮播图
- 结构分为左侧,右侧,按钮(control)
- ==1.搭建左侧: 即轮播图==,应用antd的走马灯组件Carousel,把前面banner数据遍历,css略
  ```tsx
    <BannerLeft>
      <Carousel autoplay>
        {banners.map((item) => {
          return (
            <div className="banner-item" key={item.imageUrl}>
              <img
                className="image"
                src={item.imageUrl}
                alt={item.typeTitle}
              />
            </div>
          )
        })}
      </Carousel>
    </BannerLeft>
  ```
- 2.右侧: ==一张带链接跳转的固定图片==,直接由css组件的背景显示
  ```tsx
     <BannerRight></BannerRight>
  ```
  ```less
    /* 右侧图片 */
    /* attrs为组件设置静态或动态的属性,可以点击跳转新页面 */
    export const BannerRight = styled.a.attrs({
      href: "https://music.163.com/#/download",
      target: "_blank",
    })`
      display: block;
      width: 254px;
      height: 270px;
      background-image: url(${download}); /* 背景是图片 */
    `
  ```
- ==3.按钮 css略==
  ```tsx
    <BannerControl>
        <button className="btn left" onClick={handlePrevClick}></button>
        <button className="btn right" onClick={handleNextClick}></button>
    </BannerControl>
  ```
- ==点击按钮切换图片,利用组件自带的事件==
- ==重点: 如何获取到轮播组件的实例对象,从实例对象中获取方法==
  ```tsx
     <Carousel ref={bannerRef}>
  ```
  ```ts
    // ElementRef已弃用,antd直接提供了组件的ref类型可以直接引用
    const bannerRef = useRef<CarouselRef>(null)
  ```
  ```tsx
    /** 事件处理函数 */
    function handlePrevClick() {
      bannerRef.current?.prev() // 自带的事件处理函数
    }

    function handleNextClick() {
      bannerRef.current?.next()
    }
  ```

#### 毛玻璃背景
- ==**网易云的图片资源特别给力,本身就有毛玻璃模糊效果的图片,这样前端直接把图片放上去就可以,不必再css调样式了**==
  - 规律是在正常图片后面加`?imageView&blur=20x20`,imageView&blur代表模糊毛玻璃,而后面的参数代表模糊程度; 
  - 除此之外网易云的图片还有`?param=100y100`这种参数,代表100x100px大小的图片,根据这个设置可以返回不同大小的图片;
     > 网易云服务器接受图片时,会检查图片的请求参数,然后对图片进行特定的修改,对服务器资源消耗较大
- ==**毛玻璃效果**==
  ```tsx
    /** 获取内部数据 */
    const [currentIndex, setCurrentIndex] = useState(0) // 下面的dots会更新当前轮播图片的索引
    // 获取每次切换的图片url,第一次banners为空(?.)
    let bgImgUrl = banners[currentIndex]?.imageUrl
    if (bgImgUrl) {
      bgImgUrl = bgImgUrl + "?imageView&blur=40x20" // 请求服务器对图片添加毛玻璃效果
    }
  ```
  ```
    背景的毛玻璃,直接通过style属性传入了,不必在这里写,直接对背景进行切换
    解释一下css属性: url(XXX) center center / 6000px 是一个简写,代表如下
    background-position: center center; 图片上下左右都居中
    background-size: 6000px; 图片横向拉长6000px
  ```
  ```tsx
    <BannerWrapper
      style={{ background: `url('${bgImgUrl}') center center / 6000px` }}
    >
  ```
#### 自定义dots
- ==自定义的指示器: ul + li(span)== 
  ```tsx
    <BannerLeft>
      // ......
      <ul className="dots">
        {banners.map((item, index) => {
          return (
            <li key={item.imageUrl}>
              <span
                className={classNames("item", {
                  active: index === currentIndex,
                })}
                onClick={() => handleGoTo(index)}
              ></span>
            </li>
          )
        })}
      </ul>
    </BannerLeft>
  ```
  > 1.应用classnames(==下载: npm i classnames==),在合适的时机给dots添加高亮(active),当前索引图片index和当前轮播图片的索引currentIndex是否一致
  > 2.指示器的图片也是精灵图(白/红),css略,其实也是定位不同而已
- ==自动轮播与指示轮播==
  ```tsx
    // 自动轮播
    function afterChangeHandle(current: number) {
      setCurrentIndex(current)
    }

    // 手动点击-指示轮播
    function handleGoTo(bannerIndex: number) {
      bannerRef.current?.goTo(bannerIndex)
    }
  ```
  ```tsx
    <Carousel
      autoplay  // 自动轮播
      dots={false} // 取消默认指示器
      ref={bannerRef} // 获取ref实例对象
      afterChange={afterChangeHandle} // 自带事件: 轮播后触发回调函数
    >
  ```
  > 1.afterChange是自带的事件,在轮播后触发回调,此时设置currentIndex的值,对应的dots自动高亮
  > 2.handleGoTo新增功能,自定义的dots点击后不会触发轮播图跳转,和前面同理,运用组件自带事件goTo,跳转到想要跳转的页面


