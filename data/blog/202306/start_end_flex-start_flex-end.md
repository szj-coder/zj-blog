---
title: 'flex 布局中 start/end 和 flex-start/flex-end 的区别'
date: '2023-06-05'
tags: ['CSS', 'flex']
draft: false
summary: 'flex 布局中 start/end 和 flex-start/flex-end 的区别'
images: ['/static/images/blog/202306/start_end_flex-start_flex-end/lock.jpg']
authors: ['default']
---

![thumbnail-image](/static/images/blog/202306/start_end_flex-start_flex-end/lock.jpg)


在 flex 布局中，最常用的 css 属性非 `justify-*` 和 `align-*` 莫属了。使用这两种属性是，属性值经常会使用到 `start` `end` 和 `flex-start` `flex-end`，那么他们到底有什么区别呢？

## MDN

首先祭上MDN的答案，但是好像看不出什么区别：

![Untitled](/static/images/blog/202306/start_end_flex-start_flex-end/Untitled.png)

但是在使用 `post-css` 插件时会对 `start`和`end` 进行弹出警告：

![Untitled](/static/images/blog/202306/start_end_flex-start_flex-end/Untitled%201.png)

## W3C

虽然定义上会有区别，但是实际使用中并没有什么区别。并且在最新的[W3C规范[TR]](https://link.segmentfault.com/?enc=PgXJu949Pr71%2FPeaI7T0yw%3D%3D.wMYAD1Jm3Nbjf18Ihn4i4%2FRnWrjGBujjMNGaiuODA%2BJLzckoIq5NEF5eMEhDtWA4g%2BTpzf6%2B1sN72Sxei4xXkg%3D%3D)当中 `start` 和 `end` 并没有出现在 `justify-content` 的可选值内。所以 `post-css` 会出现告警。

![Untitled](/static/images/blog/202306/start_end_flex-start_flex-end/Untitled%202.png)

在早期版本的草案([1])当中有这俩值，后续被废弃了([2])，并且属性名从`flex-pack` 变更为了 `justify-content`，但浏览器还是会因为历史原因保留这两个属性的支持。

![Untitled](/static/images/blog/202306/start_end_flex-start_flex-end/Untitled%203.png)

## 参考资源

1. [8.1. Axis Alignment: the 'flex-pack' property | WD-css3-flexbox-20120322](https://link.segmentfault.com/?enc=vZPR6ol%2FGLG6dGqNK5JEAA%3D%3D.bvyAdt6uK2e4dPUXLDQsUC8VDPponyWubFtOR4aFG1eXv%2Fyefy5NbwXhfa1wV%2BoI1uwkzmuBRHIOo1KIUAgdZg%3D%3D)
2. [8.2. Axis Alignment: the 'justify-content' property | WD-css3-flexbox-20120612](https://link.segmentfault.com/?enc=mj5YjmVSq7qHMOVoZ4VcaQ%3D%3D.hzw4ziuXE0fL7xrd0hFLtpvI3ofE5NPupBc%2BeN7K7MXygklIAcDPCDuhFGUN1H7JrbiegwNsCiWECeoAIadmjOFiCHKklUftiSql7Dgjl%2BI%3D)
3. [8.2. Axis Alignment: the 'justify-content' property | CSS Flexible Box Layout](https://link.segmentfault.com/?enc=l3EX3KBMZ4nLZqYB3AhPfw%3D%3D.hEo7oPNa6rtnThuai0bR27zIYrEzXssy%2FLllD%2FJxrYme%2Ba3QjQRM6kfpGyyR54OnYtWivHp0HJJX4TZv1LRJ%2FQ%3D%3D)