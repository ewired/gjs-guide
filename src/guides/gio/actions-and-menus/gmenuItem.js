const {GLib, Gio} = imports.gi;


const menuModel = new Gio.Menu();


/*
 * Items with parameterless GActions can be added very easily, while those with
 * simple parameters can be set using a detailed action.
 */
menuModel.append('See full menu', 'pizza.full-menu');
menuModel.append('House Pizza', 'pizza.deal::today');


/*
 * In other cases, you may want to build items manually and add an icon or
 * custom attributes. Note that the consumer of the menu will decide if an icon
 * is displayed.
 */
const allergyItem = new Gio.MenuItem();

allergyItem.set_label('Allergy Warning');
allergyItem.set_action_and_target_value('pizza.allergyWarning');
allergyItem.set_icon(Gio.Icon.new_for_string('dialog-warning-symbolic'));
allergyItem.set_attribute('disclaimer-url',
    GLib.Variant.new_string('https://www.pizza.com/allergy-warning'));

menuModel.append_item(allergyItem);


/*
 * Actions with a string state type (`s`) can be used for a group of radio
 * buttons, by specifying the same action name with different target values.
 *
 * This works well with a GPropertyAction bound to a GObject property holding
 * an enumeration, since they are stored as strings.
 */
menuModel.append('Cheese', 'pizza.style::cheese');
menuModel.append('Hawaiian', 'pizza.style::hawaiian');
menuModel.append('Pepperoni', 'pizza.style::pepperoni');
menuModel.append('Vegetarian', 'pizza.style::vegetarian');


/*
 * Actions with a boolean state type (`b`) will have a checkbox.
 */
menuModel.append('Extra Cheese', 'pizza.extra-cheese');
