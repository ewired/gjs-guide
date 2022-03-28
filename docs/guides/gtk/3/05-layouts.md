---
title: Layouts in GTK
---

# Layouts in GTK

GTK utilizes a layout system that differs from many other desktop toolkits. While other toolkit's may prefer users to place widgets on a specific pixel point (a button at [50, 50]), GTK uses a flexible container-based system similar to HTML5 on the web. Containers in GTK are widgets that can "hold" other widgets. Each container uses a slightly different method to display its children (the widgets it is "holding").

[[toc]]

## Calculated Space

One important concept in GTK is calculated space. Widgets by default take up the space that they are calculated to need to display their content and nothing more. This behavior can be overriden using containers and individual settings within the widgets.

## `Gtk.Box`

`Gtk.Box` is the simplest of all the containers. It arranges its child widgets either vertically or horizontally in a simple linear line. Children can either be `homogenous` (receiving equal space) or vary depending on their calculated space.

[Learn More](https://gjs-docs.gnome.org/gtk30-box/)

## `Gtk.Grid`

`Gtk.Grid` is, essentially, a two dimensional, homogenous `Gtk.Box`. Its child widgets are arranged in neat rows and columns.

[Learn More](https://gjs-docs.gnome.org/gtk30-grid/)

## `Gtk.FlowBox`

`Gtk.FlowBox` is similar to HTML5's Flexbox conceptually. `Gtk.FlowBox` fills a row or column with child widgets (depending if it is set to vertical or horizontal) until there is no space left before starting a new row. This makes `Gtk.FlowBox` the most flexible of all the containers as you are not limited by predefined rows, columns, or sizes.

[Learn More](https://gjs-docs.gnome.org/gtk30-flowbox/)

## `Gtk.ListBox`

`Gtk.ListBox` is another flexible container. It does not have a predefined number of elements. `Gtk.ListBox` unlike other containers only accepts one type of child widget `Gtk.ListBoxRow`. However, `Gtk.ListBoxRow` can contain any widget you choose.

[Learn More](https://gjs-docs.gnome.org/gtk30-listbox/)