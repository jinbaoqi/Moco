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

		Util.each(MouseEvent.nameList, (eventName) => {
			
		});
	}

	on() {
		let _me = this;
		let args = Array.prototype.slice.call([], arguments);
		EventDispatcher.prototype.on.apply(_me, args);
	}

	off() {
		let _me = this;
		let args = Array.prototype.slice.call([], arguments);
		EventDispatcher.prototype.on.apply(_me, args);
	}

	_getOffset() {

	}

}

Moco.Stage = Stage;