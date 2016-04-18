"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseEvent = function (_InteractiveEvent) {
	_inherits(MouseEvent, _InteractiveEvent);

	function MouseEvent() {
		_classCallCheck(this, MouseEvent);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseEvent).apply(this, arguments));
	}

	_createClass(MouseEvent, null, [{
		key: "getItemsFromCord",
		value: function getItemsFromCord(cord) {
			var _me = this;

			var items = Util.filter(_me._list, function (item) {
				if (item.isMouseon(cord)) {
					return true;
				}
			});

			items = Array.prototype.sort.call(items, function (i, j) {
				var a1 = i.objectIndex.split(".");
				var a2 = j.objectIndex.split(".");
				var len = Math.max(a1.length, a2.length);

				for (var _i = 0; _i < len; _i++) {
					if (!a2[_i] || !a1[_i]) {
						return a2[_i] ? 1 : -1;
					} else if (a2[_i] != a1[_i]) {
						return a2[_i] - a1[_i];
					}
				}
			});

			var tmp = [];
			if (items.length) {
				var k = items[0].objectIndex;

				tmp.push(items[0]);

				for (var i = 1, len = items.length; i < len; i++) {
					item = items[i];
					if (k.indexOf(item.objectIndex) != -1 || k.indexOf(item.aIndex) != -1) {
						tmp.push(item);
					}
				}
			}

			return tmp;
		}
	}]);

	return MouseEvent;
}(InteractiveEvent);

var mouseEvents = {
	CLICK: "click",
	MOUSE_DOWN: "mousedown",
	MOUSE_UP: "mouseup",
	MOUSE_MOVE: "mousemove"
};

for (var key in mouseEvents) {
	MouseEvent[key] = mouseEvents[key];
}

MouseEvent.nameList = Util.keys(mouseEvents);

Moco.MouseEvent = MouseEvent;
