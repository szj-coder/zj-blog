---
title: 'Next.js 上手指南'
date: '2021-11-02'
tags: ['FE', 'Next.js']
draft: false
summary: 'Next.js v12 快速上手指南～'
authors: ['default']
---

## Next.js 是什么？

NextJs 是一款 React 开发框架，主要关注两点：

- 为生产环境所准备：无需复杂配置即可提供升级环境所需的各种功能
- 提供良好的开发者体验 (DX)

通过 Next.js 框架开发的 React 应用无需配置就可以如服务端渲染 SSR、编译时渲染 SSG，Typescript 语言支持，自动打包，路由愈加载等功能。

## Next.js 功能

我们先看 Next.js 为生产环境 React 应用准备的功能特性

### Page 路由

通过 Next.js 初始化 React 应用后，Next.Js 会自动将 `pages` 目录的每个组件渲染成一个页面，并自动设置好路由：在 `pages` 目录新建 `about.js`

```tsx
// pages/about.js
export default function About() {
  return <div>About: </div>
}
```

```txt
pages
.
├── _app.js
├── about.js
├── api
│   └── hello.js
└── index.js
```

启动应用后，即可以通过 `http://localhost:3000/about` 访问到 `about` 页面了。​
同时 Next.js 还支持页面的动态路由，比如在 `pages` 目录建立文件 `posts/[id].js` ，Next.js 就会自动将如 `/post/1`、 `/post/2` 的请求路由到这个组件上

```tsx
// pages/posts/[id].js
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const { id } = router.query
  return (
    <div>
      Post
      <div>id: {id}</div>
    </div>
  )
}
```

此时，请求如 `http://localhost:3000/posts/1` 、` http://localhost:3000/posts/2` 就会路由到改组件中，同时可以看到，可以通过 `router` 获取到路由参数

### 预渲染

出了客户端渲染外，Next.js 支持两种形式的预渲染：

- 基于编译时的静态渲染
- 服务端渲染 SSR
  在同一个 Next.Js 应用中可以同时混用两种预渲染方式，即部分页面使用静态渲染，部分页面使用 SSR。

#### 静态渲染 SSG

静态渲染，即在编译时，将页面渲染成 HTML 静态文件，这些静态文件可以放到 CDN 上。另外通过 Next.js 静态渲染的页面可以不使用数据，也可以使用数据。不使用情况的例子，如前文中的 `about.js` , 在 `build` 之后可以看到 `about.html` 中已经渲染的 HTML：

```html
<body>
  <div id="__next"><div>About:</div></div>
  <script id="__NEXT_DATA__" type="application/json">
    {
      "props": { "pageProps": {} },
      "page": "/about",
      "query": {},
      "buildId": "Dc_JKg47EiBrN8BG0Me-S",
      "nextExport": true,
      "autoExport": true,
      "isFallback": false,
      "scriptLoader": []
    }
  </script>
</body>
```

另外，Next.js 的静态渲染是支持使用数据的这里在 `pages` 下新建 `ssg.jsNext.js` 通过函数 `getStaticProps` 来允许组件在预渲染的时候获取外部数据，比如这里我们通过通过异步请求获取当前时间，然后把时间做为 `props` 传递给组件

```tsx
export async function getStaticProps() {
  const now = new Date().toLocaleTimeString()
  const res = await fetch(`https://postman-echo.com/get?now=${now}`)
  const obj = await res.json()
  return {
    props: {
      now: obj.args.now,
    },
  }
}

export default function SSG({ now }) {
  return <div>SSG: {now}</div>
}
```

在 build 后，可以看到，生成的 `ssg.html` 中已经包含了时间：

```html
<body>
  <div id="__next">
    <div>
      SSR:
      <!-- -->6:21:06 PM
    </div>
  </div>
  <script id="__NEXT_DATA__" type="application/json">
    {
      "props": { "pageProps": { "now": "6:21:06 PM" }, "__N_SSG": true },
      "page": "/ssg",
      "query": {},
      "buildId": "PQ7ze9KG5oMk09L5idTqy",
      "isFallback": false,
      "gsp": true,
      "scriptLoader": []
    }
  </script>
</body>
```

在使用了动态路由的时候，情况就复杂一点，在预渲染的时候，需要首先确定动态路由的参数。比如上文中的 `posts/[id].js` 组件，这里我们需要通过 `postId` 来获取 `post` 的详情数据，Next.js 提供了 `getStaticProps` 和 `getStaticPaths`。

- `getStaticPaths` ：通过 `getStaticPaths` 返回的 paths 数组，Next.Js 可以在编译时确定动态路由的值，即这里每一个 `post` 的 `id` 就是一个路由参数 id 的值，这样，在编译的时候，Next.js 通过 `getStaticPaths` 就可以判断出 `posts/[id].js` 的所有可能的页面路由。

```tsx
export async function getStaticPaths() {
  const res = await fetch('https://my-json-server.typicode.com/typicode/demo/posts')
  const posts = await res.json()
  const paths = posts.map((post) => ({ params: { id: `${post.id}` } }))

  return {
    paths,
    fallback: false,
  }
}
```

在具体渲染一个 `post` 页面时，还需要 `getStaticProps` 函数来来将获取的数据作为 `props` 传递给组件

```tsx
export async function getStaticProps({ params }) {
  const res = await fetch(`https://my-json-server.typicode.com/typicode/demo/posts/${params.id}`)
  const post = await res.json()

  return {
    props: { post },
  }
}
```

最后是组件的实现

```tsx
export default function Post({ post }) {
  return (
    <div>
      Post
      <div>id: {post.id}</div>
      <div>title: {post.title}</div>
    </div>
  )
}
```

#### 服务端渲染 SSR

Page 页面也可以选择使用 SSR 来做预渲染，通过在 `page` 组件中实现 `getServerSideProps` 即可：

```tsx
// pages/status.js
export async function getServerSideProps() {
  const now = new Date().toLocaleTimeString()
  const res = await fetch(`https://postman-echo.com/get?now=${now}`)
  const obj = await res.json()
  return {
    props: {
      now: obj.args.now,
    },
  }
}
export default function Status({ now }) {
  return <div>Status: {now}</div>
}
```

可以对比上文的 ssg 页面和这里的 ssr 页面，可以看到，ssg 页面在多次请求刷新前后显示的时间不会变化，而 ssr 页面在每次刷新都会显示新的时间。

#### Hybird 混合端渲染

Next.js 支持部分 SSG 和 SSR 的混合使用，即部分页面使用 SSG、部分页面使用 SSR。

### API 路由

如 Pages 功能一样，Next.js 支持服务端 API 的自动支持，在 Next.js 项目中，在 `pages/api` 目录下每一个文件会自动注册成功一个 API 访问点。

```js
// pages/api/user.js
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

启动就可以通过 `/api/user` 来请求这个接口了

## 总结

总体来说，Next.js 可以说是 `create-react-app` 的一个进阶版本，即它除了帮你快速的创建 React 应用外，还支持很多无需复杂配置的功能，包括路由和各种场景的预渲染，来满足生产环境所需。
