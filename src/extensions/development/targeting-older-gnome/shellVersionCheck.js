const Config = imports.misc.config;
const [major, minor] = Config.PACKAGE_VERSION.split('.').map(s => Number(s));

if (major === 3 && minor <= 36)
    log('Shell 3.36 or lower');
else if (major === 3 && minor === 38)
    log('Shell 3.38');
else if (major >= 40)
    log('Shell 40 or higher');
