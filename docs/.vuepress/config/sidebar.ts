/**
 *
 * Guides sidebar
 *
 */

/**
 * GJS section
 */

const gjs = {
    text: 'GJS',
    collapsible: true,
    children: [
        '/guides/gjs/intro.md',
        '/guides/gjs/features-across-versions.md',
        '/guides/gjs/legacy-class-syntax.md',
        '/guides/gjs/style-guide.md',
        '/guides/gjs/asynchronous-programming.md',
        '/guides/gjs/memory-management.md',
    ],
};

/**
 * GObject section
 */

const gobject = {
    text: 'GObject',
    collapsible: true,
    children: [
        '/guides/gobject/basics.md',
        '/guides/gobject/interfaces.md',
        '/guides/gobject/subclassing.md',
        '/guides/gobject/gtype.md',
        '/guides/gobject/gvalue.md',
    ],
};

/**
 * GTK3 sub-section
 */

const gtk4 = {
    text: 'GTK4',
    children: [
        {
            text: 'GTK4 Book',
            link: 'https://rmnvgr.gitlab.io/gtk4-gjs-book/',
        },
    ],
}

const gtk3 = {
    text: 'GTK3',
    children: [
        '/guides/gtk/3/README.md',
        '/guides/gtk/3/01-basics.md',
        '/guides/gtk/3/02-widgets.md',
        '/guides/gtk/3/03-installing.md',
        '/guides/gtk/3/04-running-gtk.md',
        '/guides/gtk/3/05-layouts.md',
        '/guides/gtk/3/06-text.md',
        '/guides/gtk/3/07-buttons.md',
        '/guides/gtk/3/08-editing-text.md',
        '/guides/gtk/3/09-images.md',
        '/guides/gtk/3/10-building-app.md',
        '/guides/gtk/3/11-packaging.md',
        '/guides/gtk/3/12-app-dev.md',
        '/guides/gtk/3/13-ui.md',
        '/guides/gtk/3/14-templates.md',
        '/guides/gtk/3/15-saving-data.md',
        '/guides/gtk/3/16-settings.md',
        '/guides/gtk/3/17-dialogs.md',
    ],
};

/**
 * Application packaging sub-section
 */

const applicationPackaging = {
    text: 'Gtk application packaging',
    children: [
        '/guides/gtk/application-packaging.md'
    ]
}

/**
 * GTK section
 */

const gtk = {
    text: 'GTK',
    collapsible: true,
    children: [
        { ...gtk4 },
        { ...gtk3 },
        { ...applicationPackaging }
    ],
};

/**
 * GLib section
 */

const glib = {
    text: 'GLib',
    collapsible: true,
    children: ['/guides/glib/gvariant.md'],
};

/**
 * Gio section
 */

const gio = {
    text: 'Gio',
    collapsible: true,
    children: [
        '/guides/gio/dbus.md',
        '/guides/gio/file-operations.md',
        '/guides/gio/subprocesses.md',
    ],
};

/**
 * 
 * Extensions sidebar
 * 
 */

/**
 * Development section
 */

const development = {
    text: 'Development',
    collapsible: true,

    children: [
        '/extensions/development/creating.md',
        '/extensions/development/accessibility.md',
        '/extensions/development/debugging.md',
        '/extensions/development/preferences.md',
        '/extensions/development/translations.md',
        '/extensions/development/targeting-older-gnome.md',
    ],
}

/**
 * Overview section
 */

const overview = {
    text: 'Overview',
    collapsible: true,

    children: [
        '/extensions/overview/anatomy.md',
        '/extensions/overview/architecture.md',
        '/extensions/overview/imports-and-modules.md',
        '/extensions/overview/updates-and-breakage.md',
    ],
}

/**
 * Topics section
 */
const topics = {
    text: 'Topics',
    collapsible: true,

    children: [
        '/extensions/topics/extension-utils.md',
        '/extensions/topics/popup-menu.md',
        '/extensions/topics/quick-settings.md',
        '/extensions/topics/search-provider.md',
        '/extensions/topics/session-modes.md',
    ],
}

/**
 * Upgrading section
 */

const upgrading = {
    text: 'Upgrading',
    collapsible: true,

    children: [
    	'/extensions/upgrading/gnome-shell-44.md',
        '/extensions/upgrading/gnome-shell-43.md',
        '/extensions/upgrading/gnome-shell-42.md',
        '/extensions/upgrading/gnome-shell-40.md',
    ],
}

/**
 * Review guidelines section
 */

const review = {
    text: 'Review Guidelines',
    collapsible: true,

    children: ['/extensions/review-guidelines/review-guidelines.md'],
}

/**
 * Sidebar
 */

const sidebar = {
    '/guides/': [{ ...gjs }, { ...gobject }, { ...gtk }, { ...glib }, { ...gio }],

    '/extensions/': [{ ...development }, { ...overview }, { ...topics }, { ...upgrading }, { ...review }],

};

export default sidebar;
