---
title: Extensions
---

# GNOME Shell Extensions

## Introduction

GNOME Shell and extensions are written in GJS, which is JavaScript bindings for
[GNOME Platform APIs][gnome-api]. For an overview of how extensions fit into
GNOME Shell and the platform, see the [Architecture](overview/architecture.md)
page.

For a general programming tasks with GJS, there are guides for topics like
[Asynchronous Programming](../guides/gjs/asynchronous-programming.md) and
[Working with Files](../guides/gio/file-opertations.md), as well as gentle
introductions to core concepts like [GObject](../guides/gobject/basics.md).

#### Getting Help

There are several ways for you to get help with your extension.

- Ask on [Discourse][discourse], GNOME's official forums
- Ask in the [Matrix][gnome-extensions-matrix]/[IRC][gnome-extensions-irc] room
- Ask on [StackOverflow][stackoverflow]

There are also tutorial videos by extension developer and reviewer
[JustPerfection][justperfection-videos].

[discourse]: https://discourse.gnome.org/tag/extensions
[stackoverflow]: https://stackoverflow.com/questions/tagged/gnome-shell-extensions+gjs
[gnome-extensions-irc]: irc://irc.gimpnet.org/shell-extensions
[gnome-extensions-matrix]: https://matrix.to/#/#extensions:gnome.org
[justperfection-videos]: https://www.youtube.com/watch?v=iMyR5lJf7dU&list=PLr3kuDAFECjZhW-p56BoVB7SubdUHBVQT

## Development

### [Getting Started](development/creating.md)

How to get started creating your first extension

### [Accessibility](development/accessibility.md)

How to ensure your extension is accessible

###  [Preferences](development/preferences.md)

Creating a preferences window

### [Translations](development/translations.md)

How add multi-lingual support an extension

### [Debugging](development/debugging.md)

How to debug an extension

### [Targeting Older GNOME Versions](development/targeting-older-gnome.md)

Making the extension work on multiple versions of GNOME

## Overview

> General reference for extension concepts, files and architecture

### [Anatomy](overview/anatomy.md)

Detailed explanation of the files and structure of a GNOME Shell Extension

### [Imports and Modules](overview/imports-and-modules.md)

How to use imports and modules in GNOME Shell and extensions

### [Architecture](overview/architecture.md)

High-level overview of GNOME Shell as it relates to extensions

### [Updates and Breakage](overview/updates-and-breakage.md)

GNOME Shell updates and how they affect extensions

## Topics

### [ExtensionUtils](topics/extension-utils.md)

Documentation for built-in extension utilities

### [Dialogs](topics/dialogs.md)

Documentation for dialogs in GNOME Shell

### [PopupMenus](topics/popup-menu.md)

Documentation for popup menus in GNOME Shell

### [Quick Settings](topics/quick-settings.md)

How to add quick settings to an extension.

### [Search Provider](topics/search-provider.md)

How to add a [Search Provider](search-provider) to an extension.

### [Session Modes](topics/session-modes.md)

How to work with session modes in GNOME Shell

## Upgrading

How to upgrade extensions across Shell versions

- [GNOME Shell 44](upgrading/gnome-shell-44.md)
- [GNOME Shell 43](upgrading/gnome-shell-43.md)
- [GNOME Shell 42](upgrading/gnome-shell-42.md)
- [GNOME Shell 40](upgrading/gnome-shell-40.md)

## Review Guidelines

> Guidelines for developers who would like their extensions distributed on [ego][ego]

### [Review Guidelines](review-guidelines/review-guidelines.md)

GNOME Shell Extensions Review Guidelines

[ego]: https://extensions.gnome.org
[gnome-api]: https://gjs-docs.gnome.org
[search-provider]: https://developer.gnome.org/documentation/tutorials/search-provider.html
