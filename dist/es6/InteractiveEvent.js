"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InteractiveEvent = function () {
	function InteractiveEvent() {
		_classCallCheck(this, InteractiveEvent);
	}

	_createClass(InteractiveEvent, null, [{
		key: "getList",
		value: function getList() {
			return Util.clone(this._list);
		}
	}, {
		key: "add",
		value: function add(item) {
			if (item instanceof EventDispatcher) {
				this._list.push(item);
			}
		}
	}, {
		key: "remove",
		value: function remove(item) {
			if (item instanceof EventDispatcher) {
				for (var i = 0, len = this._list.length; i < len; i++) {
					var listItem = this._list[i];
					if (listItem.aIndex == item.aIndex) {
						this._list.splice(i, 1);
						break;
					}
				}
			}
		}
	}]);

	return InteractiveEvent;
}();

InteractiveEvent._list = [];

Moco.InteractiveEvent = InteractiveEvent;
