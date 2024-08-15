---
title: '尝鲜 Vue 3.0 Combination API'
date: '2020-09-06 17:46:46'
tags: ['FE', 'Vue', 'Vue3']
draft: false
summary: "尝鲜 Vue 3 将要发布的 Combination API，如何在 Vue 2 中抢先试用 Vue 3 新特性"
authors: ['default']
---

Vue 3.0 即将发布，我们已经可以尝试一些新版本中带来的新功能，比如 [Composition-API 组合式API](https://composition-api.vuejs.org/)。如果你了解过 React 的 Hooks，那么当你看到组合式API时一定不会感到陌生。组合式API受到了 React Hooks 很大的启发。

Vue 非常易于使用，并且有非常出色的 API，对于初学者来说配合官方文档很容易就可以理解 Vue 的语法。但在国内一些大型的项目可能不会首选 Vue 去开发，因为当组件越来越大的时候会变得很难维护，很难找到一个变量在哪被定义又是在哪被使用。Vue2 中也有一些解决方法，比如mixin、HOC、作用域插槽等等，但是都不能非常完美的去解决这个问题。

说到 mixin，其实 mixin 非常简单，我们可以通过它来把一些公共的数据、方法等等进行抽离后合并到一个组件。但当项目中的 mixin 越来越多的时候你就会发现命名冲突的可能性会变得很大，某些状态和方法的来源恨不清晰。

组合式API可以很完美的解决这个问题。

## Demo1

可以使用 Vue-CLI 搭建一个 Vue3 的项目，也可以直接下载 `@vue/composition-api` 包来使用。

```shell
npm i @vue/composition-api
```

在 `main.js` 文件中 use 组合式API：

```js
import compositionApi from '@vue/composition-api'
Vue.use(compositionApi)
```

从一个计数器的小案例开始。新建一个 `Count.vue` ：
![](/static/images/blog/202009/Try_the_Vue3_combination_API/img1.gif)

```vue
<template>
  <div class="count">
    <button @click="increment">Count is: {{ state.count }}, double is: {{ state.double }}</button>
  </div>
</template>

<script>
import { reactive, computed } from '@vue/composition-api'

export default {
  name: 'Count',

  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2),
    })

    const increment = () => state.count++

    return {
      state,
      increment,
    }
  },
}
</script>
```

在 vue3 中有一个新的方法 **`setup()`**。data、computed等属性都需要放到 setup 中，setup 返回的是一个对象，该对象包含在组件中应该可用的所有内容。

另外还使用了两个函数**`reactive()`**、**`computed()`**。reactive 与 Vue 2 中的 `Vue.observable` 等效。computed() 是创建计算属性的另一种方式，除此之外与2没有区别。

然后可以在 `App.vue` 中导入 `Count.vue`。

```vue
<template>
  <div id="app">
    <Count />
  </div>
</template>

<script>
import Count from '@/components/Count'
export default {
  name: 'app',
  components: { Count },
}
</script>
```

这是一个很简单的 demo。

## Demo2

![](/static/images/blog/202009/Try_the_Vue3_combination_API/img2.gif)

让我们来继续尝试做一些更好玩的事情。一个可以从随机狗狗网站`https://dog.ceo`中获取狗狗照片的功能。

创建一个 `useApi` 函数，他的状态有：`data` 和 `api_status`，还有一个 `initFetch` 功能。useApi 接收 url 和 options 两个参数。我们将使用它从 `https://dog.ceo` 提供的 API 中提取随机的狗狗照片。创建一个 `Dog.vue` 组件，并添加如下代码：

```js
const useApi = (url, options = {}) => {
  const state = reactive({
    data: null,
    api_status: '',
  })

  const initFetch = async () => {
    try {
      // 更改 API 状态
      state.api_status = 'FETCHING'
      // 发送请求
      const response = await fetch(url)
      // 格式化返回结果
      const data = await response.json()
      state.data = data.message
      // 修改 API 状态
      state.api_status = 'FETCHING_SUCCESS'
    } catch (error) {
      // 处理错误情况
      state.api_status = 'FETCHING_ERROR'
    }
  }
  // 判断有没有 fetchImmediately 属性，并且不为空
  if (
    Object.prototype.hasOwnProperty.call(options, 'fetchImmediately') &&
    options.fetchImmediately
  ) {
    initFetch()
  }

  return {
    ...toRefs(state),
    initFetch,
  }
}
```

这里使用到了 `toRefs()`，稍后会详细讲。
在 useApi 函数中，我们声明了state 包括 data 和 api_status。此外，initFetch 功能是更新 api_status 和发送请求。

接下来，我们检查 options 对象是否具有 fetchImmediately 属性。它指示在创建组件时是否应初始化API调用。最后，我们返回一个响应式 state 和 initFetch 函数的对象 。我们没有直接返回 state，而是使用 toRefs 进行包装。使用 toRefs 包装每个值，可以让他们具有响应性。

```js
export default {
  setup() {
    const { data, api_status, initFetch } = useApi('https://dog.ceo/api/breeds/image/random', {
      fetchImmediately: true,
    })

    return {
      dogImage: data,
      api_status,
      fetchDog: initFetch,
    }
  },
}
```

如前所述，我们可以从 useApi 中解构所需的属性而不会失去响应性。此外，从 setup 返回的对象已重命名了属性。最后加上模板：

```html
<template>
  <div style="margin-top: 20px;">
    <div v-if="api_status === 'FETCHING'">Fetching</div>
    <div v-else-if="api_status === 'FETCHING_ERROR'">Error</div>
    <div v-else-if="api_status === 'FETCHING_SUCCESS'">
      <img
        :src="dogImage"
        style="display: block; max-width: 500px; height: auto; margin: 0 auto;"
      />
    </div>
    <div v-else>Oops, no dog found</div>
    <button style="margin-top: 20px;" @click.prevent="fetchDog">Fetch dog</button>
  </div>
</template>
```

这些模板 divs 取决于 api_status 来显示或隐藏。由于传递fetchImmediately: true 给 useApi，因此会在初始化时发送一条请求，您可以通过单击 Fetch dog 按钮来再一次发起请求。

你可以在 [Github](https://github.com/mk965/vue3-composition-api-demo) 上下载完整 demo 代码。
