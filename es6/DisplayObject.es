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

		this._observe();
	}

	show(matrix) {
		let _me = this;
		let canvas = _me.ctx || _me.stage.ctx;

		this._matrix = Matrix3.identity();

		if (!_me.visible || _me.alpha <= 0.001) {
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
			this._matrix.tranlsate(x, y);
			canvas.translate(x, y);
		}

		if (_me.rotate != 0) {
			let angle = _me.rotate;
			this._matrix.rotate(angle);
			canvas.rotate(Util.deg2rad(angle));
		}

		if (_me.scaleX != 1 || _me.scaleY != 1) {
			let scaleX = _me.scaleX;
			let scaleY = _me.scaleY;
			this._matrix.scale(scaleX, scaleY);
			canvas.scale(scaleX, scaleY);
		}

		this._matrix.multi(matrix);
	}

	dispose() {
		let _me = this;
		let eventNames = Util.keys(_me._handlers);
		_me.off(eventNames);
	}

	_observe() {
		let _me = this;
		let properties = [{
			key: 'x',
			method: 'translate',
			args: (value) => {
				return [value, _me.y]
			}
		}, {
			key: 'y',
			method: 'translate',
			args: (value) => {
				return [_me.x, value]
			}
		}, {
			key: 'rotate',
			method: 'rotate',
			args: (value) => {
				return value
			}
		}, {
			key: 'scaleX',
			method: 'scale',
			args: (value) => {
				return [value, _me.scaleY]
			}
		}, {
			key: 'scaleY',
			method: 'scale',
			args: (value) => {
				return [_me.scaleX, value]
			}
		}];

		for (let i = 0, len = properties.length; i < len; i++) {
			let prop = properties[i];
			let val = _me[prop.key];
			Object.defineProperty(this, prop.key, {
				set: (newValue) => {
					val = newValue;
					this._matrix[prop.method].apply(this._matrix, prop.args(newValue));
				},
				get: () => {
					return val;
				}
			})
		}
	}
}

Moco.DisplayObject = DisplayObject;