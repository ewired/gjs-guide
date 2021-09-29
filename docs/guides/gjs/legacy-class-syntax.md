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
<pre><code lang="js">var A = new Lang.Class({
   GTypeName: '<b>A</b>',
   Name: '<b>A</b>',
   Extends: <b>GObject.Object</b>,
   _init(<b>a</b>, <b>b</b>) {
       this.parent(<b>a</b>);
       <b>this.b = </b>b;
   }
 });
 </code></pre>
 </td>
 <td>
 <pre><code lang="js">var A = GObject.registerClass({
       GTypeName: '<b>A</b>',
   }, class <b>A</b> /* ... */
      /* ... */ extends <b>GObject.Object</b> { 
          _init(<b>a</b>, <b>b</b>) {
             super._init(<b>a</b>);
             <b>this.b = b;</b>
         }
   }
);</code></pre>
 </td>
 </tr> 
 </table>
 
### Binding

<table> 
<tr> <td>Legacy</td> <td>ES6</td> </tr>
<tr>
<td>
<pre><code lang="js">Lang.bind(<b>this</b>, <b>this</b>.myMethod);</code></pre>
</td>
<td>
<pre><code lang="js"><b>this</b>.myMethod.bind(<b>this</b>);</code></pre>
</td>
</tr> 
<tr>
<td>
<pre><code lang="js">Lang.bind(<b>this</b>, function () {
    if (this.x) {
        /* ... */
    }
});
</code></pre>
</td>
<td>
<pre><code lang="js">() => {
    if (this.x) {
        /* ... */
    }
}
</code></pre>
</td>
</tr>
</table>
