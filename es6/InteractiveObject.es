class InteractiveObject extends DisplayObject {
	constructor() {
		super();
		this.name = "InteractiveObject";
	}

	on(eventName, callback, useCapture) {
		let _me = this;
		let isMouseEvent = ~Util.inArray(eventName, MouseEvent.nameList);
		let isKeyboardEvent = ~Util.inArray(eventName, KeyboardEvent.nameList);

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
		let isMouseEvent = ~Util.inArray(eventName, MouseEvent.nameList);
		let isKeyboardEvent = ~Util.inArray(eventName, KeyBoardEvent.nameList);

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