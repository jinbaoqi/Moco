class Stage extends DisplayObjectContainer {
	constructor(canvasId, fn) {
		super();

		this.name = "Stage";
		this.domElem = document.getElementById(canvasId);
		this.ctx = this.domElem.getContext("2d");
		this.width = parseFloat(this.domElem.getAttribute("width"), 10);
		this.height = parseFloat(this.domElem.getAttribute("height"), 10);
		this.offset = this._getOffset();
		this.x = this.offset.left;
		this.y = this.offset.top;

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
			Util.each(items, (item) => {
				item.trigger(eventName, event);
			});
		}
	}

	_getOffset() {

	}

}

Moco.Stage = Stage;