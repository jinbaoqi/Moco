class DisplayObject extends EventDispatcher {
	constructor() {
		super();
		this.name = "DisplayObject";
		this.alpha = 1;
		this.height = 0;
		this.width = 0;
		this.mask = null;
		this.rotate = 0;
		this.translateX = 0;
		this.translateY = 0;
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
	}

	show(cord) {
		let _me = this;
		let canvas = _me.ctx || _me.stage.ctx;

		if (!_me.visible) {
			return;
		}

		if (_me.parent && _me.parent instanceof(Stage)) {
			cord.ox = _me.x;
			cord.oy = _me.y;
		} else {
			cord.x += _me.x;
			cord.y += _me.y;
		}

		cord.scaleX *= _me.scaleX;
		cord.scaleY *= _me.scaleY;

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

		if (_me.translateX != 0 || _me.translateY != 0) {
			canvas.translate(_me.translateX, _me.translateY);
		}

		if (_me.scaleX != 1 || _me.scaleY != 1) {
			canvas.scale(_me.scaleX, _me.scaleY);
		}

		if (_me.rotate != 0) {
			let ox = cord.x + cord.ox / cord.scaleX;
			let oy = cord.y + cord.oy / cord.scaleY;

			canvas.translate(ox, oy);
			canvas.rotate(Util.deg2rad(_me.rotate));
			canvas.translate(-ox, -oy);
		}
	}

	dispose() {
		let _me = this;
		let eventNames = Util.keys(_me._handlers);

		_me.off(eventNames);
	}

	_getOffset() {
		let _me = this;
		let parents = [];
		let parent = _me;
		let offset = {
			x: 0,
			y: 0,
			scaleX: 1,
			scaleY: 1
		};

		while (parent) {
			parents.push(parent);
			parent = parent.parent;
		}

		for (i = parents.length - 1; i >= 0; i--) {
			parent = parents[i];
			offset = self._getActualOffset(offset, parent);
		}

		return offset;
	}

	_getActualOffset(offset, parent) {
		offset.scaleX *= parent.scaleX;
		offset.scaleY *= parent.scaleY;

		if (parent.parent instanceof Stage) {
			offset.x += parent.x + parent.translateX;
			offset.y += parent.y + parent.translateY;
		} else {
			offset.x += (parent.x + parent.translateX) * offset.scaleX;
			offset.y += (parent.y + parent.translateY) * offset.scaleY;
		}

		return offset;
	}
}

Moco.DisplayObject = DisplayObject;