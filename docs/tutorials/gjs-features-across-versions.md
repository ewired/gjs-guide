---
title: Feature Compatibility
date: 2018-07-25 16:10:11
---
# Feature Compatibility

| | Alpha/Early | 1.44.x-1.46.x | 1.48.x | 1.50.x |1.52.x |
|-|:-:|:-:|:-:|:-:|:-:|
|SpiderMonkey Version | ? | 24 | 38 | 52 | 52 |
|<b>Classes</b> |
|Lang.Interface  | ❌ | ✔️ | ✔️ | ⚠️ | ⚠️ |
|Lang.Class      | ✔️ | ✔️ | ✔️ | ⚠️ | ⚠️ |
|ES6 Classes     | ❌ | ❌ | ❌ | ✔️ | ✔️ |
|<b>Strings</b>|
| [String.prototype.contains](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains) | ✔️  | ✔️| ✔️ | ❌ | ❌ |
| [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes) | ❌  | ❌ | ❌ | ✔️ | ✔️ |
| [String.prototype.padStart](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) | ❌ | ❌ | ❌ | ✔️ | ✔️ | 
| [String.prototype.padStart](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd) | ❌ | ❌ | ❌ | ✔️ | ✔️ | 
| [String Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) | ❌ |  ❌ | ✔️ | ✔️ | ✔️ |
| <b>Objects</b> |
| Object.values() | ❌ | ❌ | ❌ | ✔️ | ✔️ |
| <b>Arrays</b> |
| [Array.prototype.includes()]() | ❌ | ❌ | ❌ | ✔️ | ✔️ |

<!--|SpiderMonkey Version <td colspan="3" style="text-align: center;">24</td> <td> 38 </td> <td colspan="2" style="text-align: center;">52</td>|-->
