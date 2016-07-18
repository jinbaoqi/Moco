import DisplayObject from './DisplayObject';
import Util from './Util';
import KeyboardEvent from './KeyboardEvent';
import MouseEvent from './MouseEvent';

export default class InteractiveObject extends DisplayObject {
    constructor() {
        super();
        this.name = 'InteractiveObject';
    }

    on(eventName, callback, useCapture) {
        let _me = this;
        if (arguments.length > 1) {
            let eventNameUpperCase = eventName.toUpperCase();
            if (Util.inArray(eventNameUpperCase, MouseEvent.nameList) !== -1) {
                MouseEvent.add(eventName, _me);
            } else if (Util.inArray(eventNameUpperCase, KeyboardEvent.nameList) !== -1) {
                KeyboardEvent.add(eventName, _me);
            }

            super.on(_me, eventName, callback, useCapture);
        }
    }

    off(eventName, callback) {
        let _me = this;

        if (arguments.length) {
            let eventNameUpperCase = eventName.toUpperCase();
            if (Util.inArray(eventNameUpperCase, MouseEvent.nameList) !== -1) {
                MouseEvent.remove(eventName, _me);
            } else if (Util.inArray(eventNameUpperCase, KeyboardEvent.nameList) !== -1) {
                KeyboardEvent.remove(eventName, _me);
            }
        } else {
            Util.each(MouseEvent.nameList, (item)=> {
                MouseEvent.remove(item, _me);
            });
            Util.each(KeyboardEvent.nameList, (item)=> {
                KeyboardEvent.remove(item, _me);
            });
        }

        super.off(_me, eventName, callback);
    }
}