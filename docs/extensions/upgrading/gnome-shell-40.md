---
title: Port Extensions to GNOME Shell 40
---
# Port Extensions to GNOME Shell 40

## Contents

1. [metadata.json](#metadata-json)
2. [Useful Basics](#useful-basics)
   1. [Checking GNOME Shell Version](#checking-gnome-shell-version)
   2. [Checking GTK Version](#checking-gtk-version)
   3. [Importing namespace only when exist](#importing-namespace-only-when-exist)
3. [Top Panel](#top-panel)
4. [Overview Elements](#overview-elements)
   1. [Search Entry](#search-entry)
   2. [Workspace Thumbnails](#workspace-thumbnails)
   3. [Workspace View](#workspace-view)
   4. [Window Preview](#window-preview)
   5. [Window Preview Icon](#window-preview-icon)
   6. [Dash](#dash)
   7. [Applications Grid](#applications-grid)
5. [Prefs](#prefs)
   1. [Template Classes](#new-to-using-template-files-in-prefs-js)
   2. [Migrating from Gtk3 to Gtk4](#provide-css-file-for-prefs)
   3. [Convert and Validate Template Files](#convert-and-validate-template-files)
   4. [Useful Links](#useful-links)

## metadata.json

The first thing you should do to make your extension available on GNOME Shell 40 is adding *"40"* to the *"shell-version"*.

For example, this *metadata.json* means you are supporting GNOME Shell 40 and 3.36:

```json
{
    "name": "Extension Name",
    "description": "Extension Description",
    "shell-version": ["3.36", "40"],
    "url": "",
    "uuid": "example@example",
    "version": 1
}
```

There is a difference between GNOME Shell 40 and older versions. While older GNOME Shell versions treating local and stable versions differently, GNOME Shell 40 treats them the same.

It means if your *metadata.json* is like this:

```json
"shell-version": ["40"],
```

These GNOME Shell versions are also supported in both local and stable versions:

- 40.alpha
- 40.beta
- 40.rc

## Useful Basics

### Checking GNOME Shell Version

```js
const Config = imports.misc.config;
const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major);

if (shellVersion < 40)
    log('Shell 3.38 or lower');
else
    log('Shell 40 or higher');
```

### Checking GTK Version

```js
const {Gtk} = imports.gi;
const gtkVersion = Gtk.get_major_version();

log(`GTK version is ${gtkVersion}`);
```

### Importing namespace only when exist

We have some new namespaces on GNOME Shell 40 ui and some namesapces have been removed. If you only want to import when the namespace exist, you can use *try* and *catch* block:

```js
try {
    const SearchController = imports.ui.searchController;
} catch(err) {
    log("SearchController doesn't exist");
}
```

You can also check GNOME Shell version and then import the namespace:

```js
const Config = imports.misc.config;
const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major);

const SearchController = (shellVersion >= 40) ? imports.ui.searchController : null;

if (!SearchController) {
    log("SearchController doesn't exist");
}
```

## Top Panel

GNOME 40 removed popup menu arrows from the top panel. While not recommended, if you want to add an arrow icon the code still exists in [`ui.popupMenu.arrowIcon()`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/40e22eb524556e63efa4285c1a9d8f872a507499/js/ui/popupMenu.js#L34).

## Overview Elements

Most changes in GNOME Shell 40 are related to the overview. If your extension is doing something with overview elements, you will need to adapt to these changes.

### Search Entry

| Type                     | Where                                    |
| ------------------------ | ---------------------------------------- |
| Direct Access            | `ui.main.overview.searchEntry`           |
| Created In                  | `ui.overviewControls.ControlsManager`    |
| Style Class          | `.search-entry`                          |
| Controller               | `ui.searchController.SearchController`   |

`ui.viewSelector` has been renamed to [`ui.searchController`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/4a7c5890a8b65068a0620ad6c173274013683348/js/ui/searchController.js) in GNOME Shell 40. It controls the search entry behavior.

### Workspace Thumbnails

Since workspace thumbnails won't be shown in single workspace `ui.workspaceThumbnail.ThumbnailsBox` has `should-show` property.

You can change the workspace thumbnails size with `ui.workspaceThumbnail.MAX_THUMBNAIL_SCALE`.

| Type                     | Where                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| Created In                  | [`ui.overviewControls.ControlsManager`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/4a7c5890a8b65068a0620ad6c173274013683348/js/ui/overviewControls.js#L344)                                                               |
| Style Class         | `.workspace-thumbnails` as wrapper, `workspace-thumbnail-indicator` as selected workspace thumbnail |

### Workspace View

Workspace View has two fit modes ([`ui.workspacesView.FitMode`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/4a7c5890a8b65068a0620ad6c173274013683348/js/ui/workspacesView.js#L94)):

- *Single* has been used for overview and shows side workspaces partially.
- *Full* means all the workspaces in one line (like app grid).

| Type                     | Where                                 |
| ------------------------ | ------------------------------------- |
| Created In               | [`ui.overviewControls.ControlsManager`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/ec071ae4c2c747cc432839805d0c3754f647d55a/js/ui/overviewControls.js#L356) |
| Style Class              | `.workspaces-view`                    |

### Window Preview

`ui.windowPreview` is the new namespace that is used for window previews in workspaces view.

Window previews no longer have the `.window-clone-border` style class name for borders but you can still use the `.window-caption` and `.window-close` style class names.

| Type                     | Where                                                     |
| ------------------------ | --------------------------------------------------------- |
| Created In                  | [`ui.workspace.Workspace`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/4a7c5890a8b65068a0620ad6c173274013683348/js/ui/workspace.js#L1319)                                  |
| Style Class          | `.window-caption` for captions, `.window-close` for close |

#### Window Preview Icon

The new window preview icon is part of `ui.windowPreview.WindowPreview` and will be added to the window preview when each `ui.windowPreview.WindowPreview` instance is going to be created.

| Type                     | Where                            |
| ------------------------ | -------------------------------- |
| Created In               | [`ui.windowPreview.WindowPreview`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/750ade34dae296511c246dc6bb07442120141841/js/ui/windowPreview.js#L125) |

### Dash

| Type                     | Where                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| Direct Access            | `ui.main.overview.dash`                                            |
| Created In                  | [`ui.overviewControls.ControlsManager`](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/4a7c5890a8b65068a0620ad6c173274013683348/js/ui/overviewControls.js#L317)                              |
| Origin                   | `ui.dash.Dash`                                                     |
| Style Class          | `#dash` for the wrapper, `.dash-background` for the background |
| Controller               | `ui.dash`                                                          |

`#dash` style reference no longer points to the wrapper. It is the entire bottom area of the screen and it is transparent. If you want to style the dash background you should use `.dash-background` instead.

### Applications Grid

App grid is under workspaces view and above the dash. Workspaces view goes to the full fit mode when you enter into the app grid (`ui.overviewControls.ControlsState.APP_GRID`).

| Type                     | Where                                        |
| ------------------------ | -------------------------------------------- |
| Created In                  | `ui.overviewControls.ControlsManager`        |
| Style Class          | `.icon-grid`, `.apps-scroll-view` as wrapper |

## Prefs

GNOME Shell 40 now uses GTK4 for extension preferences. This means you need to upgrade your prefs.js UI to GTK4.

It is highly recommended to create your GTK UI with template files (*.ui*). This structure decouples back-end and front-end code and make s your work easier to upgrade _and_ more maintainable.

If you are not currently using template files, It is easier to move your current UI to a template file and then port it to GTK4. If you are new to template files you can create your template files with Glade (Glade doesn't support GTK4 but you can create your files with Glade and then port them to GTK4. See [Convert and Validate Template Files](#convert-and-validate-template-files) for instructions).

### New to using Template Files in Prefs.js?

#### Template Classes

There are two ways to use UI files to build your preferences interface. The preferred method is to use **template classes** to provide the UI for a subclass. For example, if your template file is like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">
    <template class="PrefsWidget" parent="GtkBox">
        <property name="orientation">vertical</property>
        <child>
            <object class="GtkButton" id="clickButton">
                <property name="label" translatable="yes">Click Me!</property>
                <signal name="clicked" handler="_onButtonClicked" swapped="no"/>
            </object>
        </child>
    </template>
</interface>
```

You can load it in your `prefs.js` like this:

```js
const {GObject, Gtk} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
}, class PrefsWidget extends Gtk.Box {

    _init(params = {}) {
        super._init(params);
    }
    
    _onButtonClicked(button) {
        button.set_label('Clicked!');
    }
});

function init() {
    ExtensionUtils.initTranslations('my-gettext-domain');
}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

#### GtkBuilder

The more involved way to use UI files is by using GtkBuilder directly:

```xml
<object class="GtkButton">
    <property name="label" translatable="yes">button</property>
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <signal name="clicked" handler="on_btn_click" swapped="no"/>
</object>
```

In this case you will have to create a custom `Gtk.BuilderScope` to connect the signals manually:

```js
const {Gtk, GObject} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const MyBuilderScope = GObject.registerClass({
    Implements: [Gtk.BuilderScope],
}, class MyBuilderScope extends GObject.Object {

    vfunc_create_closure(builder, handlerName, flags, connectObject) {
        if (flags & Gtk.BuilderClosureFlags.SWAPPED)
            throw new Error('Unsupported template signal flag "swapped"');
        
        if (typeof this[handlerName] === 'undefined')
            throw new Error(`${handlerName} is undefined`);
        
        return this[handlerName].bind(connectObject || this);
    }
    
    on_btn_click(connectObject) {
        connectObject.set_label("Clicked");
    }
});

function init () {}

function buildPrefsWidget () {

    let builder = new Gtk.Builder();

    builder.set_scope(new MyBuilderScope());
    builder.set_translation_domain('gettext-domain');
    builder.add_from_file(Me.dir.get_path() + '/prefs.ui');
    
    return builder.get_object('main_widget');
}
```

- In GTK4 GtkBuilder is connecting all the signals automatically.

- You should set the scope with *builder.set_scope()* before adding the template file.

- *MyBuilderScope* class contains all the functions related to the handlers.

- When you click on button, *MyBuilderScope.on_btn_click()* will be called.

- You should declare all handlers functions in *MyBuilderScope*. By dropping any of them, GtkBuilder throws an error.

- You should pick a unique name for *BuilderScope* class to avoid overriding other extensions's *BuilderScope*. It's a good practice to use your extension name for that. For example use *ExtensionNameBuilderScope* instead of *MyBuilderScope*.

### show_all and destroy

In GTK4 all widgets are visible by default (except toplevel windows, popovers and dialogs).

There isn't any need to use *show_all()* and *destroy* signal in your widget anymore:

```js
function buildPrefsWidget ()
{
    let widget = new MyPrefsWidget();
    // widget.show_all();
    // widget.connect('destroy', Gtk.main_quit);
    return widget;
}
```

### Provide css file for prefs

There isn't any *style* properties on GTK4. You should use *css_classes* and css instead.

For example, if you are doing this:

```js
let label = new Gtk.Label({
    label: 'test',
    style: 'color: gold',
});
```

You can use the *css_classes* property:

```js
let label = new Gtk.Label({
    label: 'test',
    css_classes: ['my-label'],
});
```

Now you need to create a css file (For example, *pref.css*) for your prefs window:

```css
.my-label {
    color: gold;
}
```

And load it in your *prefs.js* file:

```js
const Me = imports.misc.extensionUtils.getCurrentExtension();
const {Gtk, Gdk} = imports.gi;

let provider = new Gtk.CssProvider();

provider.load_from_path(Me.dir.get_path() + '/prefs.css');
Gtk.StyleContext.add_provider_for_display(
    Gdk.Display.get_default(),
    provider,
    Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
```

### Widgets Tree Navigation

On GTK4 you can navigate the widgets tree with these functions:

| Navigate To | Function                     |
| ----------- | ---------------------------- |
| first       | GtkWidget.get_first_child()  |
| last        | GtkWidget.get_last_child()   |
| next        | GtkWidget.get_next_sibling() |
| previous    | GtkWidget.get_prev_sibling() |

### No Packing

You don't need to use packing anymore. It means instead of:

```xml
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <child>
        <placeholder/>
    </child>
</object>
<packing>
    <property name="expand">True</property>
    <property name="fill">True</property>
    <property name="position">0</property>
</packing>
```

You should use:

```xml
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <property name="hexpand">1</property>
    <child>
        <placeholder/>
    </child>
</object>
```

- For horizontal expand use *hexpand*.

- For vertical expand use *vexpand*.

- Don't need to use fill property since it will be true by default.

### No margin-left and margin-right property

*margin-left* and *margin-right* property has been removed from GTK4. 

You should use *margin-start* and *margin-end* instead.

For example, instead of:

```xml
<property name="margin-left">5</property>
<property name="margin-right">5</property>
<property name="margin-top">5</property>
<property name="margin-bottom">5</property>
```

You should use:

```xml
<property name="margin-start">5</property>
<property name="margin-end">5</property>
<property name="margin-top">5</property>
<property name="margin-bottom">5</property>
```

### shadow-type

*shadow-type* no longer exists in GTK4 for *GtkFrame*, *GtkViewport* and *GtkScrolledWindow*.

For example, if you are using *shadow-type* in *GtkFrame*:
 
```xml
<object class="GtkFrame">
    <property name="can-focus">True</property>
    <property name="shadow-type">in</property>
</object>
```

Just remove the *shadow-type* property:

```xml
<object class="GtkFrame">
    <property name="can-focus">True</property>
</object>
```

### draw-value property on GtkScale

On GTK4, *draw-value* property for *GtkScale* is *False* by default. Set *draw-value* as *True* if you want to have draw value:

```xml
<object class="GtkScale">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="adjustment">scale_adjustment</property>
    <property name="round-digits">1</property>
    <property name="draw-value">True</property>
</object>
```

### Get Prefs Window and Resize it

If you want to see the template structure for prefs window dialog you can see the [dbusServices in GNOME Shell source code](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/dbusServices/extensions/ui/extension-prefs-dialog.ui).

In GNOME 40 you can get the window like this:

```js
prefsWidget.connect('realize', () => {
    let window = prefsWidget.get_root();
    window.default_width = 700;
    window.default_height = 900;
    // window.resize(700, 900);
});
```

- *prefsWidget* is the main widget you are returning in *buildPrefsWidget()* function.

- Instead of *get_toplevel()* you need to use *get_root()* to have prefs's top level window.

- *resize()* doesn't exist in GTK4 anymore. *default_width* and *default_height* can change the default prefs window size.

### Custom Icon Theme

*Gtk.IconTheme* no longer has *get_default()*. If you want to add your custom icon theme, use *get_for_display()* instead.

For example, if you are using *myextension-logo-symbolic* as your custom icon:

```xml
<object class="GtkImage">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <property name="icon-name">myextension-logo-symbolic</property>
    <property name="icon-size">1</property>
</object>
```

And you have the symbolic file here:

```
extension@extensionfolder
└── icons
    └── hicolor
        └── scalable
            └── categories
                └── myextension-logo-symbolic.svg
```

Just use *add_search_path* like this:

```js
const {Gtk, Gdk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let iconPath = Me.dir.get_child("icons").get_path();
let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
iconTheme.add_search_path(iconPath);
```

### can-focus property

Unlike GTK3, when you set *can-focus* property as *False* for an object, all the descendants no longer can be focused. For example, here *GtkToggleButton* cannot be focused, because *can-focus* property on *GtkBox* is *False*:

```xml
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <property name="hexpand">1</property>
    <child>
        <object class="GtkToggleButton">
            <property name="visible">True</property>
            <property name="can-focus">True</property>
        </object>
    </child>
</object>
```

To fix that you need to set *can-focus* property as *True* for GtkBox:

```xml
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="hexpand">1</property>
    <child>
        <object class="GtkToggleButton">
            <property name="visible">True</property>
            <property name="can-focus">True</property>
        </object>
    </child>
</object>
```

### Adding to the Containers

In GTK4 we have class specific *add* functions instead of general *add* coming from GtkContainer.

These are the alternatives for adding to the containers:

| Gtk Widget        | Alternative                               |
| ----------------- | ----------------------------------------- |
| GtkActionBar      | .pack_start() and .pack_end()             |
| GtkAspectFrame    | .set_child()                              |
| GtkBox            | .prepend() and .append()                  |
| GtkButton         | .set_child()                              |
| GtkComboBox       | .set_child()                              |
| GtkExpander       | .set_child()                              |
| GtkFixed          | .put()                                    |
| GtkFlowBox        | .insert()                                 |
| GtkFlowBoxChild   | .set_child()                              |
| GtkFrame          | .set_child()                              |
| GtkGrid           | .attach()                                 |
| GtkHeaderBar      | .pack_start() and .pack_end()             |
| GtkInfoBar        | .add_child()                              |
| GtkListBox        | .insert()                                 |
| GtkListBoxRow     | .set_child()                              |
| GtkNotebook       | .append_page()                            |
| GtkOverlay        | .set_child()                              |
| GtkPaned          | .set_start_child() and .set_end_child()   |
| GtkPopover        | .set_child()                              |
| GtkRevealer       | .set_child()                              |
| GtkSearchBar      | .set_child()                              |
| GtkStack          | .add_child()                              |
| GtkScrolledWindow | .set_child()                              |
| GtkTextView       | .add_child_at_anchor() and .add_overlay() |
| GtkViewport       | .set_child()                              |
| GtkWindow         | .set_child()                              |

For example, if you are doing this with *GtkBox*:

```js
let hBox = new Gtk.Box();
hBox.set_orientation(Gtk.Orientation.HORIZONTAL);

hBox.pack_start(myLabel, false, false, 0);
hBox.pack_end(myLabel2, false, false, 0);
```

You should use *prepend* and *append* instead of *pack_start* and *pack_end*:

```js
let hBox = new Gtk.Box();
hBox.set_orientation(Gtk.Orientation.HORIZONTAL);

hBox.prepend(myLabel);
hBox.append(myLabel2);
```

And if you want to remove *myLabel* from *hBox* you can use *remove*:

```js
let hBox = new Gtk.Box();
hBox.set_orientation(Gtk.Orientation.HORIZONTAL);

hBox.prepend(myLabel);
hBox.remove(myLabel1);
```

### -gtk-gradient

*-gtk-gradient* is no longer supported in GTK4. Use css standard gradient instead.

For example, if you are doing this:

```css
.my-class {
    background-image: -gtk-gradient (
        linear,
        left top,
        right bottom,
        from(@yellow),
        to(@blue));
}
```

Use *linear-gradient* instead:

```css
.my-class {
    background-image: linear-gradient(to right bottom, yellow, blue);
}
```

### GtkHeaderBar

On GTK4, these *GtkHeaderBar* functions have new names:

| GTK3                                    | GTK4                                    |
| --------------------------------------- | --------------------------------------- |
| `GtkHeaderBar.set_show_close_button()`  | `GtkHeaderBar.set_show_title_buttons()` |
| `GtkHeaderBar.set_custom_title()`       | `GtkHeaderBar.set_title_widget()`       |

For example:

```js
prefsWidget.connect('realize', () => {
    
    let window = prefsWidget.get_root();
    
    let headerBar = new Gtk.HeaderBar({show_title_buttons: false});
     
    // use this instead of headerBar.set_show_close_button(true);
    headerBar.set_show_title_buttons(true);
    
    window.set_titlebar(headerBar);
});
```

- *prefsWidget* is the main widget you are returning in *buildPrefsWidget()* function.

- *headerBar* is the GtkHeaderBar widget you want to have it on window.

- The default value for *set_show_title_buttons()* is *true*. You don't need to use it if you want to have title button.

- With *set_titlebar()* you can add your *GtkHeaderBar* to the window just like before.

#### GtkHeaderBar sub title

GTK4 removed *set_subtitle()* function from *GtkHeaderBar*. If you want to have the old *subtitle* behavior, you can use *title-widget* property with *title* and *subtitle* class like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
    <object class="GtkHeaderBar">
        <property name="title-widget">
            <object class="GtkBox">
                <property name="visible">True</property>
                <property name="can-focus">True</property>
                <property name="vexpand">1</property>
                <property name="valign">center</property>
                <property name="orientation">vertical</property>
                <child>
                    <object class="GtkLabel">
                        <property name="label" translatable="yes">Title</property>
                        <property name="single-line-mode">True</property>
                        <property name="ellipsize">end</property>
                        <property name="width-chars">10</property>
                        <style>
                          <class name="title"/>
                        </style>
                    </object>
                </child>
                <child>
                    <object class="GtkLabel" id="subtitle">
                        <property name="label" translatable="yes">Sub Title</property>
                        <property name="single-line-mode">True</property>
                        <property name="ellipsize">end</property>
                        <property name="width-chars">10</property>
                        <style>
                          <class name="subtitle"/>
                        </style>
                    </object>
                </child>
            </object>
        </property>
    </object>
</interface>
```

- First *GtkLabel* with *title* class is the window title and the second *GtkLabel* with *subtitle* class is the window sub title.

- If you want to change the sub title, you can change the label with `.set_label("New Sub Title")` on *subtitle* object.

### GtkFileChooserButton

*GtkFileChooserButton* has been removed and no longer exist. You can use *GtkButton* and *GtkFileChooserNative* to have the same behavior.

For example, if your *prefs.ui* file is like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">
    <template class="PrefsWidget" parent="GtkBox">
        <property name="orientation">vertical</property>
        <child>
            <object class="GtkButton" id="file_chooser_button">
                <property name="halign">end</property>
                <property name="valign">center</property>
                <property name="label" translatable="yes">Open</property>
                <signal name="clicked" handler="_onBtnClicked" swapped="no"/>
            </object>
        </child>
    </template>
    <object class="GtkFileChooserNative" id="file_chooser">
        <property name="title" translatable="yes">File Chooser Title</property>
        <property name="select-multiple">0</property>
        <property name="action">open</property>
        <property name="modal">1</property>
        <signal name="response" handler="_onFileChooserResponse" swapped="no"/>
    </object>
</interface>
```

You can do this in your *prefs.js* file:

```js
const {GObject, Gtk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();


const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'file_chooser',
        'file_chooser_button',
    ],
}, class PrefsWidget extends Gtk.Box {
 
    _init(params = {}) {
        super._init(params);
    }
    
    _onBtnClicked(btn) {
        let parent = btn.get_root();
        this._file_chooser.set_transient_for(parent);
        this._file_chooser.show();
    }
    
    _onFileChooserResponse(native, response) {
        if (response !== Gtk.ResponseType.ACCEPT) {
            return;
        }
        let fileURI = native.get_file().get_uri();
        this._file_chooser_button.set_label(fileURI);
    }
});

function init() {}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

### GtkPasswordEntry

GTK4 has new entry for password. If you are using the entry for password, you should use GtkPasswordEntry:

```xml
<object class="GtkPasswordEntry">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="show-peek-icon">1</property>
    <property name="placeholder-text" translatable="yes">Text</property>
</object>
```

*show-peek-icon* is for toggle button to show the entry content in clear text.

### Menu and Sub Menu

GTK4 no longer has *GtkMenu*, *GtkMenuBar* and *GtkMenuItem*. You can use these alternatives with *GtkMenuButton*:

| GTK3       | GTK4 Alternative  |
| ---------- | ----------------- |
| GtkMenu    | GtkPopoverMenu    |
| GtkMenuBar | GtkPopoverMenuBar |

Or you can directly use toplevel *menu* element.

#### menu and submenu elements

You can use toplevel *menu* element with *GtkMenuButton*:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">
  
    <menu id="mymenu">
        <section>
            <attribute name='label' translatable='yes'>Section Header</attribute>
            <submenu>
                <attribute name='label' translatable='yes'>Others</attribute>
                    <section>
                        <item>
                            <attribute name='label' translatable='yes'>Test</attribute>
                            <attribute name='action'>mygroup.test</attribute>
                        </item>
                    </section>
            </submenu>
            <item>
                <attribute name='label' translatable='yes'>Menu Item</attribute>
                <attribute name='action'>mygroup.other</attribute>
            </item>
        </section>
    </menu>
    
    <template class="PrefsWidget" parent="GtkBox">
        <property name="visible">True</property>
        <property name="can-focus">True</property>
        <property name="vexpand">1</property>
        <child>
            <object class="GtkBox">
                <property name="visible">True</property>
                <property name="can-focus">True</property>
                <property name="orientation">vertical</property>
                <child>
                    <object class="GtkMenuButton">
                        <property name="receives-default">True</property>
                        <property name="menu-model">mymenu</property>
                        <property name="icon-name">open-menu-symbolic</property>
                    </object>
                </child>
            </object>
        </child>
    </template>
    
</interface>
```

- *menu* is a toplevel element contains at least one *item* element.

- *submenu* has the same content model as *menu* element.

And now on prefs you can connect the signals like this:

```js
prefsWidget.connect('realize', () => {
    
    let window = prefsWidget.get_root();
    let actionGroup = new Gio.SimpleActionGroup();
    
    let action = new Gio.SimpleAction({ name: 'other' });
    action.connect('activate', () => {
        log('Other Clicked');
    });
    actionGroup.add_action(action);
    
    let action2 = new Gio.SimpleAction({ name: 'test' });
    action2.connect('activate', () => {
        log('Test Clicked');
    });
    actionGroup.add_action(action2);
    
    window.insert_action_group('mygroup', actionGroup);
});
```

- *prefsWidget* is the main widget you are returning in *buildPrefsWidget()* function.

- We are adding all actions to the window with *GtkWindow.insert_action_group()* function because *GtkWindow* inherited *GtkWidget*.

#### GtkPopoverMenu 

While *GtkMenuButton* accepts *menu-model* you can alternativly create your own *GtkPopoverMenu* with *menu*.

For example, if your ui file is like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">
  
    <menu id="mymenu">
        <item>
            <attribute name='label' translatable='yes'>Menu Item</attribute>
        </item>
    </menu>
    
    <template class="PrefsWidget" parent="GtkBox">
        <property name="visible">True</property>
        <property name="can-focus">True</property>
        <property name="vexpand">1</property>
        <child>
            <object class="GtkBox">
                <property name="visible">True</property>
                <property name="can-focus">True</property>
                <property name="orientation">vertical</property>
                <child>
                    <object class="GtkMenuButton" id="menubtn">
                        <property name="receives-default">True</property>
                        <property name="icon-name">open-menu-symbolic</property>
                    </object>
                </child>
            </object>
        </child>
    </template>
    
</interface>
```

You can create a *GtkPopoverMenu* with *mymenu* menu model and assign the *GtkPopoverMenu* to *GtkMenuButton*:

```js
const {GObject, Gtk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();


const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'mymenu',
        'menubtn',
    ],
}, class PrefsWidget extends Gtk.Box {
 
    _init(params = {}) {
        
        super._init(params);
        
        this._popoverMenu = Gtk.PopoverMenu.new_from_model(this._mymenu);
		this._menubtn.set_popover(this._popoverMenu);
    }
});

function init() {}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

You should use *GtkPopover* if you want to have other widgets inside your menu.

### Icon Size

GTK4 only supports normal and large icon size:

| const                 | icon-size property value |
| --------------------- | ------------------------ |
| GTK_ICON_SIZE_INHERIT | 0                        |
| GTK_ICON_SIZE_NORMAL  | 1                        |
| GTK_ICON_SIZE_LARGE   | 2                        |

For example, if you are using normal size for *icon-size*, it should have *1* as property value:

```xml
<object class="GtkImage">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="icon-name">system-search-symbolic</property>
    <property name="icon-size">1</property>
</object>
```

Also *stock-size* property of *GtkCellRendererPixbuf* is now *icon-size*.

### Show and Hide with Animation

*.show()* and *.hide()* no longer make the revealing elements appear and disappear with animation. To do that, you need to use these:

| Widget      | Animate Show                         | Animate Hide                          |
| ----------- | ------------------------------------ | ------------------------------------- |
| GtkRevealer | `GtkRevealer.set_reveal_child(true)` | `GtkRevealer.set_reveal_child(false)` |
| GtkPopover  | `GtkPopover.popup()`                 | `GtkPopover.popdown()`                |
| GtkInfoBar  | `GtkInfoBar.set_revealed(true)`      | `GtkInfoBar.set_revealed(false)`      |

### GtkPicture

*GtkPicture* is a new widget on GTK4. It's better to use *GtkImage* for icons and *GtkPicture* for other images.

For example, you can create *GtkPicture* element in your JavaScript code like this:

```js
const {Gtk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let picture = Gtk.Picture.new_for_filename(Me.dir.get_path() + "/image.png");
picture.set_size_request(800, 600);
```

### GtkMenuButton

*GtkMenuButton* no longer supports *GtkImage* as its icon.

For example, *GtkImage* will be ignored if you are doing this:

```xml
<object class="GtkMenuButton">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="focus-on-click">True</property>
    <property name="receives-default">True</property>
    <property name="popover">popwidget</property>
    <child>
      <object class="GtkImage">
        <property name="visible">True</property>
        <property name="can-focus">False</property>
        <property name="icon-name">open-menu-symbolic</property>
        <property name="icon-size">1</property>
      </object>
    </child>
</object>
```

*GtkMenuButton*'s default icon is arrow and that will be shown instead of *open-menu-symbolic*.

To fix that, you can use *icon-name* and *icon-size* properties inside "GtkMenuButton":

```xml
<object class="GtkMenuButton">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="focus-on-click">True</property>
    <property name="receives-default">True</property>
    <property name="popover">popwidget</property>
    <property name="icon-name">open-menu-symbolic</property>
    <property name="icon-size">1</property>
</object>
```

### EventControllerKey

*add_controller()* is a new function in *Gtk.Widget* and helps you to add controller to the widget.

For example, if your *prefs.ui* is like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">
    
    <template class="PrefsWidget" parent="GtkBox">
        <property name="visible">True</property>
        <property name="can-focus">True</property>
        <property name="orientation">vertical</property>
        <child>
            <object class="GtkLabel" id="log_label">
                <property name="label">Key Log</property>
            </object>
        </child>
    </template>
    
    <object class="GtkEventControllerKey" id="event_key_controller">
        <signal name="key-pressed" handler="_onKeyPressed" swapped="no"/>
    </object>
    
</interface>
```

You can add the *GtkEventControllerKey* to the prefs window like this:

```js
const {GObject, Gtk, Gdk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();


const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'log_label',
        'event_key_controller',
    ],
}, class PrefsWidget extends Gtk.Box {
 
    _init(params = {}) {
        
        super._init(params);
        
        this.connect('realize', () => {
            let window = this.get_root();
            window.add_controller(this._event_key_controller);
        });
    }
    
    _onKeyPressed(widget, keyval, keycode, state) {
    
        let mask = state & Gtk.accelerator_get_default_mod_mask();
        
        let binding = Gtk.accelerator_name_with_keycode(
            null, keyval, keycode, mask);
        
        this._log_label.set_label('Binding is: ' + binding);
        
        return Gdk.EVENT_STOP;
    }
});

function init() {}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

*Gtk.EventControllerKey.new()* no longer accepts any parameters. For example, if you are creating *EventControllerKey* in your js file, you need to do this to have the same result:

```js
const {Gtk, Gdk} = imports.gi;

prefsWidget.connect('realize', () => {
        
    let window = prefsWidget.get_root();
    
    let evck = Gtk.EventControllerKey.new();
    window.add_controller(evck);
    
    evck.connect('key-pressed', (widget, keyval, keycode, state) => {

        let mask = state & Gtk.accelerator_get_default_mod_mask();
        
        let binding = Gtk.accelerator_name_with_keycode(
            null, keyval, keycode, mask);
        
        log('Binding is: ' + binding);
        
        return Gdk.EVENT_STOP;
    });
});
```

*prefsWidget* is the main widget you are returning in *buildPrefsWidget()* function.

### Gtk.accelerator_parse()

*Gtk.accelerator_parse()* function in GTK4 returns *three* elements instead of *two*.

For example, if you are doing this:

```js
let [key, mods] = Gtk.accelerator_parse('<Control>a');
```

The first element is boolean and means whether the parse result is ok:

```js
let [ok, key, mods] = Gtk.accelerator_parse('<Control>a');
```

### GtkRadiobutton

`Gtk.RadioButton` no longer exist in GTK4. To have the same behavior you can use [`GtkToggleButton`](https://gjs-docs.gnome.org/gtk40/gtk.togglebutton) with `group` property.

For example:

```xml
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <child>
        <object class="GtkToggleButton" id="toggle_btn1">
            <property name="visible">True</property>
            <property name="can-focus">True</property>
            <property name="label" translatable="yes">First</property>
            <property name="active">1</property>
        </object>
    </child>
    <child>
        <object class="GtkToggleButton" id="toggle_btn2">
            <property name="visible">True</property>
            <property name="can-focus">True</property>
            <property name="label" translatable="yes">Second</property>
            <property name="group">toggle_btn1</property>
        </object>
    </child>
    <style>
      <class name="linked"/>
    </style>
</object>
```

*linked* style class makes two toggle buttons attached together.

### Convert and Validate Template Files

First, Install *gtk4-builder-tool*:

```bash
$ sudo dnf install gtk4-devel
```

To check whether the *.ui* template file is compatible with GTK4 you can do this:

```bash
$ gtk4-builder-tool validate path_to_ui_file
```

You can also convert your file to GTK4:

```bash
$ gtk4-builder-tool simplify --3to4 path_to_ui_file 
```

If you want to replace the file with simplified version:

```bash
$ gtk4-builder-tool simplify --3to4 --replace path_to_ui_file
```

*While the builder tool simplify can help you to convert gtk3 to gtk4, it cannot convert everything. You need to change some parts manually.*

### Useful Links

- [GTK 4 Reference Manual][gtk4]

- [GTK 4 Reference Manual for gjs][gjs-gtk4]

- [Migrating from GTK 3.x to GTK 4][gtk3to4]



[gtk4]: https://developer.gnome.org/gtk4/stable/
[gjs-gtk4]: https://gjs-docs.gnome.org/gtk40/
[gtk3to4]: https://developer.gnome.org/gtk4/stable/gtk-migrating-3-to-4.html
