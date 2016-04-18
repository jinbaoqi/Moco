"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KeyboardEvent = function (_InteractiveEvent) {
	_inherits(KeyboardEvent, _InteractiveEvent);

	function KeyboardEvent() {
		_classCallCheck(this, KeyboardEvent);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(KeyboardEvent).apply(this, arguments));
	}

	_createClass(KeyboardEvent, null, [{
		key: "getItems",
		value: function getItems(eventName) {
			var _me = this;
			return _me._list[eventName] || [];
		}
	}]);

	return KeyboardEvent;
}(InteractiveEvent);

var keyboardEvents = {
	KEY_DOWN: "keydown",
	KEY_UP: "keyup",
	KEY_PRESS: "keypress"
};

for (var key in keyboardEvents) {
	KeyboardEvent[key] = keyboardEvents[key];
}

KeyboardEvent.nameList = Util.keys(keyboardEvents);

Moco.KeyboardEvent = KeyboardEvent;
