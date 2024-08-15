---
title: '快速上手 Vue3'
date: '2020-11-03 20:46:27'
tags: ['FE', 'Vue', 'Vue3']
draft: false
summary: 'Vue3 快速上手指南～'
authors: ['default']
---

## 1、Vue3的特点

1. vue3中全部采用函数式写法，替换了原来类的写法。
2. vue3源码全部采用ts编写，编码中实现了对ts更好的支持。
3. vue3完全兼容vue2，在vue3中依然可以按照vue2的方式去写代码，而且两种写法可以同时存在。
4. 组件中同时存在两种写法时，当setup返回值中定义的方法和methods中的方法同名时，会抛出错误。
   定义的数据和data定义的数据字段相同时，会被data定义的字段覆盖
5. vue3采用 `proxy` 的方式实现数据代理，只会代理第一层数据 避免了vue2中对data的深层递归，提升了组件渲染性能。

```js
// 在vue3中定义一个响应式数据

const state = reactive({ data: { obj: {} } })

state.data.obj = xxx
```

上例中，返回的state是一个 proxy 对象，默认只会对 data 进行代理
那么vue3是怎么实现深层数据劫持呢，例如我们要修改obj那么是怎么监听到obj的修改呢？
当我们要对深层对象obj进行修改时，会调用 `state.data` 的 `get` 方法，在 `get` 方法中会对 `state.data` 进行代理，劫持 `state.data` 中的属性， `get` 方法返回的不是 `state.data` 本身，而是被 `proxy` 代理过的对象，从而巧妙的实现了深层数据劫持，在用到该属性的时候一定会调用父级的 `get` 方法，这时候才会去劫持属性的 `get` 和 `set` 方法。

## 2、setup函数

#### setup函数是vue3中所有api的入口和出口

vue3 中用 `setup` 函数整合了所有的 api，`setup` 函数只执行一次，在生命周期函数前执行，所以在 `setup` 函数中拿不到当前实例 `this`，不能用 `this` 来调用 vue2 写法中定义的方法。

vue3 中去掉了 `data`，使用 `setup` 的返回值来给模板绑定value
return 的对象如果是常量，不会变成响应式数据。

`this.$emit` 用 `context.emit` 方法来替代。

```js
// props - 组件接受到的属性， context - 上下文
setup(props, context){
    return {
        // 要绑定的数据和方法
    }
}
```

## 3、生命周期

生命周期函数，都变成了回调的形式，写在setup函数中 可以一次写多个相同的生命周期函数，按照注册顺序执行。

```js
setup() {
    onMounted(() => {
      console.log('组件挂载1');
    });

    onMounted(() => {
      console.log('组件挂载2');
    });

    onUnmounted(() => {
      console.log('组件卸载');
    });

    onUpdated(() => {
      console.log('组件更新');
    });

    onBeforeUpdate(() => {
      console.log('组件将要更新');
    });

    onActivated(() => {
      console.log('keepAlive 组件 激活');
    });

    onDeactivated(() => {
      console.log('keepAlive 组件 非激活');
    });

    return {};
  },
```

## 4、ref - 简单的响应式数据

1. ref 可以将某个普通值包装成响应式数据，仅限于简单值，内部是将值包装成对象，再通过 `defineProperty` 来处理的。
   通过 ref 包装的值，取值和设置值的时候，需用通过 value 来进行设置
2. 可以用 ref 来获取组件的引用，替代 `this.$refs` 的写法。

```js
<template>
  <div class="mine">
    <input v-model="inputVal" />
    <button @click="addTodo">添加</button>
    <ul>
      <li v-for="(item, i) in todoList" :key="i">
        {{ item }}
      </li>
    </ul>
  </div>
  <div></div>
</template>


setup() {
    const inputVal = ref('');
    const todoList = ref<string[]>([]);

    function addTodo() {
      todoList.value.push(inputVal.value);
      inputVal.value = '';
    }

    return {
      addTodo,
      inputVal,
      todoList,
    };
  },
```

## 5、reactive - 数据绑定

使用 reactive 来对复杂数据进行响应式处理，它的返回值是一个 proxy 对象，在 `setup` 函数中返回时，可以用 `toRefs` 对 proxy 对象进行结构，方便在 template 中使用。

通过 reactive 来创建响应式数据 data ，用 `toRefs` 来进行解构，在模板中直接使用 `inputVal`、`todoList`。

模板中绑定的方法也需要 在setup函数中定义，并返回，才能绑定到模板中，例如addTodo方法。

vue3 模板：一个 templage 可以有多个平级的标签（vue2中只能在template写一个子标签）

```js
<template>
  <div class="mine">
    <input v-model="inputVal" />
    <button @click="addTodo">添加</button>
    <ul>
      <li v-for="(item, i) in todoList" :key="i">
        {{ item }}
      </li>
    </ul>
  </div>
  <div></div>
</template>

setup() {
    const data = reactive({
      inputVal: '',
      todoList: [],
    });

    function addTodo() {
      data.todoList.push(data.inputVal);
      data.inputVal = '';
    }

    return {
      ...toRefs(data),
      addTodo,
    };
  },
```

## 6、computed

计算属性，变成了函数写法，当依赖的值发生改变时会重新计算 computed 包装后的值，需要用 `.value` 去取值，template 中不需要使用 `.value`。

```js
async setup() {
    const data = reactive({
      a: 10,
      b: 20,
    });

    let sum = computed(() => data.a + data.b);

    return { sum };
  },
```

## 7、watch

变成了函数写法，与vue2中用法相同。

```js
// 侦听一个
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听一个ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

## 8、watchEffect

响应式地跟踪函数中引用的响应式数据，当响应式数据改变时，会重新执行函数。

```js
const count = ref(0)
// 当count的值被修改时，会执行回调
watchEffect(() => console.log(count.value))
```

## 9、vue-router

组件中使用路由时用useRoute和useRouter。

```js
import { useRoute, useRouter } from 'vue-router'

const route = useRoute() // 相当于 vue2 中的this.$route
const router = useRouter() // 相当于 vue2 中的this.$router

// route   用于获取当前路由数据
// router  可以的得到一些关于路由的方法
```

## 10、vuex

使用 `useStore` 来获取 `store` 对象 从 vuex 中取值时，要注意必须使用 `computed` 进行包装，这样 vuex 中状态修改后才能在页面中响应。

```js
import {useStore} from 'vuex'

setup(){
    const store = useStore(); // 相当于 vue2中的 this.$store
    store.dispatch(); // 通过store对象来dispatch 派发异步任务
    store.commit(); // commit 修改store数据

    let category = computed(() => store.state.home.currentCagegory
    return { category }
}
```

## 11、用 jsx 来定义 vue 组件

vue3 中支持使用 jsx 语法来定义 vue 组件。

```js
export const AppMenus = defineComponent({
  setup() {
    return () => {
      return (
        <div class="app-menus">
          <h1>这是一个vue组件</h1>
        </div>
      )
    }
  },
})
```

## 12、插槽修改

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
