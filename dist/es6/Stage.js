"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stage = function (_DisplayObjectContain) {
	_inherits(Stage, _DisplayObjectContain);

	function Stage(canvasId, fn) {
		_classCallCheck(this, Stage);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Stage).call(this));

		_this.name = "Stage";
		_this.domElem = document.getElementById(canvasId);
		_this.ctx = _this.domElem.getContext("2d");
		_this.width = parseFloat(_this.domElem.getAttribute("width"), 10);
		_this.height = parseFloat(_this.domElem.getAttribute("height"), 10);
		_this.offset = _this._getOffset();
		_this.x = _this.offset.left;
		_this.y = _this.offset.top;

		if (typeof fn == "function") {
			fn(_this);
		}

		_this.initialize();
		return _this;
	}

	_createClass(Stage, [{
		key: "initialize",
		value: function initialize() {
			var _me = this;

			Util.each(MouseEvent.nameList, function (eventName) {});
		}
	}, {
		key: "on",
		value: function on() {
			var _me = this;
			var args = Array.prototype.slice.call([], arguments);
			EventDispatcher.prototype.on.apply(_me, args);
		}
	}, {
		key: "off",
		value: function off() {
			var _me = this;
			var args = Array.prototype.slice.call([], arguments);
			EventDispatcher.prototype.on.apply(_me, args);
		}
	}, {
		key: "_getOffset",
		value: function _getOffset() {}
	}]);

	return Stage;
}(DisplayObjectContainer);

Moco.Stage = Stage;
