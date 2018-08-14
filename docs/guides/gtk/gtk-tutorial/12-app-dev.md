---
title: Setting Up Your Application Development Environment
---

For developing packaged applications in GJS we highly recommend [GNOME Builder](https://wiki.gnome.org/Apps/Builder). GNOME Builder can download the latest GJS version for you and provides support for developing secure, structured GNOME applications.

If you do not have GNOME Builder installed you can get it [here](https://flathub.org/apps/details/org.gnome.Builder).

## Using GNOME Builder

### Creating a New GJS GTK+ Application Project

<img :src="$withBase('/assets/img/builder-01.png')" />

First open GNOME Builder and select `New...` to create a new project.

<img :src="$withBase('/assets/img/builder-02.png')" />

Choose `JavaScript` and `GNOME Application` so GNOME Builder correctly configures and creates a template for you to build your first project from.

<img :src="$withBase('/assets/img/builder-03.png')" />

### Configuring the Runtime Environment

Go to build settings.

In your application ensure that the runtime environment is set to Gnome Platform 3.28 or higher.  

## Working in Other IDES

If you are working in another IDE is possible but more complicated.

### Download the Template

First, download the application template [here](TODO.localhost) (or use git clone [link])

### Install GJS

Install GJS from any of the packages below.

- [Ubuntu 18.04](https://packages.ubuntu.com/bionic/gjs)
- [Fedora 28](https://fedora.pkgs.org/28/fedora-x86_64/gjs-1.52.2-1.fc28.x86_64.rpm.html)
- [Debian](https://packages.debian.org/buster/gjs)  *Warning: Out of Date In Stretch*
- [Arch Linux](https://www.archlinux.org/packages/extra/x86_64/gjs/)
- more at [pkgs.org](https://pkgs.org/download/gjs)

### Verifying Your GJS Version
Verify your system has a recent version of GJS. Type...

    gjs --version
    
...into a terminal. You can see the features your version of GTK+ supports [here](../../gjs/features-across-versions.html). If your version is below 1.50.x it is recommended you use [GNOME Builder](https://flathub.org/apps/details/org.gnome.Builder) or build GJS from source.

<!--### Building GJS From Source

Use BuildStream or JHBuild

TODO: Finish this documentation-->

### Building Your Project

To build your project open a terminal in your project's root directory and type the following...

    meson --set-prefix=***/your/project/directory***/run/

...to initialize Meson. Now type...

    mkdir build && cd build && ninja && ninja build

### Running Your Project

Type...
    
    ./run/**your.app.name**