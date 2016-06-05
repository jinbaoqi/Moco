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

        super.on(eventName, callback, useCapture);
    }

    off(eventName, callback) {
        let _me = this;
        let eventNameUpperCase = eventName.toUpperCase();
        let isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) != -1;
        let isKeyboardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) != -1;

        if (!isMouseEvent && !isKeyboardEvent) {
            return;
        } else if (isMouseEvent) {
            MouseEvent.remove(eventName, _me);
        } else if (isKeyboardEvent) {
            KeyBoardEvent.remove(eventName, _me);
        }

        super.off(eventName, callback);
    }
}

Moco.InteractiveObject = InteractiveObject;