"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayObject = function (_EventDispatcher) {
	_inherits(DisplayObject, _EventDispatcher);

	function DisplayObject() {
		_classCallCheck(this, DisplayObject);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObject).call(this));

		_this.name = "DisplayObject";
		_this.alpha = 1;
		_this.height = 0;
		_this.width = 0;
		_this.mask = null;
		_this.rotate = 0;
		_this.scaleX = 1;
		_this.scaleY = 1;
		_this.parent = null;
		_this.globalCompositeOperation = "";
		_this.x = 0;
		_this.y = 0;
		_this.mouseX = 0;
		_this.mouseY = 0;
		_this.parent = null;
		_this.visible = true;
		_this.aIndex = _this.objectIndex = "" + guid++;
		_this._isSaved = false;
		_this._matrix = Matrix3.identity();

		_this._observe();
		return _this;
	}

	_createClass(DisplayObject, [{
		key: "show",
		value: function show(matrix) {
			var _me = this;
			var canvas = _me.ctx || _me.stage.ctx;

			this._matrix = Matrix3.identity();

			if (!_me.visible || _me.alpha <= 0.001) {
				return;
			}

			if (_me.mask != null && _me.mask.show || _me.alpha < 1 || _me.rotate != 0 || _me.scaleX != 1 || _me.scaleY != 1 || _me.translateX != 0 || _me.translateY != 0 || _me.globalCompositeOperation != "") {
				_me._isSaved = true;
				canvas.save();
			}

			if (_me.mask != null && _me.mask.show) {
				_me.mask.show();
				canvas.clip();
			}

			if (_me.alpha < 1) {
				canvas.globalAlpha = _me.alpha > 1 ? 1 : _me.alpha;
			}

			if (_me.x != 0 || _me.y != 0) {
				var x = _me.x;
				var y = _me.y;
				this._matrix.tranlsate(x, y);
				canvas.translate(x, y);
			}

			if (_me.rotate != 0) {
				var angle = _me.rotate;
				this._matrix.rotate(angle);
				canvas.rotate(Util.deg2rad(angle));
			}

			if (_me.scaleX != 1 || _me.scaleY != 1) {
				var scaleX = _me.scaleX;
				var scaleY = _me.scaleY;
				this._matrix.scale(scaleX, scaleY);
				canvas.scale(scaleX, scaleY);
			}

			this._matrix.multi(matrix);
		}
	}, {
		key: "dispose",
		value: function dispose() {
			var _me = this;
			var eventNames = Util.keys(_me._handlers);
			_me.off(eventNames);
		}
	}, {
		key: "_observe",
		value: function _observe() {
			var _this2 = this;

			var _me = this;
			var properties = [{
				key: 'x',
				method: 'translate',
				args: function args(value) {
					return [value, _me.y];
				}
			}, {
				key: 'y',
				method: 'translate',
				args: function args(value) {
					return [_me.x, value];
				}
			}, {
				key: 'rotate',
				method: 'rotate',
				args: function args(value) {
					return value;
				}
			}, {
				key: 'scaleX',
				method: 'scale',
				args: function args(value) {
					return [value, _me.scaleY];
				}
			}, {
				key: 'scaleY',
				method: 'scale',
				args: function args(value) {
					return [_me.scaleX, value];
				}
			}];

			var _loop = function _loop(i, len) {
				var prop = properties[i];
				var val = _me[prop.key];
				Object.defineProperty(_this2, prop.key, {
					set: function set(newValue) {
						val = newValue;
						_this2._matrix[prop.method].apply(_this2._matrix, prop.args(newValue));
					},
					get: function get() {
						return val;
					}
				});
			};

			for (var i = 0, len = properties.length; i < len; i++) {
				_loop(i, len);
			}
		}
	}]);

	return DisplayObject;
}(EventDispatcher);

Moco.DisplayObject = DisplayObject;
