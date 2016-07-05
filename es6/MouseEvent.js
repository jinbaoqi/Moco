class MouseEvent extends InteractiveEvent {
    static getTopItem(eventName, cord) {
        let _me = this;
        let items = _me._list[eventName] || [];

        items = Util.filter(items, function (item) {
            if (item.isMouseon && item.isMouseon(cord)) {
                return true;
            }
        });

        items = Array.prototype.sort.call(items, function (i, j) {
            let a1 = i.objectIndex.split(".");
            let a2 = j.objectIndex.split(".");
            let len = Math.max(a1.length, a2.length);

            for (let i = 0; i < len; i++) {
                if (!a2[i] || !a1[i]) {
                    return a2[i] ? 1 : -1;
                } else if (a2[i] != a1[i]) {
                    return a2[i] - a1[i];
                }
            }
        });

        return items[0];
    }
}

let mouseEvents = {
    CLICK: "click",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    MOUSEMOVE: "mousemove"
};

for (let key in mouseEvents) {
    MouseEvent[key] = mouseEvents[key];
}

MouseEvent.nameList = Util.keys(mouseEvents);

Moco.MouseEvent = MouseEvent;