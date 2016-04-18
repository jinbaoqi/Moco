"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
		_this.width = parseFloat(_this.domElem.getAttribute("width"), 10);
		_this.height = parseFloat(_this.domElem.getAttribute("height"), 10);
		_this.ctx = _this.domElem.getContext("2d");

		var offset = _this._getOffset();
		_this.x = offset.left;
		_this.y = offset.top;

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

			// Stage接管所有交互事件
			Util.each(MouseEvent.nameList, function (eventName) {
				eventName = mouseEvent[eventName];
				EventDispatcher.prototype.on.call(_me, _me.domElem, eventName, function (event) {
					_me._mouseEvent(event);
				});
			});

			Util.each(KeyboardEvent.nameList, function (event) {
				EventDispatcher.prototype.on.call(_me, _me.domElem, eventName, function () {
					_me.keyboardEvent(event);
				});
			});

			_me.show();
		}
	}, {
		key: "show",
		value: function show() {
			var _me = this;

			_me.ctx.clearRect(0, 0, _me.width, _me.height);

			_get(Object.getPrototypeOf(Stage.prototype), "show", this).call(this);

			if (_me._isSaved) {
				_me.ctx.restore();
			}

			raf(function () {
				_me.show();
			});
		}
	}, {
		key: "addChild",
		value: function addChild(child) {
			var _me = this;
			var addStage = function addStage(child) {
				child.stage = _me;

				if (child instanceof Sprite) {
					child.graphics.stage = _me;
					child.graphics.parent = child;
					child.graphics.objectIndex = child.objectIndex + ".0";
				}
			};

			addStage(child);

			if (child.getAllChild) {
				var childs = child.getAllChild();
				Util.each(childs, function (item) {
					addStage(item);
				});
			}

			_get(Object.getPrototypeOf(Stage.prototype), "addChild", this).call(this, child);
		}
	}, {
		key: "_mouseEvent",
		value: function _mouseEvent(event) {
			var cord = {
				x: 0,
				y: 0
			};

			event = Util.clone(event);

			if (event.clientX != null) {
				cord.x = event.pageX - _me.x;
				cord.y = event.pageY - _me.y;
				_me.mouseX = cord.x;
				_me.mouseY = cord.y;
			}

			event.cord = cord;

			var eventName = event.type;
			var item = MouseEvent.getTopItem(eventName, cord);
			if (item) {
				item.trigger(eventName, event);
			}
		}
	}, {
		key: "_keyboardEvent",
		value: function _keyboardEvent(event) {
			var eventName = event.type;
			var items = KeyboardEvent.getItems(eventName);

			if (items.length) {
				event = Util.clone(event);
				Util.each(items, function (item) {
					item.trigger(eventName, event);
				});
			}
		}
	}, {
		key: "_getOffset",
		value: function _getOffset() {
			return {
				top: 0,
				left: 0
			};
		}
	}]);

	return Stage;
}(DisplayObjectContainer);

Moco.Stage = Stage;
