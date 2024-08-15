---
title: '什么！一个项目给了8个字体包？？？'
date: '2023-07-04'
tags: ['FE', 'CSS', 'font-family']
draft: false
summary: '了解如何使用 font-family 样式的各种属性来组合需要的字体包。可以按照字体粗细、unicode 等信息来自动选择相应的字体包。'
images: ['/static/images/blog/202307/1-project-8-font/responsive-image.jpg']
authors: ['default']
---

![thumbnail-image](/static/images/blog/202307/1-project-8-font/responsive-image.jpg)

## 🙋 遇到的问题

在一个新项目中，设计统一了项目中所有的字体，并提供了字体包。在项目中需要按需引入这些字体包。

首先，字体包的使用分为了以下几种情况：

1. 无特殊要求的语言使用字体A，阿拉伯语言使用字体B；
2. 加粗、中等、常规、偏细四种样式，AB两种字体分别对应使用 `Bold` 、 `Medium` 、 `Regular` 、 `Thin` 四种字体包；

所以，我现在桌面上摆着 8 个字体包：

- `A-Bold.tff`
- `A-Medium.tff`
- `A-Regular.tff`
- `A-Thin.tff`
- `B-Bold.tff`
- `B-Medium.tff`
- `B-Regular.tff`
- `B-Thin.tff`

不同语言要使用不同的字体包，不同粗细也要使用不同的字体包！

还有一个前提是，设计给的设计图都是以字体A为准，所以在 Figma 中复制出来的 CSS 代码中字体名称都是A。

刚接到这个需求时还是比较懵的，一时想不出来怎么样才能以**最少的逻辑判断**、**最少的文件下载**、**最少的代码改动**去实现在不同情况下自动的去选择对应的字体包。

因为要涉及到语言的判断，最先想到的还是通过 JS，然后去添加相应的类名。但这样也只能判断语言使用A或B，粗细还是解决不了。

看来还是要用 CSS 解决。

首先我将所有的8个字体先定义好：

```css
@font-face {
    font-family: A-Bold;
    src: url('./fonts/A-Bold.ttf');
}

/* ... */

@font-face {
    font-family: B-Thin;
    src: url('./fonts/B-Thin.ttf');
}
```

![Untitled](/static/images/blog/202307/1-project-8-font/Untitled.png)

## 🤲🏼 如何根据粗细程度自动选择对应字体包

有同学可能会问，为什么不直接使用 `font-weight` 来控制粗细而是用不同的字体包呢？

我们来看下面这个例子，我们使用同一个字体， `font-weight` 分别设置为900、500、100，结果我们看到的字体粗细是一样的。

对的，很多**字体不支持** `font-weight` 所以我们需要用不同粗细的字体包。

![Untitled](/static/images/blog/202307/1-project-8-font/Untitled%201.png)

所以，我们可以通过 `@font-face` 中的 `font-weight` 属性来设置字体的宽度：

```css
@font-face {
    font-family: A;
    src: url('./fonts/A-Bold.ttf');
		font-weight: 600;
}
@font-face {
    font-family: A;
    src: url('./fonts/A-Medium.ttf');
		font-weight: 500;
}
@font-face {
    font-family: A;
    src: url('./fonts/A-Regular.ttf');
		font-weight: 400;
}
@font-face {
    font-family: A;
    src: url('./fonts/A-Thin.ttf');
		font-weight: 300;
}
```

注意，这里我们把字体名字都设为相同的，如下图所示，这样我们就成功的解决了第一个问题：不同粗细也要使用不同的字体包；

![Untitled](/static/images/blog/202307/1-project-8-font/Untitled%202.png)

并且，如果我们只是定义而未真正使用时，不会去下载未使用的字体包，再加上字体包的缓存策略，就可以最大程度节省带宽：

![Untitled](/static/images/blog/202307/1-project-8-font/Untitled%203.png)

## 🔤 如何根据不同语言自动选择字体包？

通过张鑫旭的博客找到了解决办法，使用 `unicode-range` 设置字符 unicode 范围，从而自定义字体包。

`unicode-range` 是一个 CSS 属性，用于指定字体文件所支持的 Unicode 字符范围，以便在显示文本时选择适合的字体。

它的语法如下：

```css
@font-face {
  font-family: "Font Name";
  src: url("font.woff2") format("woff2");
  unicode-range: U+0020-007E, U+4E00-9FFF;
}
```

在上述例子中，`unicode-range` 属性指定了字体文件支持的字符范围。使用逗号分隔不同的范围，并使用 `U+XXXX-XXXX` 的形式表示 Unicode 字符代码的范围。

通过设置 `unicode-range` 属性，可以优化字体加载和页面渲染性能，只加载所需的字符范围，减少不必要的网络请求和资源占用。

通过查表得知阿拉伯语的 unicode 的范围为：`U+06??, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+10A60-10A7F, U+10A80-10A9F` 这么几个区间。所以我们设置字体如下，因为设计以 A 字体为准，所以在 Figma 中给出的样式代码字体名均为 A，所以我们把 B 字体的字体名也设置为 A：

![Untitled](/static/images/blog/202307/1-project-8-font/Untitled%204.png)

当使用字体的字符中命中 `unicode-rang` 的范围时，自动下载相应的字体包。

## 总结

遇到的问题：

1. 两种字体，B 字体为阿拉伯语使用，A 字体其他语言使用。根据语言自动选择。
2. 根据字宽自动选择相应的字体包。
3. 可以直接使用 Figma 中生成的样式而不必每次手动改动。
4. 尽可能节省带宽。

我们通过 `font-weight` 解决了问题2，并通过 `unicode-range` 解决了问题1。

并且实现了按需下载相应字体包，不使用时不下载。

Figma 中的代码可以直接复制粘贴，无需任何修改即可根据语言和自宽自动使用相应字体包。

参考资料：[https://www.zhangxinxu.com/wordpress/2016/11/css-unicode-range-character-font-face/](https://www.zhangxinxu.com/wordpress/2016/11/css-unicode-range-character-font-face/)