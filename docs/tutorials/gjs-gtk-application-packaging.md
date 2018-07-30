---
title: GTK+ Application Packaging Specification
date: 2018-07-25 16:10:11
---
# GJS GTK+ Application Packaging Specification

This page details the built-in packaging specifiction for Javascript applications using GJS and GObject Introspection.

*Users should refer to [the GJS application template](https://github.com/gcampax/gtk-js-app) for a complete, up-to-date example.*

## Index

The following variables are used throughout this document:

* **''${package-name}''**: the fully qualified ID of the package, in DBus name format (e.g. ''org.gnome.Weather'')
* **"${entry-point-name}"**: the fully qualified ID of an entry point, in DBus name format (e.g. ''org.gnome.Weather.Application'')
  * This must be a sub ID of ${package-name}
* **"${entry-point-path}"**: the entry point ID, converted to a DBus path ([identical to GApplication]())
* **"${package-tarname}"**: a short, unambiguous name for the package (e.g. ''gnome-weather'')
* **"${package-version}"**: the version of the package

##  Runtime API

The following API will be available to applications, through the package.js module.

 * `window.pkg` (`pkg` on the global object) will provide access to the package module
 * `pkg.name` and `pkg.version` will return the package name and version, as passed to `pkg.init()`
 * `pkg.prefix`, `pkg.datadir`, `pkg.libdir` will return the installed locations of those folders
 * `pkg.pkgdatadir`, `pkg.moduledir`, `pkg.pkglibdir`, `pkg.localedir` will return the respective directories, or the appropriate subdirectory of the current directory if running uninstalled
 * `pkg.initGettext()` will initialize gettext. After calling window._, window.C_ and window.N_ will be available
 * `pkg.initFormat()` will initialize the format module. After calling, String.prototype.format will be available
 * `pkg.initSubmodule(name)` will initialize a submodule named @name. It must be called before accessing the typelibs installed by that submodule
 * `pkg.loadResource(name)` will load and register a GResource named @name. @name is optional and defaults to ${package-name}
 * `pkg.require(deps)` will mark a set of dependencies on GI and standard JS modules. @deps is a object whose keys are repository names and whose values are API versions. If the dependencies are not satisfied, `pkg.require` will print an error message and quit.

##  Package layout

 * The application package is expected to use Meson.
 * The following directories and files in the toplevel package must exist:
   * **src/:** contains JS modules
   * **src/${entry-point-name}.src.gresource.xml:**  the GResource XML for JS files for the named entry point (see below)
   * **src/${entry-point-name}.src.gresource:** the compiled GResource for JS files
   * **data/:** contains misc application data (CSS, GtkBuilder definitions, images...)
   * **data/${entry-point-name}.desktop:** contains the primary desktop file for the application
 * Optional Files
   * **data/${entry-point-name}.data.gresource:** contains the primary application resource
   * **data/${entry-point-name}.gschema.xml:** contains the primary GSettings schema
   * **data/gschemas.compiled:** compiled version of GSettings schemas in data/, for uninstalled use
   * **lib/:** contains sources and .la files of private shared libraries
   * **lib/.libs:** contains the compiled (.so) version of private libraries
   * **po/:** contains intltool PO files and templates; the translation domain must be ${package-name}
   * **Other toplevel directories (e.g. libgd,  egg-list-box)**: same structure as lib/ but utilized for shared submodules
 * The package must be installed as following:
   * ${datadir} must be configured as ${prefix}/share
   * Arch-independent private data (CSS, GtkBuilder, GResource) must be installed in ${datadir}/${package-name} (a.k.a. ${pkgdatadir})
   * Source files must be compiled in a GResource with path ${entry-point-path}/js, in a bundle called ${entry-point-name}.src.gresource installed in ${pkgdatadir}
   * Private libraries must be ${libdir}/${package-name}, aka \${pkglibdir}
   * Typelib for private libraries must be in ${pkglibdir}/girepository-1.0
   * Translations must be in ${datadir}/locale/
   * Other files (launchers, GSettings schemas, icons, etc) must be in their specified locations, relative to ${prefix} and ${datadir}

## Usage

Applications complying with this specification will have one application script, installed in \${prefix}/share/\${package-name} (aka ${pkgdatadir}), and named as ${entry-point-name}, without any extension or mangling.

Optionally, one or more symlinks will be placed in ${bindir}, pointing to the appropriate script in ${pkgdatadir} and named in a fashion more suitable for command line usage (usually ${package-tarname}). Alternatively, a script that calls "gapplication launch ${package-name}" can be used.

The application itself will be DBus activated from a script called src/\${entry-point-name}, generated from configure substitution of the following
\${entry-point-name}.in:

```js
#!javascript
#!@GJS@
imports.package.init({
    name: "${package-name}",
    version: "@PACKAGE_VERSION@",
    prefix: "@prefix@"
});
imports.package.run(/* ${main-module} */);
```

Where ${main-module} is a module containing `main()` the function that will be invoked to start the process. This function should accept a single argument, an array of command line args. The first element in the array will be the full resolved path to the entry point itself (unlike the global ARGV variable for gjs). Also unlike ARGV, it is safe to modify this array.

`main()` should initialize a GApplication whose id is ${entry-point-name}, and do all the work inside the GApplication vfunc handlers.



