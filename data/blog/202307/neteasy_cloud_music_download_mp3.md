---
title: '直接下载网易云音乐中歌曲MP3格式的方法'
date: '2023-07-11'
tags: ['tips']
draft: false
summary: '直接下载网易云音乐中歌曲MP3'
images: ['/static/images/blog/202307/neteasy_cloud_music_download_mp3/shopify-section-render.jpg']
authors: ['default']
---

![thumbnail-image](/static/images/blog/202307/neteasy_cloud_music_download_mp3/shopify-section-render.jpg)

## 第一步：获取歌曲ID

打开网易云音乐，随意选择一首歌曲，在浏览器网址中或客户端分享歌曲链接中复制歌曲的ID。
例如，《我曾》这首歌的ID为1336856777。

## 第二步：获取歌曲直链

获取歌曲ID后，直接拼接获取歌曲的直链。
例如，《我曾》这首歌的直链为：

```bash
[http://music.163.com/song/media/outer/url?id=1336856777.mp3](http://music.163.com/song/media/outer/url?id=1336856777.mp3)
```

在浏览器中打开该链接即可播放，若在电脑上，可以按下Ctrl+S快捷键进行保存；若在手机上，长按应该会有保存或下载的选项提示。

## 总结

将以下链接中的歌曲ID替换为第一步获取到的歌曲ID：

```bash
[http://music.163.com/song/media/outer/url?id=歌曲ID.mp3](http://music.163.com/song/media/outer/url?id=%E6%AD%8C%E6%9B%B2ID.mp3)
```

如果跳转链接显示为 [`https://music.163.com/#/404`](https://music.163.com/#/404%EF%BC%8C%E5%88%99%E5%B0%9D%E8%AF%95%E4%BF%AE%E6%94%B9%E4%B8%BAhttps%E7%9A%84%E8%AE%BF%E9%97%AE%E6%96%B9%E5%BC%8F%EF%BC%9A)，则尝试修改为https的访问方式：

```bash
[https://music.163.com/song/media/outer/url?id=歌曲ID.mp3](https://music.163.com/song/media/outer/url?id=%E6%AD%8C%E6%9B%B2ID.mp3)
```

如果仍无法访问，那恐怕就没有其他办法了～