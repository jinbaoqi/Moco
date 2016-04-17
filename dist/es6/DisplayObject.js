

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
		_this.translateX = 0;
		_this.translateY = 0;
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
		return _this;
	}

	_createClass(DisplayObject, [{
		key: "show",
		value: function show(cord) {
			var _me = this;
			var canvas = _me.ctx || _me.stage.ctx;

			if (!_me.visible) {
				return;
			}

			if (_me.parent && _me.parent instanceof Stage) {
				cord.ox = _me.x;
				cord.oy = _me.y;
			} else {
				cord.x += _me.x;
				cord.y += _me.y;
			}

			cord.scaleX *= _me.scaleX;
			cord.scaleY *= _me.scaleY;

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

			if (_me.translateX != 0 || _me.translateY != 0) {
				canvas.translate(_me.translateX, _me.translateY);
			}

			if (_me.scaleX != 1 || _me.scaleY != 1) {
				canvas.scale(_me.scaleX, _me.scaleY);
			}

			if (_me.rotate != 0) {
				var ox = cord.x + cord.ox / cord.scaleX;
				var oy = cord.y + cord.oy / cord.scaleY;

				canvas.translate(ox, oy);
				canvas.rotate(Util.deg2rad(_me.rotate));
				canvas.translate(-ox, -oy);
			}
		}
	}, {
		key: "dispose",
		value: function dispose() {
			var _me = this;
			var eventNames = Util.keys(_me._handlers);

			_me.off(eventNames);
		}
	}, {
		key: "_getOffset",
		value: function _getOffset() {
			var _me = this;
			var parents = [];
			var parent = _me;
			var offset = {
				x: 0,
				y: 0,
				scaleX: 1,
				scaleY: 1
			};

			while (parent) {
				parents.push(parent);
				parent = parent.parent;
			}

			for (i = parents.length - 1; i >= 0; i--) {
				parent = parents[i];
				offset = self._getActualOffset(offset, parent);
			}

			return offset;
		}
	}, {
		key: "_getActualOffset",
		value: function _getActualOffset(offset, parent) {
			offset.scaleX *= parent.scaleX;
			offset.scaleY *= parent.scaleY;

			if (parent.parent instanceof Stage) {
				offset.x += parent.x + parent.translateX;
				offset.y += parent.y + parent.translateY;
			} else {
				offset.x += (parent.x + parent.translateX) * offset.scaleX;
				offset.y += (parent.y + parent.translateY) * offset.scaleY;
			}

			return offset;
		}
	}]);

	return DisplayObject;
}(EventDispatcher);

Moco.DisplayObject = DisplayObject;
