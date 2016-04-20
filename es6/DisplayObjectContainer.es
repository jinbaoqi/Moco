class DisplayObjectContainer extends InteractiveObject {
	constructor() {
		super();
		this.name = "DisplayObjectContainer";
		this._childList = [];
	}

	addChild(child) {
		let _me = this;
		if (child instanceof DisplayObject) {
			let isNotExists = Util.inArray(child, _me._childList, (child, item) => {
				return child.aIndex == item.aIndex;
			}) == -1;

			if (isNotExists) {
				child.parent = _me;
				child.stage = child.stage ? child.stage : _me.stage;
				child.objectIndex = _me.objectIndex + "." + (_me._childList.length + 1);
				_me._childList.push(child);
			}
		}
	}

	removeChild(child) {
		let _me = this;
		if (child instanceof(DisplayObject)) {
			for (let i = _me._childList.length - 1; i >= 0; i--) {
				let item = _me._childList[i];
				if (item.aIndex == child.aIndex) {
					item.parent = null;
					item.stage = null;
					Array.prototype.splice.call(_me._childList, i, 1);
					break;
				}
			}
		}
	}

	getAllChild() {
		let _me = this;
		return Util.clone(_me._childList);
	}

	getChildAt(index) {
		let _me = this;
		let len = _me._childList.length;

		if (Math.abs(index) > len) {
			return;
		} else if (index < 0) {
			index = len + index;
		}

		return _me._childList[index];
	}

	contains(child) {
		let _me = this;
		if (child instanceof DisplayObject) {
			return Util.inArray(child, _me._childList, function(child, item) {
				return child.aIndex == item.aIndex;
			}) != -1;
		}
	}

	show(matrix) {
		let _me = this;

		if (matrix == null) {
			matrix = Matrix3.clone(_me._matrix);
		}

		let isDrew = super.show(matrix);

		if (isDrew) {
			for (let i = 0, len = _me._childList.length; i < len; i++) {
				let item = _me._childList[i];
				if (item.show) {
					item.show(Matrix3.clone(matrix));
				}
			}

			if (_me._isSaved) {
				let ctx = _me.ctx || _me.stage.ctx;
				_me._isSaved = false;
				_me.ctx.restore();
			}
		}
	}
}

Moco.DisplayObjectContainer = DisplayObjectContainer;