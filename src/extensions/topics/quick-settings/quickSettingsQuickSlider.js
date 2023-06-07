const {Gio, GObject} = imports.gi;

const QuickSettings = imports.ui.quickSettings;


const FeatureSlider = GObject.registerClass(
class FeatureSlider extends QuickSettings.QuickSlider {
    _init() {
        super._init({
            iconName: 'selection-mode-symbolic',
        });

        this._sliderChangedId = this.slider.connect('notify::value',
            this._onSliderChanged.bind(this));

        // Binding the slider to a GSettings key
        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.shell.extensions.example',
        });

        this._settings.connect('changed::feature-range',
            this._onSettingsChanged.bind(this));

        this._onSettingsChanged();

        // Set an accessible name for the slider
        this.slider.accessible_name = 'Feature Range';
    }

    _onSettingsChanged() {
        // Prevent the slider from emitting a change signal while being updated
        this.slider.block_signal_handler(this._sliderChangedId);
        this.slider.value = this._settings.get_uint('feature-range') / 100.0;
        this.slider.unblock_signal_handler(this._sliderChangedId);
    }

    _onSliderChanged() {
        // Assuming our GSettings holds values between 0..100, adjust for the
        // slider taking values between 0..1
        const percent = Math.floor(this.slider.value * 100);
        this._settings.set_uint('feature-range', percent);
    }
});
