class DisplayObject extends EventDispatcher {
	constructor() {
		super();
		this.name = "DisplayObject";
		this.alpha = 1;
		this.height = 0;
		this.width = 0;
		this.mask = null;
		this.rotate = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.parent = null;
		this.globalCompositeOperation = "";
		this.x = 0;
		this.y = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.parent = null;
		this.visible = true;
		this.aIndex = this.objectIndex = "" + (guid++);
		this._isSaved = false;
		this._matrix = Matrix3.identity();
	}

	show(matrix) {
		let _me = this;
		let canvas = _me.ctx || _me.stage.ctx;

		if (!_me.visible) {
			return;
		}

		if (
			(_me.mask != null && _me.mask.show) ||
			_me.alpha < 1 ||
			_me.rotate != 0 ||
			_me.scaleX != 1 ||
			_me.scaleY != 1 ||
			_me.translateX != 0 ||
			_me.translateY != 0 ||
			_me.globalCompositeOperation != ""
		) {
			_me._isSaved = true;
			canvas.save();
		}

		if (_me.mask != null && _me.mask.show) {
			_me.mask.show();
			canvas.clip();
		}

		if (_me.alpha < 1) {
			canvas.globalAlpha = _me.alpha > 1 ? 1 : _me.alpha;
		}

		if (_me.x != 0 || _me.y != 0) {
			let x = _me.x;
			let y = _me.y;
			canvas.translate(x, y);
			matrix.translation(x, y);
		}

		if (_me.rotate != 0) {
			let angle = _me.rotate;
			canvas.rotate(Util.deg2rad(angle));
			matrix.rotation(angle);
		}

		if (_me.scaleX != 1 || _me.scaleY != 1) {
			let scaleX = _me.scaleX;
			let scaleY = _me.scaleY;
			canvas.scale(scaleX, scaleY);
			matrix.scaling(scaleX, scaleY);
		}

		this._matrix = Matrix.clone(matrix);
	}

	dispose() {
		let _me = this;
		let eventNames = Util.keys(_me._handlers);
		_me.off(eventNames);
	}
}

Moco.DisplayObject = DisplayObject;