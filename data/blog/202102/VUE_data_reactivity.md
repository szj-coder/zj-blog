---
title: 'Vue 数据相应式原理'
date: '2021-02-22'
tags: ['FE', 'Vue']
draft: false
summary: 'Vue3 快速上手指南～'
authors: ['default']
---

## 一、VUE2中的实现方法

### 1. 前言

我们知道：数据驱动视图的关键点则在于我们如何知道数据发生了变化，只要知道数据在什么时候变了，那么问题就变得迎刃而解，我们只需在数据变化的时候去通知视图更新即可。

要想知道数据什么时候被读取了或数据什么时候被改写了，其实不难，`JS`为我们提供了`Object.defineProperty`方法，通过该方法我们就可以轻松的知道数据在什么时候发生变化。

### 2. Object.definePropety

ES5 提供了 `Object.defineProperty` 方法，该方法可以在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

**语法：**

```js
Object.defineProperty(obj, prop, descriptor)
```

1. **obj:** `要在其上定义属性的对象。`
2. **prop:** `要定义或修改的属性的名称。`
3. **descriptor:** `将被定义或修改的属性的描述符。`

**举个例子🌰：**

```js
const object1 = {}

Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false,
})

object1.property1 = 77
// throws an error in strict mode

console.log(object1.property1)
// expected output: 42
```

**描述符：**

对象里目前存在的属性描述符有两种主要形式：数据描述符和 存取描述符 。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 函数和 setter 函数所描述的属性。一个描述符只能是这两者其中之一；不能同时是两者。

这两种描述符都是对象。它们共享以下可选键值（默认值是指在使用 Object.defineProperty() 定义属性时的默认值）：

- `configurable`当且仅当该属性的 `configurable` 键值为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。<br />**默认为** **`false`** 。
- `enumerable`当且仅当该属性的 `enumerable` 键值为 `true` 时，该属性才会出现在对象的枚举属性中。<br /> **默认为 `false`** 。数据描述符还具有以下可选键值：
- `value`该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。<br /> **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 。
- `writable`当且仅当该属性的 `writable` 键值为 `true` 时，属性的值，也就是上面的 `value`，才能被[`赋值运算符`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#assignment_operators 'Currently only available in English (US)')改变。<br />**默认为 `false`。**

存取描述符还具有以下可选键值：

- `get`属性的 getter 函数，如果没有 getter，则为 `undefined`。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。<br /> **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 。
- `set`属性的 setter 函数，如果没有 setter，则为 `undefined`。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 `this` 对象。<br /> **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)** 。

### 3. 使 Object 变得可侦测

数据的每次读和写能够被我们看的见，即我们能够知道数据什么时候被读取了或数据什么时候被改写了，我们将其称为数据变的‘可观测’。

要将数据变的‘可观测’，我们就要借助前言中提到的`Object.defineProperty`方法了，在本文中，我们就使用这个方法使数据变得“可观测”。

首先，我们定义一个数据对象`car`：

```js
let car = {
  brand: 'BMW',
  price: 3000,
}
```

我们定义了这个`car`的品牌`brand`是`BMW`,价格`price`是3000。现在我们可以通过`car.brand`和`car.price`直接读写这个`car`对应的属性值。但是，当这个`car`的属性被读取或修改时，我们并不知情。那么应该如何做才能够让`car`主动告诉我们，它的属性被修改了呢？

接下来，我们使用`Object.defineProperty()`改写上面的例子：

```js
let car = {}
let val = 3000
Object.defineProperty(car, 'price', {
  enumerable: true,
  configurable: true,
  get() {
    console.log('price属性被读取了')
    return val
  },
  set(newVal) {
    console.log('price属性被修改了')
    val = newVal
  },
})
```

通过`Object.defineProperty()`方法给`car`定义了一个`price`属性，并把这个属性的读和写分别使用`get()`和`set()`进行拦截，每当该属性进行读或写操作的时候就会触发`get()`和`set()`。如下图：

![](/static/images/blog/202102/VUE_data_reactivity/img1.png)

可以看到，`car`已经可以主动告诉我们它的属性的读写情况了，这也意味着，这个`car`的数据对象已经是“可观测”的了。

为了把`car`的所有属性都变得可观测，我们可以编写如下代码：

```js
// 源码位置：src/core/observer/index.js

/**
 * Observer类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 */
export class Observer {
  constructor (value) {
    this.value = value
    // 给value新增一个__ob__属性，值为该value的Observer实例
    // 相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作
    def(value,'__ob__',this)
    if (Array.isArray(value)) {
      // 当value/为数组时的逻辑
      // ...
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}
/**
 * 使一个对象转化成可观测对象
 * @param { Object } obj 对象
 * @param { String } key 对象的key
 * @param { Any } val 对象的某个key的值
 */
function defineReactive (obj,key,val) {
  // 如果只传了obj和key，那么val = obj[key]
  if (arguments.length === 2) {
    val = obj[key]
  }
  if(typeof val === 'object'){
      new Observer(val)
  }
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get(){
      console.log(`${key}属性被读取了`);
      return val;
    },
    set(newVal){
      if(val === newVal){
          return
      }
      console.log(`${key}属性被修改了`);
      val = newVal;
    }4
  })
}
```

在上面的代码中，我们定义了`observer`类，它用来将一个正常的`object`转换成可观测的`object`。

并且给`value`新增一个`__ob__`属性，值为该`value`的`Observer`实例。这个操作相当于为`value`打上标记，表示它已经被转化成响应式了，避免重复操作

然后判断数据的类型，只有`object`类型的数据才会调用`walk`将每一个属性转换成`getter/setter`的形式来侦测变化。 最后，在`defineReactive`中当传入的属性值还是一个`object`时使用`new observer（val）`来递归子属性，这样我们就可以把`obj`中的所有属性（包括子属性）都转换成`getter/seter`的形式来侦测变化。 也就是说，只要我们将一个`object`传到`observer`中，那么这个`object`就会变成可观测的、响应式的`object`。

`observer`类位于源码的`src/core/observer/index.js`中。

那么现在，我们就可以这样定义`car`:

```js
let car = new Observer({
  brand: 'BMW',
  price: 3000,
})
```

这样，`car`的两个属性都变得可观测了。

## 二、VUE3中的实现方法 - Proxy

### 1. 概述

Proxy 是 ES6 为了操作对象引入的 API 。

Proxy 可以对目标对象的读取、函数调用等操作进行拦截，然后进行操作处理。它不直接操作对象，而是像代理模式，通过对象的代理对象进行操作，在进行这些操作时，可以添加一些需要的额外操作。

### 2. 基本用法

一个 Proxy 对象由两个部分组成： `target`、`handler` 。在通过 `Proxy` 构造函数生成实例对象时，需要提供这两个参数。 `target`即目标对象，`handler`是一个对象，声明了代理`target` 的指定行为。

```js
let target = {
  name: 'Tom',
  age: 24,
}
let handler = {
  get: function (target, key) {
    console.log('getting ' + key)
    return target[key] // 不是target.key
  },
  set: function (target, key, value) {
    console.log('setting ' + key)
    target[key] = value
  },
}
let proxy = new Proxy(target, handler)
proxy.name // 实际执行 handler.get
proxy.age = 25 // 实际执行 handler.set
// getting name
// setting age
// 25

// target 可以为空对象
let targetEpt = {}
let proxyEpt = new Proxy(targetEpt, handler)
// 调用 get 方法，此时目标对象为空，没有 name 属性
proxyEpt.name // getting name
// 调用 set 方法，向目标对象中添加了 name 属性
proxyEpt.name = 'Tom'
// setting name
// "Tom"
// 再次调用 get ，此时已经存在 name 属性
proxyEpt.name
// getting name
// "Tom"

// 通过构造函数新建实例时其实是对目标对象进行了浅拷贝，因此目标对象与代理对象会互相
// 影响
targetEpt
// {name: "Tom"}

// handler 对象也可以为空，相当于不设置拦截操作，直接访问目标对象
let targetEmpty = {}
let proxyEmpty = new Proxy(targetEmpty, {})
proxyEmpty.name = 'Tom'
targetEmpty // {name: "Tom"}
```

接下来我们通过 `Proxy` 来实现一个数据响应式

```js
<!DOCTYPE>
<html>
<body>
	<div id="app">
		<input type="text" id="ipt" oninput="inputHandle()" />
        	<input type="button" value="增加" onclick="add()" />
	        <input type="button" value="减少" onclick="reduce()" />
        <div id="count"></div>
    </div>
    <script type="text/javascript">
        const iptDom = document.getElementById("ipt");
        const countDom = document.getElementById("count");

        const tom = {
            name: "tom",
            age: 18
        }
        const proxy = new Proxy(tom, {
            get() {
                console.log("age 被读取");
                return tom.age;
            },
            set(obj, name, val) {
                console.log("age 被修改");
                obj[name] = val;
                iptDom.value = val;
                countDom.innerText = val;
            }
        });

        function add () {
            proxy.age++;
        }

        function reduce () {
            proxy.age--;
        }

        function inputHandle (e) {
            proxy.age = iptDom.value;
        }
    </script>
</body>
</html>
```

当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要我们在 get 中收集依赖，在 set 派发更新，之所以 Vue3.0 要使用 Proxy 替换原本的 API 原因在于 Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变，唯一缺陷可能就是浏览器的兼容性不好了。

源码：

```js
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only a whitelist of value types can be observed.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

### Proxy实现简版Vue

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>标题</title>
  </head>
  <body>
    <div id="app">
      <input type="text" v-model="count" />
      <input type="button" value="增加" @click="add" />
      <input type="button" value="减少" @click="reduce" />
      <div v-bind="count"></div>
    </div>
    <script type="text/javascript">
      class Vue {
        constructor(options) {
          this.$el = document.querySelector(options.el)
          this.$methods = options.methods
          this._binding = {}
          this._observer(options.data)
          this._compile(this.$el)
        }
        _pushWatcher(watcher) {
          if (!this._binding[watcher.key]) {
            this._binding[watcher.key] = []
          }
          this._binding[watcher.key].push(watcher)
        }
        /*
           observer的作用是能够对所有的数据进行监听操作，通过使用Proxy对象
           中的set方法来监听，如有发生变动就会拿到最新值通知订阅者。
          */
        _observer(datas) {
          const me = this
          const handler = {
            set(target, key, value) {
              const rets = Reflect.set(target, key, value)
              me._binding[key].map((item) => {
                item.update()
              })
              return rets
            },
          }
          this.$data = new Proxy(datas, handler)
        }
        /*
           指令解析器，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相对应的更新函数
          */
        _compile(root) {
          const nodes = Array.prototype.slice.call(root.children)
          const data = this.$data
          nodes.map((node) => {
            if (node.children && node.children.length) {
              this._compile(node.children)
            }
            const $input = node.tagName.toLocaleUpperCase() === 'INPUT'
            const $textarea = node.tagName.toLocaleUpperCase() === 'TEXTAREA'
            const $vmodel = node.hasAttribute('v-model')
            // 如果是input框 或 textarea 的话，并且带有 v-model 属性的
            if (($vmodel && $input) || ($vmodel && $textarea)) {
              const key = node.getAttribute('v-model')
              this._pushWatcher(new Watcher(node, 'value', data, key))
              node.addEventListener('input', () => {
                data[key] = node.value
              })
            }
            if (node.hasAttribute('v-bind')) {
              const key = node.getAttribute('v-bind')
              this._pushWatcher(new Watcher(node, 'innerHTML', data, key))
            }
            if (node.hasAttribute('@click')) {
              const methodName = node.getAttribute('@click')
              const method = this.$methods[methodName].bind(data)
              node.addEventListener('click', method)
            }
          })
        }
      }
      /*
         watcher的作用是 链接Observer 和 Compile的桥梁，能够订阅并收到每个属性变动的通知，
         执行指令绑定的响应的回调函数，从而更新视图。
        */
      class Watcher {
        constructor(node, attr, data, key) {
          this.node = node
          this.attr = attr
          this.data = data
          this.key = key
        }
        update() {
          this.node[this.attr] = this.data[this.key]
        }
      }
    </script>
    <script type="text/javascript">
      new Vue({
        el: '#app',
        data: {
          count: 0,
        },
        methods: {
          add() {
            this.count++
          },
          reduce() {
            this.count--
          },
        },
      })
    </script>
  </body>
</html>
```

## 相关文档

1. Object.defineProperty MDN文档：[文档链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
2. Proxy MDN文档：[文档链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
