---
title: Updates and Breakage
---
# Updates and Breakage

It is very common to hear questions and complaints about why extensions break or
otherwise stop working when GNOME Shell is updated. This page is intended to
help users understand what is done to try to prevent it, why it still happens
sometimes and what tools developers can use to avoid it.

It is important to understand that all developers are users and that GNOME
developers are not oblivious or unsympathetic to these problems. Many of the
most popular third-party extensions like AppIndicator, Dash-to-Dock, GSConnect
and JustPerfection are developed and maintained by GNOME Foundation members.


## Why Extensions Break

Unfortunately there are number of misinformed explanations that circulate in the
community about how and why extensions break. It is not always clear the extent
of problems that extensions can cause or why some extensions seem to break with
each stable release while others remain largely unaffected.


### What Can Go Wrong

In the best case, an extension will throw an error while being loaded, before it
makes any changes to the desktop. GNOME Shell can then prevent it from being
enabled, which is when extensions start executing code that affects the user's
experience. If an error occurs while being enabled the extension may be stopped
from causing further problems, but any damage already done can not be undone.

Once enabled, extensions can cause problems that vary in both visibility and
severity. They could be immediately obvious to the user, like features in the
extension itself that don't work or they could break built-in features like the
ability to open the overview. They could also cause problems that are harder to
identify or intermittent, like breaking calendar events and alarms.

In the worst case, extensions can crash the desktop resulting in data loss and
other serious side-effects. These more serious problems are rare, in part
because of preventative measures like locking extension releases to GNOME Shell
releases and the manual review process. As the extensions community has grown,
we have also improved our collective skills and understanding of best practices.


### Monkey-patching

It is fairly well known that extensions work by way of patching GNOME Shell
during runtime; a process commonly referred to as monkey-patching. However,
there are actually two fairly distinct ways these patches work.

In the more invasive approach, existing code is replaced or modified in a way
that relies on the internal code of classes and functions to remain the same.
This allows for very new and different ideas to be realized by third-party
developers, often resulting in an exciting and novel user-experience. The risk
is that extensions using this method can be broken by a new release, even when
the API of JavaScript classes and functions has remained the same.

In the less invasive approach, new UI elements such as panel buttons, menu items
and dialogs are simply added to the existing code base without changing the
underlying code base. These simple additions can add useful functionality and
present information from external programs, but come with very little risk of
breaking between releases.


### Lack of a Stable API

The most common reaction to extensions breaking is to cite the lack of a stable
API, specifically for extensions. Requests for such an API probably stem from
the belief that for GNOME Shell "extension" is just another name for "plugin" or
"add-on". In reality, extensions are simply patches that are applied when they
are enabled and reverted when they are disabled.

The fact that extensions are patches means that there is no way to prevent an
extension from patching and breaking any API that could be devised. Assuming for
a moment that extensions were not patches, most extension developers agree that
no such API could provide them the freedom and power they need. The authors of
our community's most beloved extensions have come to this same conclusion.

Of course, GNOME Shell implements a number of well-defined APIs like those for
notifications, media players and the many portals used by Flatpak applications.
What makes these APIs different from a hypothetical Extension API is that each
one is specialized for a particular purpose. In contrast, the extension system
must be extremely generalized to allow developers the ability to make simple
additions or explore entirely new and complex user experiences.


## How Problems Are Prevented

After an update to GNOME Shell, it is not always clear why an extension has
stopped working. In some cases an extension is not loaded because it does not
support the new version, while in other cases it fails to load or has broken
functionality because something changed it relies on.


### Supported Versions

Every extension includes a `metadata.json` file which includes a list of GNOME
Shell versions that the developer has tested and officially supports. GNOME
Shell has a built-in setting that determines if it will check this list of
supported versions or if it will just load the extension unconditionally.

Starting with GNOME 3.22, this check was disabled because most extensions were
not breaking and it therefore had little benefit for users while being fairly
inconvenient. About five years later, it was agreed that this setting should be
re-enabled due to the significant changes in GNOME 40 and the risk that untested
extensions would compromise desktop stability.

With this check enabled, users that install extensions from the official
[GNOME Extensions](https://extensions.gnome.org) website can be confident that
they have been tested by the developer for their version of GNOME and carefully
reviewed by experienced volunteers.

**References**

* [Version validation disabled (GNOME 3.22)](https://gitlab.gnome.org/GNOME/gnome-shell/-/commit/5e0e3edc7be44c9e370604f1d3514efc37e68a94)
* [Version validation re-enabled (GNOME 40)](https://gitlab.gnome.org/GNOME/gnome-shell/-/commit/9a50240bbc83c4084b0c2577fe8ff712fcaf97c8)


### Extension Review

The first line of defense against broken extensions is our volunteer-driven
review process. These reviews are conducted by some of the most experienced
extension developers in our community, with support and advice from the
maintainers of both GNOME Shell and GJS.

Our first priority when reviewing extensions is to ensure the stability and
security of the user experience. Over time our review process becomes more
refined and in some cases quite strict, as we learn to recognize common mistakes
and the consequences they can have for our users.

GNOME Shell is quite broad in the amount of functionality it provides however,
so it is not always possible for reviewers to recognize whether an extension
will work as intended. There is no guarantee that an extension found to be free
of security or stability issues will provide the features it claims to. This
kind of testing is something users can do for the developers we all rely on.

**References**

* [Review Guidelines](https://gjs.guide/extensions/review-guidelines/review-guidelines.html)


## What Developers Can Do

The reason some extensions rarely break is usually because they take advantage
of the stable library APIs that GNOME Shell itself is built on. Some developers
also increase their success rate by using tools like ESLint or TypeScript to
improve their development experience.


### Use GNOME Platform APIs

GNOME Shell is built on top of a stack of stable libraries, sometimes called the
GNOME Platform libraries. An overview of the libraries that are most integral to
GNOME Shell and how they relate to extensions is available on the
[Architecture](architecture.html) page.

The core platform provided by GLib, GObject and GIO is extremely stable. The
Clutter, Mutter, St and Shell libraries are quite stable, but not entirely free
from change. This is simply a reality of technologies like JavaScript, Wayland,
and application sandboxing progressing at a rapid rate.

In spite of these rare exceptions, GJS considers backwards compatibility and
stability a primary goal. By resisting the temptation to subclass widgets and
override class methods, most changes to internal code become irrelevant to the
average extension developer. JavaScript also makes it quite easy to look before
you leap, allowing you to adjust to problems that many compiled languages
suffer from.

**References**

* [GNOME API Documentation](https://gjs-docs.gnome.org)


### Use JavaScript Development Tools

Although development tools specifically created for GNOME Shell and GJS are
still lacking, the JavaScript ecosystem is quite well developed. Linters,
transpiled languages like TypeScript and IDEs already exist that can make
development far less error-prone. In some cases, it may also be possible to run
automated unit tests on portions of code.

GJS and GNOME Shell both have well-tested ESLint configurations that you can use
to statically analyze your code. These can do much more than just keep your code
pretty like identifying logical errors, races in asynchronous code and a large
number of other mistakes commonly made in JavaScript.

A number of extensions have also started using TypeScript to make development
quicker and less error-prone. As GJS gains better support for modern JavaScript
standards like ESM (ECMAScript Modules) and other features, more related tooling
will become available.

While development of a GNOME OS based testing system continues, it may already
be possible for some developers to perform unit tests on their extensions. It is
still difficult to run GNOME Shell in a container to run user-interface tests,
however code that can be separated from GNOME Shell libraries can be tested
with frameworks like Jasmine and others.

**References**

* [GJS ESlint configuration](https://gitlab.gnome.org/GNOME/gjs/-/blob/HEAD/.eslintrc.yml)
* [GNOME Shell ESlint configurations](https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/HEAD/lint)
* [gi.ts TypeScript Definitions](https://gitlab.gnome.org/ewlsh/gi.ts)
* [GJS Jasmine test framework](https://github.com/ptomato/jasmine-gjs)


### Write Applications When It Makes Sense

Extensions are a powerful platform, with a fairly low-barrier for new
developers. With very little experience and some guidance, you can easily
distribute some pretty amazing enhancements and modifications for the GNOME
Desktop. Best of all, you can build on what's already there instead of writing a
whole desktop shell from scratch.

That being said, the intended use case for extensions is to modify the desktop
experience and not to replace applications. Now that Flathub and OBS (Open Build
Service) are available to make distribution easy for developers, you may want to
consider whether your extension should really be an application.

If you find that the majority of your extension does not modify the desktop
experience or use GNOME Shell libraries like Mutter, Clutter or St, an
application might be a better choice for your project. GNOME Builder makes
creating new applications easier than ever and even includes templates for GJS
projects, so you can build on your existing skillset without having to learn a
new programming language.

**References**

* [GNOME Builder](https://wiki.gnome.org/Apps/Builder)
* [Flatpak: Getting Started](https://docs.flatpak.org/en/latest/getting-started.html)
* [Flathub: App Submission](https://github.com/flathub/flathub/wiki/App-Submission)
* [Open Build Service](https://openbuildservice.org/)

