class DisplayObjectContainer extends InteractiveObject {
	constructor() {
		super();
		this.name = "DisplayObjectContainer";
		this._childList = [];
	}

	addChild(child) {
		let _me = this;
		if (child instanceof(DisplayObject)) {
			_me._childList.push(child);
			child.parent = _me;
			child.objectIndex = _me.objectIndex + "." + _me._childList.length;
		}
	}

	removeChild(child) {
		let _me = this;
		if (child instanceof(DisplayObject)) {
			for (let i = _me._childList.length - 1; i >= 0; i--) {
				let item = _me._childList[i];
				if (item.aIndex == child.aIndex) {
					Array.prototype.splice.call(_me._childList, i, 1);
				}
			}
		}
	}

	getChildAt(index) {
		let _me = this;
		let len = self._childList.length;

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
			return Util.inArray(_me._childList, child, function(child, item) {
				return child.aIndex == item.aIndex;
			}) == -1 ? false : true;
		}
	}

	show(matrix) {
		let _me = this;

		// if this is a top container, matrix base on the itself
		if (matrix == null) {
			matrix = Matrix3.clone(_me._matrix);
		}

		super.show(matrix);

		for (let i = 0, len = _me._childList.length; i < len; i++) {
			let item = _me._childList[i];
			if (item.show) {
				item.show(Matrix3.clone(matrix));
			}
		}
	}
}

Moco.DisplayObjectContainer = DisplayObjectContainer;