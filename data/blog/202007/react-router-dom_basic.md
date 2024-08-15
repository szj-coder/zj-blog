---
title: 'react-router-dom 路由基础教程'
date: '2020-07-26 22:49:19'
tags: ['FE', 'React', 'react-router-dom']
draft: false
summary: 'react-router-dom 路由基础教程'
authors: ['default']
---

## 一、安装

```shell
yarn add react-router-dom
```

根组件index.js

使用 Router 组件包裹根节点来实现全局的路由访问。

```tsx
import { BrowserRouter as Router } from 'react-router-dom'

;<Router>
  <App />
</Router>
```

结构有 `BrowserRouter` 和 `HashRouter` 两种模式，分别对应 `VUE-router` 的 `mode: history` 和 `mode: hash` 两种模式。

注意：一定要使用 BrowserRouter 或 HashRouter 作为祖先组件包裹我们的根组件！

## 二、使用

使用 Route 组件来完成路由，类似于 Vue-router 的 `<router-view></router-view>` 标签。

```tsx
import { Route } from 'react-router-dom'

;<Route path="/tv" component={TV} />
```

匹配方式：
**不精准匹配**：这种情况下如果地址栏输入 `/tv` 则 `/` 和 `/tv` 都会匹配：

```tsx
<Route path='/tv' component={TV} />
<Route path='/' component={Movie} />
```

**精准匹配**：

方法1：在标签中加上 `exact` 属性：

```tsx
<Route path="/" exact component={Movie} />
```

方法2：使用 Switch：

```tsx
import { Switch } from 'react-router-dom'

;<Switch>
  <Route path="/tv" component={TV} />
  <Route path="/" component={Movie} />
</Switch>
```

注意：使用 Switch 时将一般路由写在最下，特殊路由写在上面。否则可能会匹配到普通路由上。

## 三、路由导航

`react-router-dom` 的路由导航分为组件式导航和编程式导航。顾名思义，组件式导航即通过组件进行导航完成路由的跳转，编程式导航就是在我们的逻辑代码内控制路由进行跳转，加下来分别介绍一下两种导航。

### 1、组件式导航：

使用 Link 标签进行跳转：

```tsx
<Link to='/movie'>电影</Link>
<Link to='/tv'>电视剧</Link>

<Route path='/tv' component={TV} />
<Route path='/movie' component={Movie} />
```

其实就是在页面内加入了一个a标签。但是经过实验，我们直接写 a 标签的话也可以跳转，但会有延迟，不如由 Link 为我们生成的 a 标签跳转速度快。通过 devtools 可以发现，结构上写法上没有任何区别，但由 Link 生成的 a 标签不会发生页面跳转，只会DOM操作。

```tsx
<a href="/tv">电视剧</a>
```

**路由高亮**：

使用 NavLink 标签

```tsx
import { NavLink } from 'react-router-dom'
import './style.css'

<NavLink activeClassName='active' to='/movie'>电影</NavLink></li>
```

**路由重定向**：

使用 Redirect 标签，一般配合 Switch 一块使用。

```tsx
import { Redirect } from 'react-router-dom'

;<Redirect from="/" to="/movie" />
```

`Redirect` 标签一样属于普通路由，要放在特殊路由下边。

`from` 和 `to` 表示当路由匹配到 `/` 时重定向到 `/movie`。

### 2、编程式导航：

在组件实例中， React-router-dom 自动帮我们在 props 中绑定了 history、location、match 三个对象，这样我们进行路由跳转就特别方便了。如果你熟悉 Vue-router 的话你会发现语法几乎一样。

- history：主要包括路由跳转函数。
- location：主要包含路径信息，类似于 Vue-router 的 $route。
  其中的 state 属性包含上一个路由传递过来的参数。

- match：主要使用其中的 params 获取动态路由的信息。

![](/static/images/blog/202007/react-router-dom_basic/img1.png)

跳转到某个路由：

```ts
this.props.history.push('/...')
```

## 四、路由传参

### 1、query传参：

与 `Vue-router` 不同，`react-router-dom` 不会主动将 `query` 帮我们解析成对象，如果使用 `query` 进行传参的话我们需要自己去解析。

可以在 `props/history/location/search` 中拿到完整的 `query` 字符串。

![](/static/images/blog/202007/react-router-dom_basic/img2.png)

### 2、动态路由传参：

在路由中设置动态路由，比如动态的 `id`，在 Movie 组件实例内 `props/match/params` 中可以拿到 id。

```tsx
<Route path="/movie/:id" component={Movie} />
```

![](/static/images/blog/202007/react-router-dom_basic/img3.png)

### 3、路由跳转时传参：

路由跳转时，可在 push 的第二个参数处传一个对象，我们在 `/tv` 组件实例上 `props/location/state` 上就可以拿到这个对象了：

```ts
this.props.history.push('/tv', { name: 'zhangsan' })
```

![](/static/images/blog/202007/react-router-dom_basic/img4.png)

## 五、子路由

在 `react-router-dom` 中没有很强的子路由的概念，所谓的子路由其实是由路由的嵌套来实现的，比如，我在 `/movie` 路由渲染的组件为 Movie 组件，我们继续在 Movie 组件中插入路由，并且路径设置为 `/movie/jingsong` ，就可以实现类似于子路由的效果。

```tsx
<Route path="/movie" component={Movie} />
```

Movie组件：

```tsx
<Route path="/movie/jingsong" component={Jingsong}></Route>
```

​
