---
title: 'Android Webview <video> 标签去除默认播放按钮图'
date: '2023-12-05'
tags: ['Video', 'Android', 'WebView']
draft: false
summary: '去除安卓 WebView 中视频默认的超丑的播放按钮...'
authors: ['default']
---
import UnsplashPhotoInfo from './UnsplashPhotoInfo.tsx'

![thumbnail-image](/static/images/blog/202312/Remove_Android_WebView_video_poster/oleksandr-kurchev-W6N7YZ3aVoo-unsplash.jpg)

<UnsplashPhotoInfo photoURL="https://unsplash.com/photos/a-view-of-the-ocean-from-a-rocky-beach-W6N7YZ3aVoo" author="Oleksandr Kurchev" />


又到了一年一度的「年终盛典」活动。这属于是年度大活动，等级是 S 级，是最高等级的活动。身为 S 级别活动，对于开发团队而言有着极高的要求，不仅需臻于完美地实现设计图纸的设想，更需充分考虑到参与者的手机型号、网络环境以及操作系统版本等诸多因素。

与之相比，大多其他类型的活动只需放置一张静态的头部图像即可。而在此次 S 级别的活动中，我们几乎全部选择了动态的头部图像。值得注意的是，为了提高兼容性和减少文件体积，我们通常会采用 mp4 格式。

此外，选择将视频作为头部图像时，如果能为视频标签添加上 `muted` 和 `autoplay` 属性，便可使视频自动播放(当然，如果你的WebView配置支持的话，也可设定为非静音模式)。

今天测试跑过来说安卓上会有一个「一闪而过的」播放按钮，就是下面这个，机器是 Redmi (具体型号已记不清)。而在 iOS 设备上一切正常。

![Default Poster](/static/images/blog/202312/Remove_Android_WebView_video_poster/default_poster.png)
![aaa](/static/images/blog/202312/Remove_Android_WebView_video_poster/default_poster.png)

简单排查过后即确认了是安卓 WebView 默认的 `poster`，以往会添加一个静态头图作为 `poster`，也可以防止视频加载失败是一片空白。这一次视频和静态图给的尺寸不一致，直接去掉了 `poster` 在视频后方添加了一个图片。所以在以往的活动中并没有发现这个问题。

## 解决方案1

这个播放按钮就是 WebView 默认的 `poster` ，所以我们直接给一个 `poster` 就可以了，如果你有现成的图片就设置图片，没有的话可以给一个透明图片像下面这样：

```jsx
// 透明 base64
<video poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
// or
<video poster="https://via.placeholder.com/1x1" />
// or
<video poster="noposter" />
```

> ⚠️ 注意：poster="" 直接给空字符串会被忽略


## 解决方案2

方案1这么搞的话太麻烦，每个视频标签都要添加 `poster` 不管需要不需要。一劳永逸的解决办法还要是修改 WebView 的配置：

参考文档：[developer.android.com](https://developer.android.com/reference/android/webkit/WebChromeClient#getDefaultVideoPoster())

```kotlin
class MainActivity : AppCompatActivity() {
    // 重写 WebChromeClientCustomPoster 方法
    private class WebChromeClientCustomPoster : WebChromeClient() {
        override fun getDefaultVideoPoster(): Bitmap? {
            return Bitmap.createBitmap(10, 10, Bitmap.Config.ARGB_8888)
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val myWebView: WebView = findViewById(R.id.webview)
        myWebView.webChromeClient = WebChromeClientCustomPoster()
        // 加载前端页面
        myWebView.loadUrl("https://mengke.me:9999")
    }
}
```

## **Reference**

- [stackoverflow - HTML5 video remove overlay play icon](https://stackoverflow.com/questions/18271991/html5-video-remove-overlay-play-icon)
- [WebChromeClient  |  Android Developers](https://developer.android.com/reference/android/webkit/WebChromeClient#getDefaultVideoPoster())