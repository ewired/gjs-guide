const {Gio} = imports.gi;


const directory = Gio.File.new_for_path('.');

const fileMonitor = directory.monitor(Gio.FileMonitorFlags.WATCH_MOVES, null);

fileMonitor.connect('changed', (fileMonitor, file, otherFile, eventType) => {
    switch (eventType) {
        case Gio.FileMonitorEvent.CHANGED:
            log(`${otherFile.get_basename()} was changed`);
            break;

        case Gio.FileMonitorEvent.DELETED:
            log(`${otherFile.get_basename()} was deleted`);
            break;

        case Gio.FileMonitorEvent.CREATED:
            log(`${otherFile.get_basename()} was created`);
            break;

        case Gio.FileMonitorEvent.MOVED_IN:
            log(`${otherFile.get_basename()} was moved into the directory`);
            break;

        case Gio.FileMonitorEvent.MOVED_OUT:
            log(`${otherFile.get_basename()} was moved out of the directory`);
            break;
    }
});
