class DisplayObjectContainer extends DisplayObject {
	constructor() {
		super();
		this.name = "DisplayObjectContainer";
		this._childList = [];
	}

	addChild(obj) {
		let _me = this;
		if (obj instanceof(DisplayObject)) {
			_me._childList.push(obj);
			obj.parent = _me;
			obj.objectIndex = _me.objectIndex + "." + _me._childList.length;
		}
	}

	removeChild(obj) {
		let _me = this;
		if (obj instanceof(DisplayObject)) {
			for (let i = _me._childList.length - 1; i >= 0; i--) {
				let item = _me._childList[i];
				if (item.aIndex == obj.aIndex) {
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

	contains(obj) {
		let _me = this;
		if (obj instanceof DisplayObject) {
			return Util.inArray(_me._childList, obj, function(obj, item) {
				return obj.aIndex == item.aIndex;
			}) == -1 ? false : true;
		}
	}

	show() {
		let _me = this;

		if (cord == null) {
			cord = {
				x: 0,
				y: 0,
				scaleX: 1,
				scaleY: 1
			};
		}

		super.show(cord);

		for (let i = 0, len = _me._childList.length; i < len; i++) {
			let item = _me._childList[i];
			if (item.show) {
				item.show(cord);
			}
		}
	}
}

Moco.DisplayObjectContainer = DisplayObjectContainer;