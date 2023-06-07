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

`init()` is called by GNOME Shell when your extension is loaded, not when it is
enabled. Your extension **MUST NOT** create any objects, connect any signals,
add any main loop sources or modify GNOME Shell here.

It is permitted to create static objects and arrays in the global scope or
`init()` (e.g. enumerations or string lists), but constructing class instances
is not permitted. Objects intended to be constructed as instances should be
created when `enable()` is called, and destroyed when `disable()` is called.

@[code js](@src/extensions/review-guidelines/initNoInstances.js)

As a rule, `init()` should **ONLY** be used for operations that can only be done
once and can not be undone. Most extensions should only use `init()` to
initialize Gettext translations:

@[code js](@src/extensions/review-guidelines/initTranslations.js)

If using the `Extension()` object pattern, this extends to the `constructor()`
of the `Extension` class:

@[code js](@src/extensions/review-guidelines/initTranslationsAlternate.js)

### Destroy all objects

Any objects or widgets created by an extension **MUST** be destroyed in
`disable()`:

@[code js](@src/extensions/review-guidelines/destroyObjects.js)

### Disconnect all signals

Any signal connections made by an extension **MUST** be disconnected in
`disable()`:

@[code js](@src/extensions/review-guidelines/disconnectSignals.js)

### Remove main loop sources

Any main loop sources created **MUST** be removed in `disable()`:

@[code js](@src/extensions/review-guidelines/removeSources.js)

You **MUST** remove all active main loop sources in `disable()`, even if the
callback function will eventually return `false` or `GLib.SOURCE_REMOVE`.

### Code must not be obfuscated

Extension code **MUST** be readable and reviewable JavaScript.

Although a specific code-style is not enforced during review, it is expected that your code is formatted in a way that can be understood by reviewers. Specifically, the following rules **MUST** be adhered to:

- JavaScript code must be legible and reasonably structured
- JavaScript code must not be minified or obfuscated
- TypeScript must be transpiled to well-formatted JavaScript

### No excessive logging

Extension **MUST NOT** print excessively to the log. The log should only be used for important messages and errors.

If a reviewer determines that an extension is writing excessively to the log, the extension will be rejected.

### Scripts and Binaries

Use of external scripts and binaries is strongly discouraged. In cases where this is unavoidable for the extension to serve it's purpose, the following rules must be adhered to:

- Extensions **MUST NOT** include binary executables or libraries
- Processes **MUST** be spawned carefully and exit cleanly
- Scripts must be written in GJS, unless absolutely necessary
- Scripts must be short, simple and distributed under an OSI approved license

Reviewing Python modules, HTML, and web [JavaScript][javascript] dependencies is out of scope for extensions.gnome.org. Unless required functionality is only available in another scripting language, scripts must be written in GJS.

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
| version | **Deprecated:** This field is set for internal use by `extensions.gnome.org`. |
| shell-version | This **MUST** only contain stable releases and up to one development release. Extensions must not claim to support future GNOME Shell versions. As of GNOME 40, an entry may simply be a major version like `40` to cover the entire release. |
| url | This should be a link to a Github or [GitLab][gitlab] repository where users can report problems and learn more about your extension. |
| session-modes | This **MUST** be dropped if you are only using `user` mode. The only valid values are `user` and `unlock-dialog`. |
| donations | This **MUST** only contain [possible keys][anatomy-donations] and **MUST** be dropped if you don't use any of the keys. |

Example:

@[code json](@src/extensions/review-guidelines/metadata.json)

### Session Modes

In rare cases, it is necessary for an extension to continue running while the screen is locked. In order to be approved to use the `unlock-dialog` session mode:

- It **MUST** be necessary for the extension to operate correctly.
- All signals related to keyboard events **MUST** be disconnected in `unlock-dialog` session mode.
- The disable() function **MUST** have a comment explaining why you are using `unlock-dialog`.

Extensions **MUST NOT** disable selectively.

### GSettings Schemas

For extensions that include a GSettings Schema:

- The Schema ID **MUST** use `org.gnome.shell.extensions` as a base ID.
- The Schema path **MUST** use `/org/gnome/shell/extensions` as a base path.
- The Schema XML file **MUST** be included in the extension ZIP file.
- The Schema XML filename **MUST** follow pattern of `<schema-id>.gschema.xml`.

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
[anatomy-donations]: /extensions/overview/anatomy.html#donations

