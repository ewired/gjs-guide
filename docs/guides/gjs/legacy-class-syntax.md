---
title: Legacy Class Syntax
date: 2018-07-25 16:10:11
---
# GJS Legacy Class Syntax

Prior to the introduction of ES6 classes in GJS 1.50, GJS had its own implementation of classes and interfaces to interact with classes. This was implemented in the `imports.lang` module via `imports.lang.Class` and `imports.lang.Interface`.

```js
const Lang = imports.lang;

var A = new Lang.Class({
    Name: 'A',
    GTypeName: 'A',
    Signals: {},
    InternalChildren: [],
    Children: [],
    Extends: GObject.Object,
    _init(a, b) {
      this.parent(a, b);
    }
});
```

## Comparison between legacy and ES6

### Implementations

<table> 
<tr> <td>Legacy</td> <td>ES6</td> </tr>
<tr>
<td>

```js
var A = new Lang.Class({
   GTypeName: 'A',
   Name: 'A',
   Extends: GObject.Object,
   _init(a, b) {
       this.parent(a);
       this.b = b;
   }
 });
```

 </td>
 <td>

```js
var A = GObject.registerClass({
       GTypeName: 'A',
   }, class A /* ... */
      /* ... */ extends GObject.Object { 
          constructor(a, b) {
             super(a);
             this.b = b;
         }
   }
);
```

 </td>
 </tr> 
 </table>
 
### Binding

<table> 
<tr> <td>Legacy</td> <td>ES6</td> </tr>
<tr>
<td>

```js
Lang.bind(this, this.myMethod);
```

</td>
<td>

```js
this.myMethod.bind(this);
```

</td>
</tr> 
<tr>
<td>

```js
Lang.bind(this, function () {
    if (this.x) {
        /* ... */
    }
});
```

</td>
<td>

```js
() => {
    if (this.x) {
        /* ... */
    }
}
```

</td>
</tr>
</table>
