---
title: Setting Up Your Application Development Environment
---

For developing packaged applications in GJS we highly recommend [GNOME Builder](). GNOME Builder can download the latest GJS version for you and provides support for developing secure, structured GNOME applications.

If you do not have GNOME Builder installed you can get it [here]().

## Using GNOME Builder

### Creating a New GJS GTK+ Application Project

Open GNOME Builder's application menu and select `New Project`.

Select JavaScript as the language and GNOME Application as the type.

Click Create.

### Configuring the Runtime Environment

Go to build settings.

In your application ensure that the runtime environment is set to Gnome Platform 3.28 or higher.  

## Working in Other IDES

If you are working in another IDE is possible but more complicated.

### Download the Template

First, download the application template [here]() (or use git clone [link])

### Install GJS

Install GJS from any of the packages below.

- Ubuntu 18.04
- Debian Stretch
- Arch Linux
- more at [pkgs.org]()

### Verifying Your GJS Version
Verify your system has a recent version of GJS. Type...

    gjs --version
    
...into a terminal. You can see the features your version of GTK+ supports [here](). If your version is below 1.48.x it is recommended you use [GNOME Builder]() or build GJS from source.

### Building GJS From Source

Use BuildStream of JHBuild

<!--TODO: Finish this documentation-->

### Building Your Project

To build your project open a terminal in your project's root directory and type the following...

    meson --set-prefix=***/your/project/directory***/run/

...to initialize Meson. Now type...

    mkdir build && cd build && ninja && ninja build

### Running Your Project

Type...
    
    ./run/**your.app.name**