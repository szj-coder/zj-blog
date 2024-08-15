---
title: 'deno 快速上手 - Hello World 案例'
date: '2020-11-09 14:08:05'
tags: ['FE', 'deno']
draft: false
summary: '通过一个 Hello World 案例快速上手 deno 开发'
authors: ['default']
---

## 1. 安装

> 通过单行命令将 Deno 安装到系统中（国内加速）
> 安装内容转载自 [Deno 中文社区](https://x.deno.js.cn/)

#### 安装最新版：

使用 Shell:

```shell
curl -fsSL https://x.deno.js.cn/install.sh | sh
```

使用 PowerShell:

```shell
iwr https://x.deno.js.cn/install.ps1 -useb | iex
```

#### 安装某个特定版本：

使用 Shell:

```shell
curl -fsSL https://x.deno.js.cn/install.sh | sh -s v1.0.0
```

使用 PowerShell:

```shell
$v="1.0.0"; iwr https://x.deno.js.cn/install.ps1 -useb | iex
```

#### 使用包管理器：

使用 Scoop:

```shell
scoop install deno
```

使用 Homebrew:

```shell
brew install deno
```

使用 Chocolatey:

```shell
choco install deno
```

#### 使用多版本管理工具

使用 Yay (AUR) (deno 和 deno-bin):

```shell
# From source
yay -S deno
# Pre-compiled
yay -S deno-bin
```

使用 asdf 和 asdf-deno:

```shell
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git

asdf install deno 1.0.0

# Activate globally with:
asdf global deno 1.0.0

# Activate locally in the current folder with:
asdf local deno 1.0.0
```

使用 Scoop:

```shell
# 安装某个特定版本的 Deno：
scoop install deno@1.0.0

# 切换到 v1.0.0
scoop reset deno@1.0.0

#切换到最新版
scoop reset deno
```

## 2. Hello World

新建一个 `demo.ts` 并输入 `console.log('Hello Wrold!')`；
打开 git 或 cmd，输入`deno run ./demo.ts`，就可以看到打印的结果了：
![](/static/images/blog/202011/Started_quickly_deno/img1.png)

## 3. HTTP 请求

在 deno 中比较推荐使用 fetch 来发送 HTTP
请求，

```js
const res = await fetch('http://8jsj.cn')
const body = new Uint8Array(await res.arrayBuffer())
await Deno.stdout.write(body)
```

接收到响应之后通过 `new Uint8Array()` 将其转换为一个 [Unit8Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 存到 body 变量中。最后一句代码则是把 body 的内容写入标准输出流 stdout。

运行 `deno run demo.ts`，发现会报如下错误：

```shell
error: Uncaught (in promise) PermissionDenied: network access to "http://8jsj.cn/", run again with the --allow-net flag
    at processResponse (core.js:224:13)
    at Object.jsonOpAsync (core.js:242:12)
    at async fetch (deno:op_crates/fetch/26_fetch.js:1274:29)
    at async file:///C:/Users/JIGUANG/Desktop/demo.ts:1:13
```

这是因为 Deno 默认使用安全环境来执行代码，所以我们的请求不被允许，我们需要 `--allow-net` 来授权网络访问：

```shell
deno run --allow-net=8jsj.cn demo.ts
```

![](/static/images/blog/202011/Started_quickly_deno/img2.png)

## 4. 读取文件

对于文件的读取我们可以使用 Deno 的内置 API `Deno.readFile` 来进行：

```js
const decoder = new TextDecoder('utf-8')
const data = await Deno.readFile('hello.txt')
console.log(decoder.decode(data))
```

同样在读取文件时我们也需要授权，我们可以使用 `allow-read` ：

```shell
deno run --allow-read=hello.txt demo.ts
```

![](/static/images/blog/202011/Started_quickly_deno/img3.png)
