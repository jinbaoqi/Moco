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
		value: function add(eventName, item) {
			if (item instanceof EventDispatcher) {
				var list = this._list;
				list[eventName] = list[eventName] ? list[eventName] : [];

				var index = Util.inArray(item, list[eventName], function (a1, a2) {
					return a1.aIndex == a2.aIndex;
				});

				if (! ~index) {
					list[eventName].push(item);
				}
			}
		}
	}, {
		key: "remove",
		value: function remove(eventName, item) {
			if (item instanceof EventDispatcher) {
				var list = this._list;
				if (list[eventName]) {
					var index = Util.inArray(item, list[eventName], function (a1, a2) {
						return a1.aIndex == a2.aIndex;
					});

					if (~index) {
						list[eventName].splice(i, 1);
					}
				}
			}
		}
	}]);

	return InteractiveEvent;
}();

InteractiveEvent._list = {};

Moco.InteractiveEvent = InteractiveEvent;
