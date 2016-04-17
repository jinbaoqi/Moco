class Stage extends DisplayObjectContainer {
	constructor() {
		super();

		this.name = "Stage";
		this.domElem = document.getElementById(canvasId);
		this.ctx = this.domElem.getContext("2d");
		this.width = parseFloat(this.domElem.getAttribute("width"), 10);
		this.height = parseFloat(this.domElem.getAttribute("height"), 10);
		this.offset = this._getOffset(this.domElem);
		this.x = this.offset.left;
		this.y = this.offset.top;

		if (typeof fn == "function") {
			fn(this);
		}

		this.initialize();
	}

	initialize() {

	}

	_getOffset(domElem) {

	}

}

Moco.Stage = Stage;