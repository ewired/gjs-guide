---
title: Templates in GJS
date: 2018-07-25 16:10:11
---

# GTK+ Templates & GJS

## Loading the template

In GJS it is quite simple to load a GTK+ template.

<table>
  <tr>
    <th>
      Static Accessor
    </th>
    <th>
      Registration Parameter
    </th>
  </tr>
  <tr>
    <td>
      <pre><code>/* imports */
class X extends GObject.Object {
    /* template accessor */
    static get [Gtk.template] {
        return 'url://templateurl';
    }
}</code></pre>
    </td>
    <td>
      <pre><code>/* imports */
GObject.registerClass({
    Template: 'url://templateurl'
}, class X extends GObject.Object {
    /* implementation */
});</code></pre>
    </td>
  </tr>
</table>

## Registering template children

To access children, you must provide them as an array to GObject when your class is created.

<table>
  <tr>
    <th>
      Static Accessor
    </th>
    <th>
      Registration Parameter
    </th>
  </tr>
  <tr>
    <td>
      <pre><code>/* imports */
class X extends GObject.Object {
    /* template accessor */
    static get [Gtk.internalChildren] {
        return ['label'];
    }
}</code></pre>
    </td>
    <td>
      <pre><code>/* imports */
GObject.registerClass({
    InternalChildren: ['label']
}, class X extends GObject.Object {
    /* implementation */
});</code></pre>
    </td>
  </tr>
</table>

## Accessing template children

Once registered, all template children are accessible with the pattern `this._[childName]`.

_Note the prefixed underscore!_
