class InteractiveObject extends DisplayObject {
	constructor() {
		super();
		this.name = "InteractiveObject";
		this._isInMouseList = false;
		this._isInKeyboardList = false;
	}

	on(eventName, callback, useCapture) {
		let _me = this;
		let isMouseEvent = ~Util.inArray(eventName, MouseEvent.nameList);
		let isKeyboardEvent = ~Util.inArray(eventName, KeyboardEvent.nameList);

		if (
			(!isMouseEvent && !isKeyboardEvent) ||
			(isMouseEvent && _me._inMouseList) ||
			(isKeyboardEvent && _me._inKeyboardList)
		) {
			return;
		} else if (isMouseEvent) {
			MouseEvent.add(_me);
			_me._isInMouseList = true;
		} else if (isKeyboardEvent) {
			KeyboardEvent.add(_me);
			_me._isInKeyboardList = true;
		}

		super.on(eventName, callback, useCapture);
	}

	off(eventName, callback) {
		let _me = this;
		let isMouseEvent = ~Util.inArray(eventName, MouseEvent.nameList);
		let isKeyboardEvent = ~Util.inArray(eventName, KeyBoardEvent.nameList);

		if (!isMouseEvent && !isKeyboardEvent) {
			return;
		}

		super.off(eventName, callback);

		if (!Util.keys(_me.handlers).length) {
			if (isMouseEvent) {
				MouseEvent.remove(_me);
				_me._isInMouseList = true;
			} else if (isKeyboardEvent) {
				KeyBoardEvent.remove(_me);
				_me._isInKeyboardList = true;
			}
		}
	}
}

Moco.InteractiveObject = InteractiveObject;