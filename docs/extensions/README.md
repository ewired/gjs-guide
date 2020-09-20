---
title: Extensions
date: 2018-08-20 16:10:11
layout: IndexPage
---

# GNOME Shell Extensions

## Introduction

GNOME Shell's UI and extensions are written in GJS, which is JavaScript bindings for the [GNOME APIs][gnome-api].

JavaScript is a prototype-based language, which means that extensions can modify the UI and behaviour of GNOME Shell *while* it is running. This is what is known as "monkey-patching".


<ShowCaseBox title="Overview" subtitle="The basics of extensions">
  <ShowCase link="overview/anatomy.html" title="Anatomy" subtitle="What an extension is made of"/>
  <ShowCase link="overview/imports-and-modules.html" title="Imports & Modules" subtitle="How to use imports and modules"/>
  <ShowCase link="overview/architecture.html" title="Architecture" subtitle="GNOME Shell Architecture"/>
</ShowCaseBox>

<ShowCaseBox title="Development" subtitle="How to develop an extension">
  <ShowCase link="development/creating.html" title="Creating" subtitle="Creating an extension"/>
  <ShowCase link="development/preferences.html" title="Preferences" subtitle="Creating a preferences window"/>
  <ShowCase link="development/translations.html" title="Translations" subtitle="How add multi-lingual support an extension"/>
  <ShowCase link="development/debugging.html" title="Debugging" subtitle="How to debug an extension"/>
</ShowCaseBox>


[gnome-api]: https://gjs-docs.gnome.org

