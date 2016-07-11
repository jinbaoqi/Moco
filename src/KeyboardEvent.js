import InteractiveEvent from './InteractiveEvent';
import Util from './Util';

export default class KeyboardEvent extends InteractiveEvent {
    static getItems(eventName) {
        let _me = this;
        return _me._list[eventName] || [];
    }
}

let keyboardEvents = {
    KEYDOWN: 'keydown',
    KEYUP: 'keyup',
    KEYPRESS: 'keypress'
};

for (let key in keyboardEvents) {
    if (keyboardEvents.hasOwnProperty(key)) {
        KeyboardEvent[key] = keyboardEvents[key];
    }
}

KeyboardEvent.nameList = Util.keys(keyboardEvents);