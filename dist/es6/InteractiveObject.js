"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InteractiveObject = function (_DisplayObject) {
	_inherits(InteractiveObject, _DisplayObject);

	function InteractiveObject() {
		_classCallCheck(this, InteractiveObject);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InteractiveObject).call(this));

		_this.name = "InteractiveObject";
		return _this;
	}

	_createClass(InteractiveObject, [{
		key: "on",
		value: function on(eventName, callback, useCapture) {
			var _me = this;
			var eventNameUpperCase = eventName.toUpperCase();
			var isMouseEvent = Util.inArray(eventNameUpperCase, MouseEvent.nameList) == -1;
			var isKeyboardEvent = Util.inArray(eventNameUpperCase, KeyboardEvent.nameList) == -1;

			if (!isMouseEvent && !isKeyboardEvent) {
				return;
			} else if (isMouseEvent) {
				MouseEvent.add(eventName, _me);
			} else if (isKeyboardEvent) {
				KeyboardEvent.add(eventName, _me);
			}

			_get(Object.getPrototypeOf(InteractiveObject.prototype), "on", this).call(this, eventName, callback, useCapture);
		}
	}, {
		key: "off",
		value: function off(eventName, callback) {
			var _me = this;
			var eventNameUpperCase = eventName.toUpperCase();
			var isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) == -1;
			var isKeyboardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) == -1;

			if (!isMouseEvent && !isKeyboardEvent) {
				return;
			} else if (isMouseEvent) {
				MouseEvent.remove(eventName, _me);
			} else if (isKeyboardEvent) {
				KeyBoardEvent.remove(eventName, _me);
			}

			_get(Object.getPrototypeOf(InteractiveObject.prototype), "off", this).call(this, eventName, callback);
		}
	}]);

	return InteractiveObject;
}(DisplayObject);

Moco.InteractiveObject = InteractiveObject;
