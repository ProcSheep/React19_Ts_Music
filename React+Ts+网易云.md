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

## **函数/类组件的TS配置**
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

## **状态管理**
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
  > ==补充: useAppDispatch的类型推导还是有用的,涉及传参类型推导等问题,反正要写!==
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
## **react中的样式**
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

## **图片资源**
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
## **文件划分**
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
### content
- 组件: /c-cpns/hot-recommend
- 示意图: 
  [![pVm7MjO.png](https://s21.ax1x.com/2025/06/27/pVm7MjO.png)](https://imgse.com/i/pVm7MjO)
#### 整体布局
- 在推荐页面(recommend外层index): 在顶层轮播图(TopBanner)下面是网页内容区域
  ```tsx
    <RecommendWrapper>
      <TopBanner />   
      <div className="content wrap-v2">
        <div className="left">
          <HotRecommend />
        </div>
        <div className="right">right</div>
      </div>
    </RecommendWrapper>
  ```
- 整个的内容区域也有一个背景图,如下
  [![pVm3OXR.png](https://s21.ax1x.com/2025/06/26/pVm3OXR.png)](https://imgse.com/i/pVm3OXR)
- 封装左右两侧组件,先封装左侧组件(热门推荐板块),在本文件cpns新建hot-recommend,如下
  ```tsx
    <HotRecommendWrapper>
      <AreaHeaderV1
        title="热门推荐"
        keywords={["华语", "摇滚", "民谣", "电子", "流行"]}
        moreLink="/discover/songs"
      />
      HotRecommend
    </HotRecommendWrapper>
  ```
  > ==接下来马上说明AreaHeaderV1组件==
#### 顶部导航(通用)
- ==封装通用的顶部组件AreaHeaderV1,这个组件在许多地方都会用==
- 通用组件统一在`/src/components/area-header-v1`中封装
- 组件可以父传子,接受定制化,接受参数如下(仅标题为必穿属性)
  ```tsx
    interface IProps {
      children?: ReactNode
      title: string
      keywords?: string[]
      moreText?: string
      moreLink?: string
    }
  ```
  > 在没有ts的时候,当时父传子为了规定类型还用过一个PropType包
- ==基础页面结构,很简单==
  ```tsx
    const AreaHeaderV1: React.FC<IProps> = (props) => {
      // 如果没有传值,默认给一些值
      const { title, keywords = [], moreText = "更多", moreLink = "/" } = props

      return (
        <AreaHeaderV1Wrapper className="sprite_02">
          <div className="left">
            <h3 className="title">{title}</h3>
            <div className="keywords">
              {/* 如果keywords为空数组,map不会执行内部的回调函数 */}
              {keywords.map((item) => {
                return (
                  <div className="item" key={item}>
                    <span className="link">{item}</span>
                    <span className="divider">|</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="right">
            <Link className="more" to={moreLink}>
              {moreText}
            </Link>
            <i className="icon sprite_02"></i>
          </div>
        </AreaHeaderV1Wrapper>
      )
    }
  ```
  > 1.图标部分都是精灵图,来自同一张sprite_02
  > 2.跳转页面使用Link,跳转注册过的路由页面
#### 推荐内容(通用)
- 1.网络数据请求: 接口`/personalized`,在service + store中配置请求,在recommend/index.tsx中派发数据,在hot-recommend中获取store数据,所有流程很简单,可参考banner数据请求,代码略
- 2.封装内容区域通用组件`/components/song-menu-item`,也没有任何难度,精灵图用的比较多,接受参数itemData,为hotRecommend返回数组的单项item,在hot-recommend中引入通用组件并父传子即可(代码略)
- 下面是song-menu-item的基本结构
  ```tsx
    <MenuItemWrapper className="SongMenuItem">
      <div className="top">
        {/* 小细节: MenuItem动态请求图片的大小,小图片减少请求和渲染压力 */}
        <img src={getImageSize(itemData.picUrl, 140)} alt="" />
        {/* 许多精灵图,包括2个蒙版cover,2个图标icon(耳机/播放) */}
        <div className="cover sprite_cover">
          <div className="info sprite_cover">
            <span>
              <i className="sprite_icon headset"></i>
              {/* 播放量格式化: 大于10万的以万为单位 */}
              <span className="count">{formatCount(itemData.playCount)}</span>
            </span>
            <i className="sprite_icon play"></i>
          </div>
        </div>
      </div>
      <div className="bottom">{itemData.name}</div>
    </MenuItemWrapper>
  ```
- 格式化的操作:`/utils/format`
- ==1.图片大小格式化(对于MenuItem请求图片大小未必一致)==
  ```ts
    export function getImageSize(
      imageUrl: string,
      width: number,
      height: number = width // 大部分图片是正方形,为了方便,如果不传高度,默认宽=高
    ) {
      return imageUrl + `?param=${width}x${height}`
    }
  ```
- 2.播放器格式化
  ```ts
    export function formatCount(count: number) {
      if (count > 100000) {
        return Math.floor(count / 10000) + "万"
      } else {
        return count
      }
    }
  ```
### new-album
- 位置: `/c-cpns/new-album`
- 页面:
  [![pVm7KgK.png](https://s21.ax1x.com/2025/06/27/pVm7KgK.png)](https://imgse.com/i/pVm7KgK)
#### **网络请求整理**
- 新增对新歌单的数据请求(`/albums/newest`),代码略(service+store)
- ==整理recommend系列store的网络请求,使用builder方法如下,代码太繁琐==
  ```ts
    const recommendSlice = createSlice({
      name: "recommend",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
        builder.addCase(fetchBannerDataAction.fulfilled, (state, { payload }) => {
          state.banners = payload.banners
        })
        builder.addCase(fetchBannerDataAction.rejected, (state, action) => {
          console.log("轮播图数据请求失败:", action.error)
        })
        // ===================================
        builder.addCase(
          fetcchHotRecommendAction.fulfilled,
          (state, { payload }) => {
            state.hotRecommends = payload.result
          }
        )
        builder.addCase(fetcchHotRecommendAction.rejected, (state, action) => {
          console.log("热门推荐数据请求失败:", action.error)
        })
        // ===================================
        builder.addCase(fetchNewAlbumAction.fulfilled, (state, { payload }) => {
          state.newAlbum = payload.albums
        })
        builder.addCase(fetchNewAlbumAction.rejected, (state, action) => {
          console.log("新歌单数据请求失败:", action.error)
        })
      },
    })

    // 异步请求数据
    export const fetchBannerDataAction = createAsyncThunk("banners", async () => {
      const res = await getBanners()
      return res // axios封装自带.data
    })

    export const fetcchHotRecommendAction = createAsyncThunk(
      "hotRecommend",
      async () => {
        const res = await getHotRecommend(8)
        return res
      }
    )

    export const fetchNewAlbumAction = createAsyncThunk("newAlbum", async () => {
      const res = await getNewAlbum() // 固定请求12个数据
      return res
    })
  ```
- ==**优化,合并createAsyncThunk + reducer处理异步**==
  ```ts
    const recommendSlice = createSlice({
      name: "recommend",
      initialState,
      reducers: {
        changeBannerAction(state, { payload }) {
          state.banners = payload
        },
        changeRecommendAction(state, { payload }) {
          state.hotRecommends = payload
        },
        changeAlbumAction(state, { payload }) {
          state.newAlbums = payload
        },
      },
    })

    // 合并的异步请求, _代表忽略这个参数,第一个参数是必选参数payload,调用这个函数时传参用的
    // 这么合并也有要求,就是每个网络请求都不需要传递参数,否则还是分开写更好,分别传参更加清晰
    export const fetchRecommendDataAction = createAsyncThunk(
      "fetchData",
      (_, { dispatch }) => {
        getBanners().then((res) => {
          dispatch(changeBannerAction(res.banners))
        })
        getHotRecommend().then((res) => {
          dispatch(changeRecommendAction(res.result))
        })
        getNewAlbum().then((res) => {
          dispatch(changeAlbumAction(res.albums))
        })
      }
    )

    const { changeBannerAction, changeRecommendAction, changeAlbumAction } =
      recommendSlice.actions
    export default recommendSlice.reducer
  ```
  > ==最后记得派发store内执行的函数也要从原来的3个分别派发改为统一一个函数派发(recommend最外层index.tsx)==
  > ==这么合并也有要求,就是每个网络请求都不需要传递参数,否则还是分开写更好,分别传参更加清晰==
  > ==有一个地方需要处理,组件热门推荐只需要前8个数据,但是后端固定请求30个,所以在hot-recommend的相关代码处slice截取一下==
#### 歌单轮播图
- 从store内获取album数据后进行页面构建(固定12条,只用前10条)
- ==轮播共2页,一页五个数据,两次循环,逻辑很简单,本质是数据处理==
  ```tsx
    <div className="banner">
      <Carousel ref={bannerRef} dots={false} speed={1500}>
        {/* 双重遍历,先遍历页,再遍历页内数据 */}
        {[0, 1].map((item) => {
          return (
            // 一页放五个数据,slice截取数据[x,y)
            <div className="album-list">
              {newAlbums.slice(item * 5, (item + 1) * 5).map((album) => {
                return <div>{album.name}</div>
              })}
            </div>
          )
        })}
      </Carousel>
    </div>
  ```
  > 上面是简单示例,之后把album数据传入通用组件,在通用组件内部在对数据进行详细的划分,搭建对应的页面结构
#### 歌单内容(通用)
- ==封装一个通用组件用于处理同样类似的页面结构(`/components/new-album-item`)==
- 1.注意在应用轮播图组件Carousel过程中,注意别人封装组件的特性,有时候css样式加不上去不是你的问题
  ```tsx
    <Carousel ref={bannerRef} dots={false} speed={1500}>
      {/* 双重遍历,先遍历页,再遍历页内数据 */}
      {[0, 1].map((item, index) => {
        return (
          // 一页放五个数据,slice截取数据[x,y)
          <div key={index}>
            {/* Carousel组件内会自动把最外层div附加内联样式,优先级高于外部样式,它会覆盖我们想要的样式
                所以我们外层嵌套一个div,内部是自己样式的div(album-list)*/}
            <div className="album-list">
              {newAlbums.slice(item * 5, (item + 1) * 5).map((album) => {
                return <NewAlbumItem itemData={album} />
              })}
            </div>
          </div>
        )
      })}
    </Carousel>
  ```
- 2.通用组件内部结构,接受album数组单项数据,父传子给itemData
  ```tsx
    <AlbumWrapper>
      <div className="top">
        <img src={getImageSize(itemData.picUrl, 100)} className="img" />
        <i className="cover sprite_cover"></i>
      </div>
      <div className="bottom">
        <div className="name">{itemData.name}</div>
        <div className="artist">{itemData.artist.name}</div>
      </div>
    </AlbumWrapper>
  ```
### top-ranking
- 排行榜: /cpns/top-ranking
- 如图: 
  [![pVm7u36.png](https://s21.ax1x.com/2025/06/27/pVm7u36.png)](https://imgse.com/i/pVm7u36)
#### 结构搭建
- 1.榜单的背景也是个图片,因为它的大小固定,所以css的宽高必须严格规定,代码略
  [![pVm7n9x.png](https://s21.ax1x.com/2025/06/27/pVm7n9x.png)](https://imgse.com/i/pVm7n9x)
- 2.根据榜单id获取对应歌单数据
  - 飙升榜: 19723756
  - 新歌榜: 3779629
  - 原创榜: 2884035
- 3.网络请求`/playlist/detail?id=123456`,==由于需要传递参数id,所以不合并进入fetchRecommendDataAction函数==,另起新的函数`fetchRankingDataAction`,代码略
- ==4.榜单数据请求的思路(recommend的store部分):==
  - 1.分开请求,分开处理(3次)
    - 优点: 数据分离,先请求到先渲染,不会被阻塞
    - 缺点: 无法统一处理,必须分三次处理数据,构建相应的页面
    ```ts
      // 获取榜单的数据,由于需要传递参数,所以不便于合并进入fetchRecommendDataAction
      const rankingIds = [19723756, 3779629, 2884035]
      export const fetchRankingDataAction = createAsyncThunk(
        "rankingData",
        (_, { dispatch }) => {
          for (const id of rankingIds)
            getPlayList(id).then((res) => {
              // 三个数据单独管理,没有前后顺序,不会阻塞
              switch (id) {
                case 19723756:
                  console.log("1")
                  break
                case 3779629:
                  console.log("1")
                  break
                case 2884035:
                  console.log("1")
                  break
              }
            })
        }
      )
    ```
  - 2.统一放入数组 (==选择这个方法==)
    - 优点: 可以统一处理数据,三者数据格式相似,一个for循环兼顾3个榜单的页面构建
    - 缺点: 必须等待所有数据请求到之后再统一渲染
- ==之前做过,按顺序获取保存所有的数据,使用Promise.all==
- ==**重点回忆Promise的用法和类型问题(网络请求课程)**==
  ```ts
    // 获取榜单的数据,由于需要传递参数,所以不便于合并进入fetchRecommendDataAction
    const rankingIds = [19723756, 3779629, 2884035]
    // 回忆重点: new Promise的泛型是必传类型,它指向resolve参数的类型,同时也是then中res的类型
    const promises: Promise<any>[] = []
    export const fetchRankingDataAction = createAsyncThunk(
      "rankingData",
      (_, { dispatch }) => {
        // 按顺序将三个数据全部拿到后放入一个数组
        // 顺序的思考: 单纯for循环只能保证发出网络请求的顺序,但是接受res数据的顺序无法保证,这却决于服务器,网络等条件
        for (const id of rankingIds) {
          promises.push(getPlayList(id))
        }
        // 泛型定义的类型: res为any[]类型; 这里的res是保证顺序的网络请求数组集合
        Promise.all(promises).then((res) => {
          const rankings = res.map((item) => item.playlist)
          dispatch(changeRankingAction(rankings))
        })
      }
    )
  ```
  > 定义的rankings状态和action代码略
#### 排行榜组件
- 获取3个榜单的数据后,封装组件进行数据展示,这次不是通用组件(本地封装`top-ranking-item`)
- 和之前一样获取数组内单项item数据父传子渲染页面,页面结构如下
  ```tsx
    <RankingItemWrapper>
      {/* 榜单头部 */}
      <div className="header">
        <div className="image">
          <img
            className="img"
            src={getImageSize(itemData.coverImgUrl, 80)}
            alt=""
          />
          <a href="" className="sprite_cover"></a>
        </div>
        <div className="info">
          <div className="name">{itemData.name}</div>
          <div>
            <button className="btn play sprite_02"></button>
            <button className="btn favor sprite_02"></button>
          </div>
        </div>
      </div>
      {/* 榜单列表 */}
      <div className="list">
        {tracks.slice(0, 10).map((item: any, index: number) => {
          return (
            <div className="item">
              <div className="index">{index + 1}</div>
              <div className="info">
                <div className="name">{item.name}</div>
                <div className="operate">
                  <button className="btn sprite_02 play"></button>
                  <button className="btn sprite_icon2 add"></button>
                  <button className="btn sprite_02 favor"></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* 榜单底部 */}
      <div className="footer">
        <a href="/discover/ranking">查看全部 &gt;</a>
      </div>
    </RankingItemWrapper>
  ```
#### 右侧区域
- 布局页面的右侧区域,登录,入驻歌手,热门主播榜单等,都是基础的页面搭建,如下
  [![pVnFxUI.png](https://s21.ax1x.com/2025/06/28/pVnFxUI.png)](https://imgse.com/i/pVnFxUI)
- 1.登录区域很简单`/c-cpns/user-login`,代码略
- 2.入驻歌手`settle-singer`
  - 顶部组件封装为通用组件`area-header-v2`,逻辑与v1版本基本一致,代码略
  - 内容区域请求入驻歌手的数据,没有对应接口,用`artist/list`接口代替,代码略
  - 页面结构搭建分为上中下三部分,详细见文件代码,很简单
- 3.热门主播`hot-anchor`
  - 没有合适的接口,直接使用本地的数据`asset/data/local-data.ts`
  - 简单搭建页面,使用通用标题组件V2,代码略
## **歌曲播放**
- ==播放功能的文件位置考量==
  - 播放器在页面底部,由于内部含有过多的逻辑,比如播放的各种设置,歌词等,不适合封装进通用组件,所以在views下新建player文件夹,内部包含所有的播放相关的页面,逻辑代码等
  - 代码位置: `/views/player`
### 播放器搭建
- 播放器: `/app-player-bar`
- 构造如下: ==比较复杂,分多个wrapper,代码略==
  [![pVne5UH.png](https://s21.ax1x.com/2025/06/28/pVne5UH.png)](https://imgse.com/i/pVne5UH)
- 最后,所有的页面都有页面播放器,所以这个组件在App.tsx内应用组件
  ```tsx
    <div className="App">
        {/* 顶部: 一级路由导航 */}
        <AppHeader />
        {/* 懒加载过程中,临时加载显示,可以是字符串,也可以是组件(比如加载页面) */}
        <Suspense fallback="loading....">{useRoutes(routes)}</Suspense>
        {/* 播放器工具栏 */}
        <AppPlayerBar />
        {/* 底部信息栏 */}
        <AppFooter />
    </div>
  ```
### 文件结构
- ==播放歌曲的状态统一由**新的store-reducer管理,名为player**==,而播放器组件app-player-bar仅负责播放音乐,不在此组件内部直接对歌曲进行网络请求
- ==**操作逻辑:**== 之前封装的推荐页面中,有许多歌曲和播放按钮,可以通过给播放按钮设置事件,==向player派发事件+传参,从而获取到当前点击歌曲的信息,然后改变store内的信息==,最后播放器根据store播放新的歌曲
  > 分层结构: 通过redux中介管理歌曲数据后,可以更好的获取数据,对数据分类和处理,比起直接从播放器获取歌曲要简单,容易维护
- 1.在player文件夹新建store,创建新的reducer,==然后导出,在store中注册==
  ```ts
    import { createSlice } from "@reduxjs/toolkit"

    interface IPlayerState {
      currentSong: any
    }

    const initialState: IPlayerState = {
      currentSong: {},
    }

    const playerSlice = createSlice({
      name: "player",
      initialState,
      reducers: {},
    })

    export default playerSlice.reducer
  ```
  ```ts
    // store/idnex.ts
    const store = configureStore({
      reducer: {
        recommend: recommendReducer,
    +   player: playerReducer,
      },
    })
  ```
### 播放歌曲
- 继续在播放器组件内完善功能(app-player-bar)
- ==为了更好的测试,先在store内currentSong内部写死一个歌曲的数据,之后再动态获取,获取歌曲的数据`song/detail?ids=123456`,复制song内数据==
  ```ts
    const { currentSong } = useAppSelector(
      (state) => ({
        currentSong: state.player.currentSong,
      }),
      AppShallowEqual
    )
  ```
- ==**之前小程序学习过,所以理论上不难,逻辑比较复杂,多回忆回忆**==
- 1.获取歌曲的地址,封装一个工具函数utils/handle-player.ts
  ```ts
    // 音乐播放地址的整理
    export function getPlayerUrl(id: number) {
      return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    }
  ```
- 2.音乐播放由audio控制,html5新的媒体播放标签
  ```tsx
    {/* <audio>是用于嵌入音频内容的原生标签，属于 HTML5 新增的多媒体元素 */}
    <audio ref={audioRef} />
  ```
- 3.获取audio的dom实例后,设置属性,播放歌曲
- ==注意浏览器对于自动播放音乐的特性==
  ```ts
    const audioRef = useRef<HTMLAudioElement>(null)
    /** 组件内副作用操作 */
    useEffect(() => {
      // 1.音乐播放,audioRef一定有值,effect在dom挂载结束后才执行 (非空断言!)
      audioRef.current!.src = getPlayerUrl(currentSong.id)
      // 2.播放音乐,play()函数会返回promise函数,可以监听播放情况
      // 特性: 浏览器禁止在用户刚进入页面,且在没有任何操作的情况下自动播放音乐
      // 不过这个地方的代码也有用,比如后续切换歌曲的时候还是要播放的,这时可以执行play()
      audioRef
        .current!.play()
        .then((res) => {
          console.log("播放歌曲成功", res)
          setIsPlaying(true)
        })
        .catch((err) => {
          console.log("播放歌曲失败", err)
          setIsPlaying(false) // 严谨性: 只要是播放失败的歌曲一律暂停
        })
    }, [currentSong]) // currentSong改变时(切换歌曲),重新执行一次里面的代码,播放新歌曲
  ```
- 4.通过控制按钮进行音乐播放,绑定html略
- ==**关键点**==
  - 1.setIsPlaying是异步的,所以顺序很重要
  - 2.传递isPlaying属性,在ts情况下需要类型定义
  ```ts
    const [isPlaying, setIsPlaying] = useState(false) // 播放器状态

    /** 组件内部的事件处理函数 */
    // 点击播放按钮
    function handlePlayBtnClick() {
      // 1.控制音乐的播放与暂停
      // 顺序上(1->2)防止异步问题,因为setIsPlaying操作是异步的,不会立马改变isPlaying的值
      // 如果按钮是播放的,立即停止,并改变isPlaying为false; 如果按钮是暂停的,立即播放,并改变isPlaying为true
      isPlaying
        ? audioRef.current?.pause()
        : audioRef.current?.play().catch(() => setIsPlaying(false)) // 严谨性: 只要是播放失败的歌曲一律暂停
      // 2.改变播放按钮的状态
      setIsPlaying(!isPlaying)
    }
  ```
  ```tsx
    {/* 左侧播放按钮 */}
    <BarControl $isPlaying={isPlaying}></BarControl>
  ```
  ```ts
    // ts的css传递js变量需要规定类型
    interface IBarControl {
      $isPlaying: boolean
    }
    // 下面本质是在进行函数调用,所以可以传递泛型来确定接受的参数的类型
    export const BarControl = styled.div<IBarControl>`
      .play {
        width: 36px;
        height: 36px;
        margin: 0 8px;
        /* 按钮定位改变显示"播放"与"暂停"的图标 */
        background-position: 0
          ${(props) => (props.$isPlaying ? "-165px" : "-204px")};
      }
    `
  ```
- 5.音乐播放进度条滚动
- 首先监听音乐是否在播放
  ```ts
    const [process, setProcess] = useState(0) // 播放进度条
    const [duration, setDuration] = useState(0) // 歌曲总时间

    {/* 
      onTimeUpdate: 媒体播放时,执行回调函数
    */}
    <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
  ```
- 进度条播放时,更新百分比,这里的格式和组件Slider要求有关系
  ```ts
    // 音乐播放进度条的更新
    function handleTimeUpdate() {
      // 1.获取当前的播放时间和总时间(网易云给的总时间是毫秒,audio获取的时间单位是秒)
      const currentTime = audioRef.current!.currentTime * 1000
      // 2.计算当前歌曲的进度
      const progress = ((currentTime) / duration) * 100
      setProcess(progress)
    }
  ```
- 总时间duration的获取,实在effect内部获取的,一旦请求到歌曲,立即从歌曲信息中获取到歌曲的总时间
  ```ts
    // 获取音乐的总时间
    setDuration(currentSong.dt)
  ```
- 最后给组件设置属性
  ```tsx
    {/* 播放进度条,antd组件 */}
    {/* 属性介绍: 
        value: 百分比推动进度条的位置(类似50%),传入的值不能是0.5,而是50
        step: 步长,默认为1,即改变1%进度条移动一次
        tooltip: 删除进度条上的默认提示
        onChangeComplete: 鼠标抬起触发,把当前值作为参数传入,即点击进度条抬起鼠标后,自动把点击位置的百分比信息传入参数
    */}
    <Slider
      value={process}
      step={0.5}
      tooltip={{ formatter: null }}
      onChangeComplete = {handleSliderChange}
    />
  ```
- 6.格式化歌曲的播放时间`utils/format`
  ```ts
    // 格式化播放歌曲时间
    export function formatTime(time: number) {
      // 1.毫秒转为秒
      const timeSeconds = time / 1000

      // 2.获取分钟/秒钟
      // 向下取整 例如: 100/60 = 1分钟余40秒
      const minutes = Math.floor(timeSeconds / 60)
      // 毫秒转秒可能会有小数,向下取整删除额外的小数点
      const seconds = Math.floor(timeSeconds % 60)

      // 3.格式化 MM:SS,数字不足0补位(ES6-ES12的语法...)
      const formatMinutes = String(minutes).padStart(2, "0")
      const formatSeconds = String(seconds).padStart(2, "0")

      return `${formatMinutes}:${formatSeconds}`
    }
  ```
- 格式化总时间duration和当前时间currentTime,duration设置过状态了
  ```ts
    const [currentTime, setCurrentTIme] = useState(0) // 歌曲的当前时间
    // 音乐播放进度条的更新
    function handleTimeUpdate() {
      // ....
      setCurrentTIme(currentTime * 1000) // 记录当前时间,一会格式化为歌曲时间,统一单位为毫秒
    }
  ```
  ```tsx
    <div className="time">
      <span className="current">{formatTime(currentTime)}</span>
      <span className="divider">/</span>
      <span className="duration">{formatTime(duration)}</span>
    </div>
  ```
### 进度条控制
- ==进度条控制分为点击和拖拽两种,antd更新了函数,现在点击和拖拽可以由同一个函数onChange控制了,更加方便==
  ```tsx
    {/* 属性介绍: 
        onChange: 当 Slider 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入, 无论拖拽和点击都会改变Slider的值,所以都会触发
        onChangeComplete: 与mouseup和keyup触发时机一致，把当前值作为参数传入, 即当用户拖动滑块并释放鼠标时触发，此时返回的value是最终位置的百分比
    */}
    <Slider
      onChangeComplete={handleSliderChangeComplete}
      onChange={handleSliderChange}
    />
  ```
  ```ts
    /** 经测试,onChange功能无论拖拽还是点击都能完美执行功能,涵盖onChangeComplete功能,所以只用3即可 */
    // 3.点击音乐进度条都会触发(例如50)
    function handleSliderChange(value: number) {
      // 1.获取点击位置的时间
      const currentTime = (value / 100) * duration
      // 2.设置当前播放器的时间audio (接受单位秒,而上面计算时duration单位为毫秒,统一下单位)
      audioRef.current!.currentTime = currentTime / 1000
      // 3.修改currentTime和progress,立即改变进度条,其实不改在handleTimeUpdate函数内也会修改currentTime,只不过需要等待audio播放1s去触发
      setCurrentTime(currentTime)
      setProcess(value)
    }

    // 4.拖拽进度条鼠标抬起时触发,接受当前位置的进度条参数 (测试)
    function handleSliderChangeComplete(value: number) {
      console.log(value)
    }
  ```
### 歌词数据整理
- 为了更好的模拟网络请求,封装请求歌曲信息的网络请求函数,参数为id
  ```ts
    // 获取歌曲信息
    export function getSongDetail(ids: number) {
      return hyRequest1.get({
        url: "/song/detail",
        params: {
          ids,
        },
      })
    }
  ```
  > 在App.tsx直接传入id请求,先这样临时做,代码略 (id: 2711834126)
- 请求歌词的网络请求,参数也是id
  ```ts
    // 获取歌词信息
    export function getSongLyric(id: number) {
      return hyRequest1.get({
        url: "/lyric",
        params: {
          id,
        },
      })
    }
  ```
- 在store中,处理歌词的异步数据
  ```ts
    export const fetchCurrentSongAction = createAsyncThunk(
      "currentSong",
      (id: number, { dispatch }) => {
        // 1.获取歌曲信息
        getSongDetail(id).then((res) => {
          if (!res.songs.length) return
          const song = res.songs[0]
          // 将歌曲信息保存进store
          dispatch(changeCurrentSongAction(song))
        })

        // 2.获取歌词数据
        getSongLyric(id).then((res) => {
          if (!res.lrc.lyric) return
          const lyricString = res.lrc.lyric // 字符串

          // 解析歌词,封装为工具函数 /utils/parse-lyric.ts
          const lyrics = parseLyric(lyricString)

          // 将歌词保存进入store中
          dispatch(changeLyricsAction(lyrics))
        })
      }
    )

    interface ILyric {
      time: number
      text: string
    }

    interface IPlayerState {
      currentSong: any
  +   lyrics: ILyric[]
    }

    const initialState: IPlayerState = {
    // 自带默认值,防止进入页面数据还未请求到时出现页面显示缺失,网易云会把最后听的歌曲信息保存在本地,然后下次进入后,优先从本地获取歌曲数据先顶替显示
    currentSong: {
      // ... 2709792992
    },
    lyrics: [], // 保存解析过的歌词数据
  }
  ```
- 歌词整理工具函数
  ```ts
    // utils/parse-lyric
    interface ILyric {
      time: number
      text: string
    }

    // 匹配-正则表达式
    const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
    export function parseLyric(lyricString: string) {
      // 将解析好的歌词放入数组并返回出去
      const lyrics: ILyric[] = []
      // 1.歌词以\n分割,把整体字符串切割为一句一句的歌词数组
      const lines: string[] = lyricString.split("\n")
      // 2.把每句歌词解析为格式正确的对象
      /**  匹配效果如下:
      *  "[02:01.95]还有糖纸染上的香" ==> { time: xxx, text: "xxx" } (数组lyrics中的某一项item)
      */
      for (const line of lines) {
        // 匹配歌词时间 可以打印看看res的结构
        const res = timeRegExp.exec(line)
        if (!res) continue

        // 2.获取每一组的时间部分数据, 例如: 04 24 890 代表分,秒,毫秒 (统一转为毫秒)
        const time1 = Number(res[1]) * 60 * 1000
        const time2 = Number(res[2]) * 1000
        // 如果毫秒数为2位,例如:04 24 89,这个89代表890ms而不是89ms,所以乘10
        const time3 = res[3].length === 3 ? Number(res[3]) : Number(res[3]) * 10
        const time = time1 + time2 + time3

        // 3.获取每一组的文本数据
        // 可以传入正则表达式,把时间部分替换为空字符串,剩下的不就是歌词数据了吗
        const text = line.replace(timeRegExp, "")

        // 4.把整理好的一组数据(时间+文本)放入数组lyrics
        lyrics.push({ time, text })
      }

      return lyrics
    }
  ```
- 歌词数据整理的最终效果: (==最终数据保存进入store中==)
  000000000000000

### 歌词匹配
- ==上一步把歌词数据整理好存入store中,这一步拿取保存好的歌词数据,然后利用算法,根据当前歌曲的播放时间匹配这段时间的歌词数据==
- 在播放器组件app-player-bar内
  ```ts
    // 音乐播放进度条的更新
    function handleTimeUpdate() {
      // 1.获取当前的播放时间和总时间(网易云给的总时间是毫秒,audio获取的时间单位是秒)
      // 2.计算当前歌曲的进度 ......

      // 3.根据当前时间匹配当前的歌词数据
      let index = lyrics.length - 1 // 默认最后一句歌词,下面算法除了最后一句歌词都能匹配到
      for (let i = 0; i < lyrics.length; i++) {
        const lyric = lyrics[i]
        if (lyric.time > currentTime) {
          index = i - 1
          break
        }
      }

      // 4.匹配成功后,保存歌词序列,同时减少多余的匹配操作,每句歌词只会匹配一次
      if (lyricIndex === index || index === -1) return
      dispatch(changeLyricIndexAction(index))
    }
  ```
  > 新的store的state和保存它的函数action代码省略
- 歌词显示message,注意react19兼容问题,依照文档改即可
.... (待解决)

### 歌曲播放列表
- 在store内新增播放列表和播放歌曲索引的状态管理
  ```ts
    interface IPlayerState {
      // ......
      playSongList: any[] 
      playSongIndex: number
    }
  ```
  > 状态就不写了,songlist默认给了2个歌曲的全部信息; songindex默认值为-1(代表当前播放歌曲在列表中的索引序号)
- 重构请求歌曲的逻辑
  ```ts
    // (记住即可,类型问题)类型定义的参数: 第一个是函数, 第二个是传递参数的类型, 第三个是给getState定义类型,默认unknow
    // IRootState是统一的store导出的类型
    export const fetchCurrentSongAction = createAsyncThunk<
      void,
      number,
      { state: IRootState }
    >("currentSong", (id: number, { dispatch, getState }) => {
      // 补: 从播放列表中尝试获取这首歌
      const playSongList = getState().player.playSongList
      const findIndex = playSongList.findIndex((item) => item.id === id)
      if (findIndex === -1) {
        console.log("没找到歌曲")
        // 1.获取歌曲信息
        getSongDetail(id).then((res) => {
          if (!res.songs.length) return
          const song = res.songs[0]
          // 2.没有歌曲就添加进歌单 (末尾添加)
          const newPlaySongList = [...playSongList]
          newPlaySongList.push(song)
          dispatch(changeCurrentSongAction(song))
          dispatch(changeplaySongListAction(newPlaySongList))
          dispatch(changeplaySongIndexAction(newPlaySongList.length - 1))
        })
      } else {
        // 找到歌曲
        const song = playSongList[findIndex]
        dispatch(changeCurrentSongAction(song))
        dispatch(changeplaySongIndexAction(findIndex))
      }
  ```
  > ==简而言之就是,如果当前播放歌曲在播放列表中有保存,直接在store提取即可; 如果没有保存,那么网络请求歌曲的信息,并保存进播放列表; 与此同时同步currentSong,playSongList和playSongIndex的这三个状态的值==
  > 对应的action就不写了,就是简单的payload的赋值
  > 最后关于createAsyncThunk的泛型类型定义可以看看.d.ts文档,有点绕
- 最后效果图如下: 当前听的歌曲正好是列表中没有的,所以这首新歌会被添加到store中,如下图
  000000000000
- ==为了更多地添加播放列表中的数据,在top-ranking-item中的播放按钮设置事件==
  ```tsx
    {/* 别找错了,是列表中的小项 (slice map内部的那些元素) */}
    <button
      className="btn sprite_02 play"
      onClick={() => handlePlayClick(item.id)}
    ></button>
  ```
  ```ts
    const dispatch = useAppDispatch()
    // 播放歌曲
    function handlePlayClick(id: number) {
      dispatch(fetchCurrentSongAction(id))
    }
  ```
  > 在排行榜中,点击歌曲的播放按钮,就会执行添加歌曲的函数
### 播放模式
- 继续新增播放模式的状态控制
  ```ts
    playMode: 1, // 1: 顺序播放 2: 随机播放 3: 单曲循环
  ```
- 点击切换播放模式
  ```ts
    // 5.改变播放模式
    function onChangePlayMode() {
      let newPlayMode = playMode + 1
      // playMode = 1/2/3
      if (newPlayMode > 3) newPlayMode = 1
      dispatch(changeplayModeAction(newPlayMode))
    }
  ```
  ```tsx
    <button
      className="btn sprite_playbar loop"
      onClick={onChangePlayMode}
    ></button>
  ```
  ```ts
  .loop {
      background-position: ${(props) => {
        switch (props.$playMode) {
          case 1:
            return "-3px -344px"
          case 2:
            return "-66px -248px"
          case 3:
            return "-66px -344px"
        }
      }};
    }
  ```
### 播放测试
- store内针对三种不同的播放模式制定不同切换歌曲代码,==使用新的异步函数处理==
  ```ts
    // * 处理歌曲播放模式的异步函数
    export const changeMusicAction = createAsyncThunk<void, boolean, IThunkState>(
      "changeMusic",
      (isNext, { dispatch, getState }) => {
        // 1.获取state中的值
        const player = getState().player
        const songList = player.playSongList
        const songIndex = player.playSongIndex
        const playMode = player.playMode

        // 2.根据不同的切换模式切换歌曲索引
        let newIndex = songIndex
        if (playMode === 2) {
          // 随机模式 (防止随机到自己)
          let tempIndex = Math.floor(Math.random() * songList.length)
          while (tempIndex === newIndex) {
            tempIndex = Math.floor(Math.random() * songList.length)
          }
          newIndex = tempIndex
        } else {
          // 顺序模式和循环模式 (循环模式仅指歌曲循环,但是在切换模式上还是按照顺序来)
          newIndex = isNext ? newIndex + 1 : newIndex - 1
          // 处理越界问题
          if (newIndex > songList.length - 1) newIndex = 0
          if (newIndex < 0) newIndex = songList.length - 1
        }

        // 3.获取到当前歌曲
        const song = songList[newIndex]
        dispatch(changeCurrentSongAction(song))
        dispatch(changeplaySongIndexAction(newIndex))

        // 4.同理获取新歌的新歌词
        getSongLyric(song.id).then((res) => {
          if (!res.lrc.lyric) return
          const lyricString = res.lrc.lyric // 字符串

          // 解析歌词,封装为工具函数 /utils/parse-lyric.ts
          const lyrics = parseLyric(lyricString)

          // 将歌词保存进入store中
          dispatch(changeLyricsAction(lyrics))
        })
      }
    )
  ```
- 播放器(app-player-bar)按钮设置切换歌曲的事件 (按钮绑定的html不展示了)
  ```ts
    // 6.切换歌曲的函数
    function handleChangeMusic(isNext: boolean) {
      dispatch(changeMusicAction(isNext))
    }
  ```

