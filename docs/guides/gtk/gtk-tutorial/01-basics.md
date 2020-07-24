---
The Basic of GTK+
---
# The Basics of GTK+

[[toc]]

This page serves as a general guide to GTK+ concepts and how they are implemented in GJS.

## What is GTK+?

GTK+ is a powerful, event-driven GUI toolkit comprised of numerous widgets and utilities. Let's break that down!

## What is a GUI toolkit?

A GUI toolkit provides the libraries and tools for you, the developer, to build applications.

## What is a widget?

A widget is a piece or part of your application which the user interacts with. Examples of widgets include buttons, labels, and images. Learn more about widgets [here](./02-widgets.html);

## Event-Driven

Like most GUI toolkits GTK+ adheres to the event-driven programming model. This means GTK+ "lies in wait" for any possible input from the user (keypresses, clicks, etc.) or computer. Without any input, GTK+ will do nothing. This "waiting" is called the *mainloop* of the program.
