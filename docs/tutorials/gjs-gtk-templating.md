---
title: Templates in GJS
date: 2018-07-25 16:10:11
---
# GTK+ Templates & GJS

## Loading the template

In GJS it is quite simple to load a GTK+ template.

| Static Accessor | Registration Parameter |
|-|-|
|<code>/\* imports \*/<br/><br/>class X extends GObject.Object {<br />&nbsp;&nbsp;&nbsp;&nbsp;static get [Gtk.template] { return 'url://templateurl'; }<br/>}</code>|<code>/\* imports \*/<br/><br/>GObject.registerClass({<br/>&nbsp;&nbsp;&nbsp;&nbsp;Template:&nbsp;'url://templateurl'<br/>}, /\* class \*/);</code>|

## Registering template children

To access children, you must provide them as an array to GObject when your class is created.

| Static Accessor | Registration Parameter |
|-|-|
|<code>/\* imports \*/<br/><br/>class X extends GObject.Object {<br />&nbsp;&nbsp;&nbsp;&nbsp;/\* template accessor \*/<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;static get [Gtk.internalChildren] { return ['label']; }<br/>}</code>|<code>/\* imports \*/<br/><br/>GObject.registerClass({<br/>&nbsp;&nbsp;&nbsp;&nbsp;InternalChildren:&nbsp;['label']<br/>}, /* class */);</code>|

## Accessing template children

Once registered, all template children are accessible with the pattern `this._[childName]`. *Note the prefixed underscore!*