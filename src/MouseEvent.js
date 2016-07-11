import InteractiveEvent from './InteractiveEvent';
import Util from './Util';

export default class MouseEvent extends InteractiveEvent {
    static getTopItem(eventName, cord) {
        let _me = this;
        let items = _me._list[eventName] || [];

        items = Util.filter(items, function (item) {
            if (item.isMouseon && item.isMouseon(cord)) {
                return true;
            }
        });

        items = Array.prototype.sort.call(items, function (i, j) {
            let a1 = i.objectIndex.split('.');
            let a2 = j.objectIndex.split('.');
            let len = Math.max(a1.length, a2.length);

            for (let k = 0; k < len; k += 1) {
                if (!a2[k] || !a1[k]) {
                    return a2[k] ? 1 : -1;
                } else if (a2[k] !== a1[k]) {
                    return a2[k] - a1[k];
                }
            }
        });

        return items[0];
    }
}

let mouseEvents = {
    CLICK: 'click',
    MOUSEDOWN: 'mousedown',
    MOUSEUP: 'mouseup',
    MOUSEMOVE: 'mousemove'
};

for (let key in mouseEvents) {
    if (mouseEvents.hasOwnProperty(key)) {
        MouseEvent[key] = mouseEvents[key];
    }
}

MouseEvent.nameList = Util.keys(mouseEvents);