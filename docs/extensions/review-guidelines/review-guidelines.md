---
title: GNOME Shell Extensions Review Guidelines
---
# GNOME Shell Extensions Review Guidelines

These are the guidelines for developers who would like their extensions distributed on [ego][ego]. Submissions that fail to meet the requirements will be rejected during the review period.

Extensions are reviewed carefully for malicious code, malware and security risks, but not for bugs or issues. It is the responsibility of the developer to test an extension's functionality before submission.

If this is your first time writing an extension, please see the documentation available on [gjs.guide][gjsg].

## Basics

### General Advice

- Write clean code, with consistent indentation and style
- Test a clean install of your extension before uploading
- Don't use classes or methods from the deprecated `Lang` module

### Guidelines

- Only use `init()` to initialize Gettext translations and static resources
- Use `enable()` to start creating objects, connecting signals
- Use `disable()` to revert any changes, disconnect signals and destroy objects
- Only spawn subprocesses as a last resort and never synchronously

## Rules

### Only use init() for initialization

`init()` is called by GNOME Shell when your extension is loaded, not when it is enabled. Your extension **MUST NOT** create any objects, connect any signals, add any main loop sources or modify GNOME Shell here.

As a rule, `init()` should **ONLY** be used for operations that can only be done once and can not be undone. Most extensions should only use `init()` to initialize Gettext translations:

```js
const ExtensionUtils = imports.misc.extensionUtils;


function init() {
    ExtensionUtils.initTranslations();
}

function enable() {
    // Create objects, connect signals, create timeout sources, etc.
}

function disable() {
    // Destroy objects, disconnect signals, remove timeout sources, etc.
}
```

If using the `Extension()` object pattern, this extends to the `constructor()` of the `Extension` class:

```js
const ExtensionUtils = imports.misc.extensionUtils;


class Extension {
    constructor() {
        // DO NOT create objects, connect signals or add main loop sources here
    }

    enable() {
        // Create objects, connect signals, create timeout sources, etc.
    }

    disable() {
        // Destroy objects, disconnect signals, remove timeout sources, etc.
    }
}

function init() {
    // Initialize translations before returning the extension object
    ExtensionUtils.initTranslations();

    return new Extension();
}
```

### Destroy all objects

Any objects or widgets created by an extension **MUST** be destroyed in `disable()`:

```js
const St = imports.gi.St;

let widget = null;

function init() {
}

function enable() {
    widget = new St.Widget();
}

function disable() {
    if (widget) {
        widget.destroy();
        widget = null;
    }
}
```

### Disconnect all signals

Any signal connections made by an extension **MUST** be disconnected in `disable()`:

```js
const St = imports.gi.St;

let widget = null;
let handlerId = null;

function init() {
}

function enable() {
    widget = new St.Widget();

    handlerId = object.connect('notify::visible', () => {
        log('visibility changed');
    });
}

function disable() {
    if (widget) {
        if (handlerId) {
            widget.disconnect(handlerId);
            handlerId = null;
        }

        widget.destroy();
        widget = null;
    }
}
```

### Remove main loop sources

Any main loop sources created **MUST** be removed in `disable()`:


```js
const GLib = imports.gi.GLib;

let sourceId = null;

function init() {
}

function enable() {
    sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
        log('Source triggered');

        return GLib.SOURCE_CONTINUE;
    });
}

function disable() {
    if (sourceId) {
        GLib.Source.remove(sourceId);
        sourceId = null;
    }
}
```

### No excessive logging

Extension **MUST NOT** print excessively to the log. The log should only be used for important messages and errors.

If a reviewer determines that an extension is writing excessively to the log, the extension will be rejected.

### Scripts and Binaries

Use of external scripts and binaries is strongly discouraged. In cases where this is unavoidable for the extension to serve it's purpose, the following rules must be adhered to:

- Extensions **MUST NOT** include binary executables or libraries
- Processes **MUST** be spawned carefully and exit cleanly
- Scripts must be short, simple and distributed under an OSI approved license

Reviewing Python modules, HTML, and web [JavaScript][javascript] dependencies is out of scope for extensions.gnome.org.

Extensions may install modules from well-known services such as `pip`, `npm` or `yarn` but **MUST** require explicit user action. For example, the extension preferences may include a page which describes the modules to be installed with a button.

### Privileged Subprocess must not be user-writable

Spawning privileged subprocesses should be avoided at all costs.

If absolutely necessary, the subprocess **MUST** be run with `pkexec` and **MUST NOT** be an executable or script that can be modified by a user process.

### Extensions must be functional

Extensions are reviewed, but not always tested for functionality so an extension **MAY** be approved with broken functionality or inoperable preferences window.

However, if an extension is tested and found to be fundamentally broken it will be rejected. Extensions which serve no purpose or have no functionality will also be rejected.

### metadata.json must be well-formed

The _metadata.json_ file that ships with every extension should be well-formed and accurately reflect the extension.

| Key | Description |
| :-- | :-- |
| name | This should not conflict with another extension if possible. If it is a fork of another extension it **MUST** have a unique name to distinguish it. |
| uuid | This must be of the form `extension-id@user-domain`. `extension-id` and `user-domain` **MUST** only contain numbers, letters, period (`.`), underscore (`_`) and dash (`-`). `user-domain` **MUST** be a domain or namespace you control and be separated from `extension-id` with an `@` symbol. |
| description | This should be a reasonable length, but may contain a few paragraphs separated with `\n` literals or a bullet point list made with `*` characters. |
| version | This must be a whole number like `2`, not a string like `"2"` or semantic version like `2.1`.  |
| shell-version | This **MUST** only contain stable releases and up to one development release. Extensions must not claim to support future GNOME Shell versions. As of GNOME 40, an entry may simply be a major version like `40` to cover the entire release. |
| url | This should be a link to a Github or [GitLab][gitlab] repository where users can report problems and learn more about your extension. |

Example:

```json
{
    "uuid": "color-button@my-account.github.io",
    "name": "ColorButton",
    "description": "ColorButton adds a colored button to the panel.\n\nIt is a fork of MonochromeButton.",
    "version": 1,
    "shell-version": [ "3.38", "40", "41.alpha" ],
    "url": "https://github.com/my-account/color-button"
}
```

## Legal Restrictions

### Licensing

GNOME Shell is licensed under the terms of the `GPL-2.0-or-later`, which means that derived works like extensions **MUST** be distributed under compatible terms (eg. `GPL-2.0-or-later`, `GPL-3.0-or-later`).

While your extension may include code licensed under a permissive license such as BSD/MIT, you are still approving GNOME to distribute it under terms compatible with the `GPL-2.0-or-later`.

If your extension contains code from another extension it **MUST** include attribution to the original author in the distributed files. Not doing so is a license violation and your extension will be rejected.

### Copyrights and Trademarks

Extensions **MUST NOT** include copyrighted or trademarked content without proof of express permission from the owner. Examples include:

- Brand Names and Phrases
- Logos and Artwork
- Audio, Video or Multimedia

## Recommendations

### Don't include unnecessary files

Extension submissions should not include files that are not necessary for it to function. Examples include:

- build or install scripts
- .po and .pot files
- unused icons, images or other media

A reviewer **MAY** decide to reject an extension which includes an unreasonable amount of unnecessary data.

### Use a linter

Using [ESLint][eslint] to check your code can catch syntax errors and other mistakes before submission, as well as enforce consistent code style. You can find the ESLint rules used by GNOME Shell [on GitLab][shelllint].

Following a specific code style is not a requirement for approval, but if the codebase of an extension is too messy to properly review it **MAY** be rejected. This includes obfuscators and transpilers used with TypeScript.

### UI Design

Although not required for approval, it is recommended that extension preferences follow the [GNOME Human Interface Guidelines][hig] to improve consistency with the GNOME desktop.

## Getting Help

There are several ways for you to get help with your extension.

- Ask on [discourse.gnome.org][dgo] using the [extensions tag][dgo-extensions]
- Ask on StackOverflow using the [gnome-shell-extensions][stackoverflow-extensions] and/or [gjs][stackoverflow-gjs] tags
- Ask in the extensions [IRC][gnome-extensions-irc] / [Matrix][gnome-extensions-matrix] room

[ego]: https://extensions.gnome.org
[gjsg]: https://gjs.guide
[javascript]: https://wiki.gnome.org/JavaScript
[gitlab]: https://wiki.gnome.org/GitLab
[eslint]: https://eslint.org/
[shelllint]: https://gitlab.gnome.org/GNOME/gnome-shell-extensions/tree/main/lint
[hig]: https://developer.gnome.org/hig/
[dgo]: https://discourse.gnome.org/
[dgo-extensions]: https://discourse.gnome.org/tag/extensions
[stackoverflow-extensions]: https://stackoverflow.com/questions/tagged/gnome-shell-extensions
[stackoverflow-gjs]: https://stackoverflow.com/questions/tagged/gjs
[gnome-extensions-irc]: irc://irc.gimpnet.org/shell-extensions
[gnome-extensions-matrix]: https://matrix.to/#/#extensions:gnome.org

