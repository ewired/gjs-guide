---
title: Writing Your First GNOME Application in GNOME Javascript
date: 2018-07-25 16:10:11
---
# Getting Started

## Creating a GNOME Builder project

<img :src="$withBase('/assets/img/builder-01.png')" />

First open GNOME Builder and select `New...` to create a new project.

<img :src="$withBase('/assets/img/builder-02.png')" />

Choose `JavaScript` and `GNOME Application` so GNOME Builder correctly configures and creates a template for you to build your first project from.

<img :src="$withBase('/assets/img/builder-03.png')" />

## Using Glade

Your new project should contain the above files, specifically `window.ui`.

<img :src="$withBase('/assets/img/glade-tutorial-step-00.png')" />

Open `Glade`, make sure you have version 3.22.x+ and not an outdated version. The newest version of `Glade` can be found on FlatHub [here](https://flathub.org/apps/details/org.gnome.Glade).

<img :src="$withBase('/assets/img/glade-tutorial-step-01.png')" />

Once in Glade, open the UI file from your new project.

<img :src="$withBase('/assets/img/glade-tutorial-step-02.png')" />

There it is!

<img :src="$withBase('/assets/img/glade-tutorial-step-04.png')" />

Once opened, you'll see a basic `Hello, World!` application. Right click on the `GtkLabel` and click delete.

<img :src="$withBase('/assets/img/glade-tutorial-step-06.png')" />

You should now have a window that looks like this.

<img :src="$withBase('/assets/img/glade-tutorial-step-07.png')" />

Select the header bar and rename the title to 'Tags' (or whatever your application is called).

## Adding a button to the header bar...

<img :src="$withBase('/assets/img/glade-tutorial-step-08.png')" />

To add a button to the header bar locate `Number of items` in the `General` section of the header bar's properties.

<img :src="$withBase('/assets/img/glade-tutorial-step-09.png')" />

 Increase the number to `1`.

<img :src="$withBase('/assets/img/glade-tutorial-step-10.png')" />

Now let's find a `button`.

<img :src="$withBase('/assets/img/glade-tutorial-step-11.png')" />

There it is! Select `GtkButton`.

<img :src="$withBase('/assets/img/glade-tutorial-step-12.png')" />

Now anywhere we click a button will be placed.

<img :src="$withBase('/assets/img/glade-tutorial-step-13.png')" />

Place a button in the empty slot we've created in the header bar.

<img :src="$withBase('/assets/img/glade-tutorial-step-15.png')" />

Now let's name our button. We'll call it `addFileButton` because we'll use it to open files for Tags.

<img :src="$withBase('/assets/img/glade-tutorial-step-16.png')" />

While we're at it, let's rename our header bar too because [camelCasing](camelcaselink) is preferred in GJS.

<img :src="$withBase('/assets/img/glade-tutorial-step-17.png')" />

We want to have a `+` image inside our button to symbolize adding. To do this , select `Add custom content` in `General` in the button's properties section.

<img :src="$withBase('/assets/img/glade-tutorial-step-18.png')" />

Now let's grab a `GtkImage`.

<img :src="$withBase('/assets/img/glade-tutorial-step-19.png')" />

Pop it into the button's empty slot.

<img :src="$withBase('/assets/img/glade-tutorial-step-20.png')" />

Now select the image.

<img :src="$withBase('/assets/img/glade-tutorial-step-21.png')" />

Find `Icon Name` in `General` in the properties section of the `GtkImage`. Click on `Icon Name`.

<img :src="$withBase('/assets/img/glade-tutorial-step-22.png')" />

Select the appropriate semantic name for 'adding' which is `list-add-symbolic`. Be certain you get `list-add-symbolic` and not `list-add` as symbolic icons are monochromatic and meant for menus and buttons.

<img :src="$withBase('/assets/img/glade-tutorial-step-24.png')" />

You should now see the symbolic name `list-add-symbolic` under `Icon Name`.

<img :src="$withBase('/assets/img/glade-tutorial-step-26-0.png')" />

Now we want to add a relatively recent GTK+ widget, `GtkFlowBox`. Be default, Glade assumes we want to build our application on GTK+ 3.10.x, so it will not allow us to access `GtkFlowBox`. To remedy this, select the project properties button in the upper right.
| | |
|-|-|
|<img :src="$withBase('/assets/img/glade-tutorial-step-26-1.png)|[enter image description here](/assets/img/glade-tutorial-step-26-2.png')" />|

Here we'll find a version selector. From it, select `3.20`.

<img :src="$withBase('/assets/img/glade-tutorial-step-27.png')" />

Now we will add a `GtkBox` to store the window contents.

<img :src="$withBase('/assets/img/glade-tutorial-step-28.png')" />

Pop it into the empty space in our window, `TagsWindow`.

<img :src="$withBase('/assets/img/glade-tutorial-step-29.png')" />

## Next Time
