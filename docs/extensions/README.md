---
title: Extensions
---

# GNOME Shell Extensions

## Introduction

GNOME Shell's UI and extensions are written in GJS, which is JavaScript bindings for the [GNOME APIs][gnome-api].

JavaScript is a prototype-based language, which means that extensions can modify the UI and behaviour of GNOME Shell *while* it is running. This is what is known as "monkey-patching".

## Overview

> The basics of extensions

### [Anatomy](overview/anatomy.md)

What an extension is made of

### [Imports and Modules](overview/imports-and-modules.md)

How to use imports and modules

### [Architecture](overview/architecture.md)

GNOME Shell Architecture

### [Updates and Breakage](overview/updates-and-breakage.md)

GNOME Shell updates and how they affect extensions

## Development

### [Creating](development/creating.md)

Creating an extension

###  [Preferences](development/preferences.md)

Creating a preferences window

### [Translations](development/translations.md)

How add multi-lingual support an extension

### [Debugging](development/debugging.md)

How to debug an extension

### [Targeting Older GNOME Versions](development/targeting-older-gnome.md)

Making the extension work on multiple versions of GNOME

## Topics

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
