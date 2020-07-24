---
title: Installing GJS and Running The Examples
---

# Installing GJS and Running The Examples

[[toc]]

This guide is built for running the examples you will encounter in the first half of this guide, for setting up an application development environment go [here](../../gjs/editor-tips.html);

### Running a Tutorial

Place any code you would like to run in the code viewer on the left side of the window.

Now, click the `Run` button in the upper right corner.

You can see any program output in the output viewer on the right side of the window.
  
## Using The Command Line

Using the command line is possible but can be difficult if your distribution is not running a modern version of GJS by default. Beginning examples may function properly, while more advanced topics fail due to missing features. You can view a list of supported GJS features by version [here](../gjs/features-across-versions.html).

### Installing GJS

Install GJS from any of the packages below.

- Ubuntu 18.04
- Debian Stretch
- Arch Linux
- more at [pkgs.org](https://pkgs.org/)

### Verifying Your GJS Version
Verify your system has a recent version of GJS. Type...

    gjs --version
    
...into a terminal. You can see the features your version of GTK+ supports [here](../../gjs/features-across-versions.html). If your version is below 1.48.x it is recommended you use [GNOME Builder](https://wiki.gnome.org/Apps/Builder) or build GJS from source.

### Running A Tutorial

Save the tutorial to a file, `file.js`.

Run this in terminal:
    
    gjs file.js









