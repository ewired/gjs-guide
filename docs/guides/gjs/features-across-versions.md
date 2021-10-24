---
title: Feature Compatibility
date: 2018-07-25 16:10:11
---
# Feature Compatibility

As GJS' underlying JavaScript engine, [SpiderMonkey](https://spidermonkey.dev/), has been upgraded and  new GNOME stack integrations have been improved, various features have been both deprecated and added. This chart is a working guide of what features are usable on different versions of GJS

| | Alpha/Early | 1.44.x-1.46.x | 1.48.x | 1.50.x |1.52.x |
|-|:-:|:-:|:-:|:-:|:-:|
|SpiderMonkey Version | ? | 24 | 38 | 52 | 52 |
|<b>Classes</b> |
|[Lang.Interface](./gjs-legacy-class-syntax.html#Interfaces)  | ❌ | ✔️ | ✔️ | ⚠️ | ⚠️ |
|[Lang.Class](./gjs-legacy-class-syntax.html) | ✔️ | ✔️ | ✔️ | ⚠️ | ⚠️ |
|[ES6 Classes](../gjs/intro.html#extending-gobject-classes) | ❌ | ❌ | ❌ | ✔️ | ✔️ |
|<b>Strings</b>|
| [String.prototype.contains](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains) | ✔️  | ✔️| ✔️ | ❌ | ❌ |
| [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes) | ❌  | ❌ | ❌ | ✔️ | ✔️ |
| [String.prototype.padStart](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) | ❌ | ❌ | ❌ | ✔️ | ✔️ | 
| [String.prototype.padEnd](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd) | ❌ | ❌ | ❌ | ✔️ | ✔️ | 
| [String Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) | ❌ |  ❌ | ✔️ | ✔️ | ✔️ |
| <b>Objects</b> |
| [Object.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values) | ❌ | ❌ | ❌ | ✔️ | ✔️ |
| <b>Arrays</b> |
| [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) | ❌ | ❌ | ❌ | ✔️ | ✔️ |
