---
title: Extensions
---

# GNOME Shell Extensions

## Introduction

GNOME Shell's UI and extensions are written in GJS, which is JavaScript bindings for the [GNOME APIs][gnome-api].

JavaScript is a prototype-based language, which means that extensions can modify the UI and behaviour of GNOME Shell *while* it is running. This is what is known as "monkey-patching".

## Overview

> The basics of extensions

* [Anatomy](overview/anatomy.md)

What an extension is made of

* [Imports & Modules](overview/imports-and-modules.md)

How to use imports and modules

* [Architecture](overview/architecture.md)

GNOME Shell Architecture

## Development

* Creating: [Creating an extension](development/creating.md)
* Preferences: [Creating a preferences window](development/preferences.md)
* Translations: [How add multi-lingual support an extension](development/translations.md)
* Debugging: [How to debug an extension](development/debugging.md)

## Upgrading

How to upgrade an extension

* [GNOME Shell 40: Port Extensions to GNOME Shell 40](upgrading/gnome-shell-40.md)

[gnome-api]: https://gjs-docs.gnome.org

