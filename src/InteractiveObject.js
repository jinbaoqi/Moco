class InteractiveObject extends DisplayObject {
    constructor() {
        super();
        this.name = "InteractiveObject";
    }

    on(eventName, callback, useCapture) {
        let _me = this;
        let eventNameUpperCase = eventName.toUpperCase();
        let isMouseEvent = Util.inArray(eventNameUpperCase, MouseEvent.nameList) != -1;
        let isKeyboardEvent = Util.inArray(eventNameUpperCase, KeyboardEvent.nameList) != -1;

        if (!isMouseEvent && !isKeyboardEvent) {
            return;
        } else if (isMouseEvent) {
            MouseEvent.add(eventName, _me);
        } else if (isKeyboardEvent) {
            KeyboardEvent.add(eventName, _me);
        }

        super.bind(_me, eventName, callback, useCapture);
    }

    off(eventName, callback) {
        let _me = this;
        let eventNameUpperCase = eventName.toUpperCase();
        let isMouseEvent = Util.inArray(eventNameUpperCase, MouseEvent.nameList) != -1;
        let isKeyboardEvent = Util.inArray(eventNameUpperCase, KeyboardEvent.nameList) != -1;

        if (!isMouseEvent && !isKeyboardEvent) {
            return;
        } else if (isMouseEvent) {
            MouseEvent.remove(eventName, _me);
        } else if (isKeyboardEvent) {
            KeyboardEvent.remove(eventName, _me);
        }

        super.unbind(_me, eventName, callback);
    }
}

Moco.InteractiveObject = InteractiveObject;