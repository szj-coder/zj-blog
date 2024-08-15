---
title: 'JavaScript 数组扁平化处理的方法总结'
date: '2020-06-28 15:32:21'
tags: ['FE', 'JavaScript', 'flat']
draft: false
summary: '对于 js 中常用的数组铺平方法的总结和记录'
authors: ['default']
---


## 数组扁平化


所谓“数组扁平化”就是指将一个多维数组变为一个一维数组，比如：

```js
[1, 2, [3, 4, [5, 6]]  ==>  [1, 2, 3, 4, 5, 6]
```

我们通过几种常用方式来实现数组的扁平化。

---

## 方法1：flat()法

> flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

- 语法：`var newArray = arr.flat([depth])`
- depth：可选，指定要提取嵌套数组的结构深度，默认值为 1。
- 当depth值为 `Infinity`，可展开任意深度的嵌套数组

  **例子：**

```js
let arr = [1, 2, [3, 4, [5, 6]]]
let newArr = arr.flat(Infinity)
console.log(newArr)
// > (6) [1, 2, 3, 4, 5, 6]
```

---

## 方法2：split法

**思路：** 转换成字符串，再使用去除`[]`等符号，在使用`split(',')`进行分组。
**例子：**

```js
let arr = [1, 2, [3, 4, [5, 6]]]
let newArr = arr.toString().replace(/\[\]/g, '').split(',')
console.log(newArr)
// > (6) ["1", "2", "3", "4", "5", "6"]
```

**缺点：** 从输出结果可以看出数组里的数字被转为了字符串，成了字符串数组。

---

## 方法3：parse法

**思路：** 方法3和方法2的思路差不多，转换成字符串，再使用去除`[]`等符号，再在字符串两端加上`[]`，最有使用`JSON.parse()`进行格式化。

> JSON.parse() 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。提供可选的 reviver 函数用以在返回之前对所得到的对象执行变换(操作)。

**例子：**

```js
let arr = [1, 2, [3, 4, [5, 6]]]
let newArr = arr.toString().replace(/\[\]/g, '')
newArr = '[' + newArr + ']'
newArr = JSON.parse(newArr)
console.log(newArr)
// > (6) [1, 2, 3, 4, 5, 6]
```

---

## 方法4：递归法

**思路：** 递归法可以说是最传统的方法，同时也是最麻烦的方法，不过也可以很好的解决数组扁平化的问题。主要是遍历第一层数组的每一个元素，判断元素是否还是数组，如果是就进行递归，不是的话`push`进结果数组。

**例子：**

```js
let arr = [1, 2, [3, 4, [5, 6]]]
let result = []
let fn = function (ary) {
  for (let i = 0; i < ary.length; i++) {
    let item = ary[i]
    if (Array.isArray(ary[i])) {
      fn(item)
    } else {
      result.push(item)
    }
  }
  return result
}
fn(arr)
console.log(result)
// > (6) [1, 2, 3, 4, 5, 6]
```

---

## 方法5：reduce法

> `reduce()` 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
> reducer 函数接收4个参数:
>
> - Accumulator (acc) (累计器)
> - Current Value (cur) (当前值)
> - Current Index (idx) (当前索引)
> - Source Array (src) (源数组)

> ` concat()` 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
>
> **思路：** 使用`reduce()`获得上一次操作的结果，并判断当前值是否为一个数组，如果是一个数组金鼎递归，如果不是数组则使用`concat()`向前合并。

**例子：**

```js
function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}
console.log(flatten(arr))
// > (6) [1, 2, 3, 4, 5, 6]
```

---

## 方法6：扩展运算符法

> 展开语法(Spread syntax), 可以在函数调用/数组构造时, 将数组表达式或者 string 在语法层面展开；还可以在构造字面量对象时, 将对象表达式按key-value的方式展开。(译者注: 字面量一般指 [1, 2, 3] 或者 \{name: 'mdn'\} 这种简洁的构造方式)

> 语法：`myFunction(...iterableObj);`

**例子：**

```js
while (arr.some(Array.isArray)) {
  arr = [].concat(...arr)
}
console.log(arr)
// > (6) [1, 2, 3, 4, 5, 6]
```

**缺点：** 此方法最大的缺点就是改变了原素组，可将元素组提前备份。
