"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayObjectContainer = function (_InteractiveObject) {
	_inherits(DisplayObjectContainer, _InteractiveObject);

	function DisplayObjectContainer() {
		_classCallCheck(this, DisplayObjectContainer);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObjectContainer).call(this));

		_this.name = "DisplayObjectContainer";
		_this._childList = [];
		return _this;
	}

	_createClass(DisplayObjectContainer, [{
		key: "addChild",
		value: function addChild(child) {
			var _me = this;
			if (child instanceof DisplayObject) {
				var isNotExists = Util.inArray(child, _me._childList, function (child, item) {
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
	}, {
		key: "removeChild",
		value: function removeChild(child) {
			var _me = this;
			if (child instanceof DisplayObject) {
				for (var i = _me._childList.length - 1; i >= 0; i--) {
					var item = _me._childList[i];
					if (item.aIndex == child.aIndex) {
						item.parent = null;
						item.stage = null;
						Array.prototype.splice.call(_me._childList, i, 1);
						break;
					}
				}
			}
		}
	}, {
		key: "getAllChild",
		value: function getAllChild() {
			var _me = this;
			return Util.clone(_me._childList);
		}
	}, {
		key: "getChildAt",
		value: function getChildAt(index) {
			var _me = this;
			var len = _me._childList.length;

			if (Math.abs(index) > len) {
				return;
			} else if (index < 0) {
				index = len + index;
			}

			return _me._childList[index];
		}
	}, {
		key: "contains",
		value: function contains(child) {
			var _me = this;
			if (child instanceof DisplayObject) {
				return Util.inArray(child, _me._childList, function (child, item) {
					return child.aIndex == item.aIndex;
				}) != -1;
			}
		}
	}, {
		key: "show",
		value: function show(matrix) {
			var _me = this;

			if (matrix == null) {
				matrix = Matrix3.clone(_me._matrix);
			}

			_get(Object.getPrototypeOf(DisplayObjectContainer.prototype), "show", this).call(this, matrix);

			for (var i = 0, len = _me._childList.length; i < len; i++) {
				var item = _me._childList[i];
				if (item.show) {
					item.show(Matrix3.clone(matrix));
				}
			}
		}
	}]);

	return DisplayObjectContainer;
}(InteractiveObject);

Moco.DisplayObjectContainer = DisplayObjectContainer;
