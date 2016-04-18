class Stage extends DisplayObjectContainer {
	constructor(canvasId, fn) {
		super();

		this.name = "Stage";
		this.domElem = document.getElementById(canvasId);
		this.width = parseFloat(this.domElem.getAttribute("width"), 10);
		this.height = parseFloat(this.domElem.getAttribute("height"), 10);
		this.ctx = this.domElem.getContext("2d");

		let offset = this._getOffset();
		this.x = offset.left;
		this.y = offset.top;

		if (typeof fn == "function") {
			fn(this);
		}

		this.initialize();
	}

	initialize() {
		let _me = this;

		// Stage接管所有交互事件
		Util.each(MouseEvent.nameList, (eventName) => {
			eventName = mouseEvent[eventName];
			EventDispatcher.prototype.on.call(_me, _me.domElem, eventName, (event) => {
				_me._mouseEvent(event);
			});
		});

		Util.each(KeyboardEvent.nameList, (event) => {
			EventDispatcher.prototype.on.call(_me, _me.domElem, eventName, () => {
				_me.keyboardEvent(event);
			});
		});

		_me.show();
	}

	show() {
		let _me = this;

		_me.ctx.clearRect(0, 0, _me.width, _me.height);

		super.show();

		if (_me._isSaved) {
			_me.ctx.restore();
		}

		raf(function() {
			_me.show();
		});
	}

	addChild(child) {
		let _me = this;
		let addStage = (child) => {
			child.stage = _me;

			if (child instanceof Sprite) {
				child.graphics.stage = _me;
				child.graphics.parent = child;
				child.graphics.objectIndex = child.objectIndex + ".0";
			}
		};

		addStage(child);

		if (child.getAllChild) {
			let childs = child.getAllChild();
			Util.each(childs, (item) => {
				addStage(item);
			});
		}

		super.addChild(child);
	}

	_mouseEvent(event) {
		let cord = {
			x: 0,
			y: 0
		};

		event = Util.clone(event);

		if (event.clientX != null) {
			cord.x = event.pageX - _me.x;
			cord.y = event.pageY - _me.y;
			_me.mouseX = cord.x;
			_me.mouseY = cord.y;
		}

		event.cord = cord;

		let eventName = event.type;
		let item = MouseEvent.getTopItem(eventName, cord);
		if (item) {
			item.trigger(eventName, event);
		}
	}

	_keyboardEvent(event) {
		let eventName = event.type;
		let items = KeyboardEvent.getItems(eventName);

		if (items.length) {
			event = Util.clone(event);
			Util.each(items, (item) => {
				item.trigger(eventName, event);
			});
		}
	}

	_getOffset() {
		return {
			top: 0,
			left: 0
		}
	}

}

Moco.Stage = Stage;