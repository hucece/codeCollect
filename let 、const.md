- let: 声明一个变量
- const: 声明一个常量

### 特性
- 声明的变量只在其代码块中有效。
- 不存在变量提升的现象(先使用，再声明)

```
console.log(i) // undefined
var i = 0;

console.log(j) // 报错
let i = 9;
```
- 暂时性死区
  只要块级作用域中使用let声明了变量，那么这个变量就绑定了这个这个区域，不在受外界的干扰。

  ```
  var tmp = 123;

  if (true) {
    tmp = 'abc'; // ReferenceError
    let tmp;
  }
  ```
- 同一块级作用域中，不可重复声明同一个变量。
