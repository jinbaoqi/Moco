;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function (window, undefined) {
	var Moco = {};
	var fnRegExp = /\s+/g;
	var guid = 0;

	var Util = function () {
		function Util() {
			_classCallCheck(this, Util);
		}

		_createClass(Util, null, [{
			key: "isType",
			value: function isType(target, type) {
				return Object.prototype.toString.call(target) == "[object " + type + "]";
			}
		}, {
			key: "each",
			value: function each(arr, callback) {
				if (arr && Array.prototype.forEach) {
					Array.prototype.forEach.call(arr, callback);
				} else if (this.isType("Array", arr)) {
					for (var i = 0, len = arr.length; i < len; i++) {
						callback(arr[i], i, arr);
					}
				}
			}
		}, {
			key: "filter",
			value: function filter(arr, callback) {
				var _me = this;

				if (arr && Array.prototype.filter) {
					return Array.prototype.filter.call(arr, callback);
				} else {
					var _ret = function () {
						var tmp = [];
						_me.each(arr, function (item, index, arr) {
							if (callback.call(arr, item, index, arr) == true) {
								tmp.push(item);
							}
						});
						return {
							v: tmp
						};
					}();

					if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
				}
			}
		}, {
			key: "deg2rad",
			value: function deg2rad(deg) {
				return deg * Math.PI / 180;
			}
		}, {
			key: "keys",
			value: function keys(obj) {
				var keys = [];

				if (obj) {
					if (Object.keys) {
						return Object.keys(obj);
					} else {
						for (var key in obj) {
							if (obj.hasOwnProperty(key)) {
								keys.push(key);
							}
						}
					}
				}

				return keys;
			}
		}, {
			key: "inArray",
			value: function inArray(item, arr, fn) {
				for (var _i = 0, len = arr.length; _i < len; _i++) {
					if (typeof fn == "function") {
						if (fn.call(item, item, arr[_i], _i, arr)) {
							return _i;
						}
					} else if (arr[_i] == item) {
						return _i;
					}
				}

				return -1;
			}
		}, {
			key: "extends",
			value: function _extends(obj) {
				var _me = this;

				if (!_me.isType(obj, "Object")) {
					return obj;
				}

				for (var _i2 = 1, length = arguments.length; _i2 < length; _i2++) {
					var source = arguments[_i2];
					for (var prop in source) {
						if (hasOwnProperty.call(source, prop)) {
							obj[prop] = source[prop];
						}
					}
				}

				return obj;
			}
		}, {
			key: "clone",
			value: function clone(obj) {
				var _me = this;

				if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object") {
					return obj;
				}

				return _me.isType(obj, "Array") ? Array.prototype.slice.call(obj) : _me.extends({}, obj);
			}
		}]);

		return Util;
	}();

	Moco.Util = Util;

	var Timer = function () {
		function Timer() {
			_classCallCheck(this, Timer);
		}

		_createClass(Timer, null, [{
			key: "add",
			value: function add(timerObject) {
				var _me = this;
				var index = Util.inArray(timerObject, _me._list, function (obj, item) {
					return obj.aIndex == item.aIndex;
				});

				if (index == -1) {
					_me._list.push(timerObject);
				}

				return _me;
			}
		}, {
			key: "remove",
			value: function remove(timerObject) {
				var _me = this;
				var index = Util.inArray(timerObject, _me._list, function (obj, item) {
					return obj.aIndex == item.aIndex;
				});

				if (index != -1) {
					_me._list.splice(index, 1);
				}

				return _me;
			}
		}, {
			key: "start",
			value: function start() {
				var _me = this;
				_me.isStoped = false;

				if (!_me._isInit) {
					_me._init();
				}

				_me._raf();

				return _me;
			}
		}, {
			key: "stop",
			value: function stop() {
				var _me = this;
				_me.isStoped = true;

				if (!_me._isInit) {
					_me._init();
				}

				_me._craf();

				return _me;
			}
		}, {
			key: "_init",
			value: function _init() {
				var _me = this;
				var lastTime = 0;
				var vendors = ['webkit', 'moz'];
				var requestAnimationFrame = window.requestAnimationFrame;
				var cancelAnimationFrame = window.cancelAnimationFrame;
				var i = vendors.length;

				while (--i >= 0 && !requestAnimationFrame) {
					requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
					cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
				}

				if (!requestAnimationFrame || !cancelAnimationFrame) {
					requestAnimationFrame = function requestAnimationFrame(callback) {
						var now = +new Date(),
						    nextTime = Math.max(lastTime + 16, now);
						return setTimeout(function () {
							callback(lastTime = nextTime);
						}, nextTime - now);
					};

					cancelAnimationFrame = clearTimeout;
				}

				_me._requestAnimationFrame = requestAnimationFrame;
				_me._cancelAnimationFrame = cancelAnimationFrame;
				_me._isInit = true;
			}
		}, {
			key: "_raf",
			value: function _raf() {
				var _me = this;
				var callback = function callback() {
					var list = _me._list;
					for (var _i3 = 0, len = list.length; _i3 < len; _i3++) {
						var item = list[_i3];
						if (item.tick) {
							item.tick();
						}
					}
					_me._raf();
				};

				_me._timer = _me._requestAnimationFrame.call(window, callback);
			}
		}, {
			key: "_craf",
			value: function _craf() {
				var _me = this;
				_me._cancelAnimationFrame.call(window, _me._timer);
			}
		}]);

		return Timer;
	}();

	Timer._list = [];
	Timer._isInit = false;
	Timer._timer = null;
	Timer._requestAnimationFrame = null;
	Timer._cancelAnimationFrame = null;
	Timer.isStoped = false;

	Moco.Timer = Timer;

	var Vec3 = function () {
		function Vec3(x, y, z) {
			_classCallCheck(this, Vec3);

			this.x = x || 0;
			this.y = y || 0;
			this.z = z || 0;
		}

		_createClass(Vec3, [{
			key: "distance",
			value: function distance() {
				var x = this.x;
				var y = this.y;
				var z = this.z;

				return Math.sqrt(x * x + y * y + z * z);
			}
		}, {
			key: "multi",
			value: function multi(k) {
				if (k instanceof Vec3) {
					var x = k.x;
					var _y = k.y;
					var _z = k.z;


					return this.x * x + this.y * _y + this.z * _z;
				} else {
					var _x = y = z = k;

					this.x *= _x;
					this.y *= y;
					this.z *= z;
				}

				return this;
			}
		}, {
			key: "divi",
			value: function divi(k) {
				if (k instanceof Vec3) {
					var x = k.x;
					var y = k.y;
					var z = k.z;


					return this.x / x + this.y / y + this.z / z;
				} else {
					var _x2 = y = z = k;

					this.x /= _x2;
					this.y /= y;
					this.z /= z;
				}

				return this;
			}
		}, {
			key: "add",
			value: function add(vec3) {
				this.x += vec3.x;
				this.y += vec3.y;
				this.z += vec3.z;
				return this;
			}
		}, {
			key: "sub",
			value: function sub(vec3) {
				var clone = Vec3.clone(vec3);
				clone.multi(-1);
				this.add(clone);
				return this;
			}
		}, {
			key: "multiMatrix3",
			value: function multiMatrix3(m) {
				var matrix = m.getMatrix();
				var x = this.x;
				var y = this.y;
				var z = this.z;

				this.x = x * matrix[0] + y * matrix[3] + z * matrix[6];
				this.y = x * matrix[1] + y * matrix[4] + z * matrix[7];
				this.z = x * matrix[2] + y * matrix[5] + z * matrix[8];
				return this;
			}
		}], [{
			key: "zero",
			value: function zero() {
				return new Vec3(0, 0, 0);
			}
		}, {
			key: "clone",
			value: function clone(vec3) {
				return new Vec3(vec3.x, vec3.y, vec3.z);
			}
		}, {
			key: "angle",
			value: function angle(v1, v2) {
				var c1 = Vec3.clone(v1);
				var c2 = Vec3.clone(v2);
				var rad = c1.multi(c2) / (v1.distance() * v2.distance());
				return Math.acos(rad);
			}
		}, {
			key: "equal",
			value: function equal(v1, v2) {
				return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
			}
		}, {
			key: "crossProduct",
			value: function crossProduct(v1, v2) {
				return new Vec3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
			}
		}, {
			key: "proj",
			value: function proj(v1, v2) {
				var v = Vec3.clone(v2);
				var distance = v.distance();
				var vii = v.multi(Vec3.zero().add(v1).multi(v) / (distance * distance));
				return v1.sub(vii);
			}
		}, {
			key: "norm",
			value: function norm(vec3) {
				var clone = Vec3.clone(vec3);
				var distance = clone.distance();
				if (distance) {
					return clone.multi(1 / distance);
				} else {
					throw new Exception("zero vec3 can't be norm");
				}
			}
		}]);

		return Vec3;
	}();

	Moco.Vec3 = Vec3;

	var Matrix3 = function () {
		function Matrix3(m) {
			_classCallCheck(this, Matrix3);

			this._matrix = m || [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
		}

		_createClass(Matrix3, [{
			key: "setMatrix",
			value: function setMatrix(matrix) {
				this._matrix = matrix;
				return this;
			}
		}, {
			key: "getMatrix",
			value: function getMatrix() {
				return this._matrix;
			}
		}, {
			key: "add",
			value: function add(matrix3) {
				var matrix = matrix3._matrix;

				this._matrix[0] += matrix[0];
				this._matrix[1] += matrix[1];
				this._matrix[2] += matrix[2];

				this._matrix[3] += matrix[3];
				this._matrix[4] += matrix[4];
				this._matrix[5] += matrix[5];

				this._matrix[6] += matrix[6];
				this._matrix[7] += matrix[7];
				this._matrix[8] += matrix[8];

				return this;
			}
		}, {
			key: "sub",
			value: function sub(matrix3) {
				var matrix = matrix3._matrix;

				this._matrix[0] -= matrix[0];
				this._matrix[1] -= matrix[1];
				this._matrix[2] -= matrix[2];

				this._matrix[3] -= matrix[3];
				this._matrix[4] -= matrix[4];
				this._matrix[5] -= matrix[5];

				this._matrix[6] -= matrix[6];
				this._matrix[7] -= matrix[7];
				this._matrix[8] -= matrix[8];

				return this;
			}
		}, {
			key: "multi",
			value: function multi(matrix3) {
				var matrix = matrix3._matrix;

				var b00 = matrix[0];
				var b10 = matrix[1];
				var b20 = matrix[2];

				var b01 = matrix[3];
				var b11 = matrix[4];
				var b21 = matrix[5];

				var b02 = matrix[6];
				var b12 = matrix[7];
				var b22 = matrix[8];

				matrix = this._matrix;

				var a00 = matrix[0];
				var a10 = matrix[1];
				var a20 = matrix[2];

				var a01 = matrix[3];
				var a11 = matrix[4];
				var a21 = matrix[5];

				var a02 = matrix[6];
				var a12 = matrix[7];
				var a22 = matrix[8];

				matrix[0] = a00 * b00 + a01 * b10 + a02 * b20;
				matrix[1] = a10 * b00 + a11 * b10 + a12 * b20;
				matrix[2] = a20 * b00 + a21 * b10 + a22 * b20;

				matrix[3] = a00 * b01 + a01 * b11 + a02 * b21;
				matrix[4] = a10 * b01 + a11 * b11 + a12 * b21;
				matrix[5] = a20 * b01 + a21 * b11 + a22 * b21;

				matrix[6] = a00 * b02 + a01 * b12 + a02 * b22;
				matrix[7] = a10 * b02 + a11 * b12 + a12 * b22;
				matrix[8] = a20 * b02 + a21 * b12 + a22 * b22;

				return this;
			}
		}, {
			key: "translate",
			value: function translate(x, y) {
				this._matrix[6] = x;
				this._matrix[7] = y;

				return this;
			}
		}, {
			key: "rotate",
			value: function rotate(angle) {
				var cosa = Math.cos(angle * Math.PI / 180);
				var sina = Math.sin(angle * Math.PI / 180);
				this._matrix[0] = cosa;
				this._matrix[1] = sina;
				this._matrix[3] = -sina;
				this._matrix[4] = cosa;

				return this;
			}
		}, {
			key: "scale",
			value: function scale(scaleX, scaleY) {
				this._matrix[0] = scaleX;
				this._matrix[4] = scaleY;

				return this;
			}
		}], [{
			key: "clone",
			value: function clone(m) {
				var matrix = m.getMatrix();
				var tmp = [];

				for (var _i4 = 0, len = matrix.length; _i4 < len; _i4++) {
					tmp[_i4] = matrix[_i4];
				}

				return new Matrix3(tmp);
			}
		}, {
			key: "copy",
			value: function copy(m) {
				var clone = Matrix3.clone(m2);
				m1.setMatrix(clone.getMatrix());
			}
		}, {
			key: "zero",
			value: function zero() {
				return new Matrix3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
			}
		}, {
			key: "identity",
			value: function identity() {
				return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
			}
		}, {
			key: "translation",
			value: function translation(x, y) {
				return new Matrix3([1, 0, 0, 0, 1, 0, x, y, 1]);
			}
		}, {
			key: "rotation",
			value: function rotation(angle) {
				var cosa = Math.cos(angle * Math.PI / 180);
				var sina = Math.sin(angle * Math.PI / 180);
				return new Matrix3([cosa, sina, 0, -sina, cosa, 0, 0, 0, 1]);
			}
		}, {
			key: "scaling",
			value: function scaling(scaleX, scaleY) {
				return new Matrix3([scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1]);
			}
		}, {
			key: "transpose",
			value: function transpose(m) {
				var matrix = m.getMatrix();
				var tmp = null;

				tmp = matrix[1];
				matrix[1] = matrix[3];
				matrix[3] = tmp;

				tmp = matrix[2];
				matrix[2] = matrix[6];
				matrix[6] = tmp;

				tmp = matrix[5];
				matrix[5] = matrix[7];
				matrix[7] = tmp;

				m.setMatrix(matrix);
			}
		}, {
			key: "inverse",
			value: function inverse(m) {
				var matrix = m.getMatrix();

				var a00 = matrix[0];
				var a01 = matrix[1];
				var a02 = matrix[2];

				var a10 = matrix[3];
				var a11 = matrix[4];
				var a12 = matrix[5];

				var a20 = matrix[6];
				var a21 = matrix[7];
				var a22 = matrix[8];

				var deter = a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 - a02 * a11 * a20 - a01 * a10 * a22 - a00 * a12 * a21;

				var c00 = (a11 * a22 - a21 * a12) / deter;
				var c01 = -(a10 * a22 - a20 * a12) / deter;
				var c02 = (a10 * a21 - a20 * a11) / deter;

				var c10 = -(a01 * a22 - a21 * a02) / deter;
				var c11 = (a00 * a22 - a20 * a02) / deter;
				var c12 = -(a00 * a21 - a20 * a01) / deter;

				var c20 = (a01 * a12 - a11 * a02) / deter;
				var c21 = -(a00 * a12 - a10 * a02) / deter;
				var c22 = (a00 * a11 - a10 * a01) / deter;

				matrix = new Matrix3([c00, c01, c02, c10, c11, c12, c20, c21, c22]);

				Matrix3.transpose(matrix);

				return matrix;
			}
		}]);

		return Matrix3;
	}();

	Moco.Matrix3 = Matrix3;

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

					var isNotExists = Util.inArray(item, list[eventName], function (a1, a2) {
						return a1.aIndex == a2.aIndex;
					}) == -1;

					if (isNotExists) {
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
						var isExists = Util.inArray(item, list[eventName], function (a1, a2) {
							return a1.aIndex == a2.aIndex;
						}) != -1;

						if (isExists) {
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

	var MouseEvent = function (_InteractiveEvent) {
		_inherits(MouseEvent, _InteractiveEvent);

		function MouseEvent() {
			_classCallCheck(this, MouseEvent);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseEvent).apply(this, arguments));
		}

		_createClass(MouseEvent, null, [{
			key: "getTopItem",
			value: function getTopItem(eventName, cord) {
				var _me = this;
				var items = _me._list[eventName] || [];

				items = Util.filter(items, function (item) {
					if (item.isMouseon && item.isMouseon(cord)) {
						return true;
					}
				});

				items = Array.prototype.sort.call(items, function (i, j) {
					var a1 = i.objectIndex.split(".");
					var a2 = j.objectIndex.split(".");
					var len = Math.max(a1.length, a2.length);

					for (var _i5 = 0; _i5 < len; _i5++) {
						if (!a2[_i5] || !a1[_i5]) {
							return a2[_i5] ? 1 : -1;
						} else if (a2[_i5] != a1[_i5]) {
							return a2[_i5] - a1[_i5];
						}
					}
				});

				return items[0];
			}
		}]);

		return MouseEvent;
	}(InteractiveEvent);

	var mouseEvents = {
		CLICK: "click",
		MOUSEDOWN: "mousedown",
		MOUSEUP: "mouseup",
		MOUSEMOVE: "mousemove"
	};

	for (var key in mouseEvents) {
		MouseEvent[key] = mouseEvents[key];
	}

	MouseEvent.nameList = Util.keys(mouseEvents);

	Moco.MouseEvent = MouseEvent;

	var KeyboardEvent = function (_InteractiveEvent2) {
		_inherits(KeyboardEvent, _InteractiveEvent2);

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
		KEYDOWN: "keydown",
		KEYUP: "keyup",
		KEYPRESS: "keypress"
	};

	for (var _key in keyboardEvents) {
		KeyboardEvent[_key] = keyboardEvents[_key];
	}

	KeyboardEvent.nameList = Util.keys(keyboardEvents);

	Moco.KeyboardEvent = KeyboardEvent;

	var EventDispatcher = function () {
		function EventDispatcher() {
			_classCallCheck(this, EventDispatcher);
		}

		_createClass(EventDispatcher, [{
			key: "on",
			value: function on(target, eventName, callback, useCapture) {
				var _me = this;

				if (typeof target == "string") {
					var _ref = [_me, target, eventName, callback];
					target = _ref[0];
					eventName = _ref[1];
					callback = _ref[2];
					useCapture = _ref[3];
				}

				if (eventName && callback) {
					useCapture = useCapture ? useCapture : false;

					if (Util.isType(eventName, "Array")) {
						Util.each(eventName, function (item) {
							_me.on(item, callback, useCapture);
						});
					} else {
						(function () {
							var handlers = target.handlers;
							var fn = function fn(event) {
								var callbacks = handlers[eventName];
								var ev = _me._fixEvent(event);

								for (var _i6 = 0, len = callbacks.length; _i6 < len; _i6++) {
									var item = callbacks[_i6];
									if (ev.isImmediatePropagationStopped()) {
										break;
									} else if (item._guid == fn._guid) {
										item._callback.call(_me, ev);
									}
								}
							};

							fn._fnStr = callback._fntStr ? callback._fnStr : callback.toString().replace(fnRegExp, '');
							fn._callback = callback;
							fn._useCapture = useCapture;
							fn._guid = guid++;

							if (!handlers) {
								handlers = target.handlers = {};
							}

							if (!handlers[eventName]) {
								handlers[eventName] = [];
							}

							handlers[eventName].push(fn);

							if (handlers[eventName].length) {
								if (target.addEventListener) {
									target.addEventListener(eventName, fn, useCapture);
								} else if (target.attachEvent) {
									target.attachEvent(eventName, fn);
								}
							}
						})();
					}
				}

				return _me;
			}
		}, {
			key: "off",
			value: function off(target, eventName, callback) {
				var _me = this;

				if (typeof target == "string") {
					var _ref2 = [_me, target, eventName];
					target = _ref2[0];
					eventName = _ref2[1];
					callback = _ref2[2];
				}

				if (eventName || callback) {
					if (Util.isType(eventName, "Array")) {
						Util.each(eventName, function (item) {
							_me.off(target, item, callback);
						});
					} else if (!callback) {
						var handlers = target.handlers;

						if (handlers) {
							var callbacks = handlers[eventName] ? handlers[eventName] : [];
							Util.each(callbacks, function (item) {
								_me.off(target, eventName, item);
							});
						}
					} else {
						var _handlers = target.handlers;

						if (_handlers) {
							var fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(fnRegExp, '');
							var _callbacks = _handlers[eventName] ? _handlers[eventName] : [];

							for (var _i7 = _callbacks.length - 1; _i7 >= 0; _i7--) {
								var item = _callbacks[_i7];
								if (item._fnStr == fnStr) {
									Array.prototype.splice.call(_callbacks, _i7, 1);
								}
							}
						}
					}
				}

				return _me;
			}
		}, {
			key: "once",
			value: function once(target, eventName, callback, useCapture) {
				var _me = this;

				if (typeof target == "string") {
					var _ref3 = [_me, target, eventName, callback];
					target = _ref3[0];
					eventName = _ref3[1];
					callback = _ref3[2];
					useCapture = _ref3[3];
				}

				var fn = function fn(event) {
					callback.call(_me, event);

					if (event.isImmediatePropagationStopped()) {
						_me.off(target, eventName, fn);
					}

					if (useCapture) {
						if (event.eventPhase == 0) {
							_me.off(target, eventName, fn);
						}
					} else {
						_me.off(target, eventName, fn);
					}
				};

				fn._fnStr = callback.toString().replace(fnRegExp, '');

				return _me.on(target, eventName, fn, useCapture);
			}
		}, {
			key: "trigger",
			value: function trigger(target, eventName, event) {
				var _me = this;

				if (!target && !eventName) {
					return;
				} else if (typeof target == "string") {
					var _ref4 = [_me, target, eventName];
					target = _ref4[0];
					eventName = _ref4[1];
					event = _ref4[2];
				}

				var handlers = target && target.handlers;

				if (!handlers) {
					return _me;
				}

				var callbacks = handlers[eventName] ? handlers[eventName] : [];

				//自定义事件trigger的时候需要修正target和currentTarget
				var ev = event || {};
				if (ev.target == null) {
					ev.target = ev.currentTarget = target;
				}

				ev = _me._fixEvent(ev);

				// 此处分开冒泡阶段函数和捕获阶段函数
				var parent = target.parent || target.parentNode;
				var handlerList = {
					propagations: [],
					useCaptures: []
				};

				while (parent) {
					var _handlers2 = null;
					if (_handlers2 = parent.handlers) {
						var _callbacks2 = _handlers2[eventName] ? _handlers2[eventName] : [];
						for (var _i8 = 0, len = _callbacks2.length; _i8 < len; _i8++) {
							var useCapture = _callbacks2[_i8]._useCapture;
							if (!useCapture) {
								handlerList.propagations.push({
									target: parent,
									callback: _callbacks2[_i8]
								});
							} else {
								var tmp = {
									target: parent,
									callback: _callbacks2[_i8]
								};

								!_i8 ? handlerList.useCaptures.unshift(tmp) : handlerList.useCaptures.splice(1, 0, tmp);
							}
						}
					}
					parent = parent.parent || parent.parentNode;
				}

				// 捕获阶段的模拟
				var useCaptures = handlerList.useCaptures;
				var prevTarget = null;
				ev.eventPhase = 0;
				for (var _i9 = 0, _len = useCaptures.length; _i9 < _len; _i9++) {
					var handler = useCaptures[_i9];
					target = handler.target;

					if (ev.isImmediatePropagationStopped()) {
						break;
					} else if (prevTarget == target && ev.isPropagationStopped()) {
						handler.callback.call(_me, ev);
					} else {
						handler.callback.call(_me, ev);
						prevTarget = target;
					}
				}

				var isUseCapturePhaseStopped = false;
				if (useCaptures.length) {
					isUseCapturePhaseStopped = ev.isImmediatePropagationStopped() || ev.isPropagationStopped();
				}

				// 目标阶段
				ev.eventPhase = 1;
				for (var _i10 = 0, _len2 = callbacks.length; _i10 < _len2; _i10++) {
					var item = callbacks[_i10];
					if (isUseCapturePhaseStopped) {
						break;
					} else {
						item.call(_me, ev);
					}
				}

				// 冒泡的模拟
				var propagations = handlerList.propagations;
				prevTarget = null;
				ev.eventPhase = 2;
				for (var _i11 = 0, _len3 = propagations.length; _i11 < _len3; _i11++) {
					var _handler = propagations[_i11];
					target = _handler.target;
					ev.target = target;
					if (isUseCapturePhaseStopped) {
						if (ev.isImmediatePropagationStopped() || ev.isPropagationStopped()) {
							break;
						} else {
							_handler.callback.call(_me, ev);
							prevTarget = target;
						}
					} else {
						if (ev.isImmediatePropagationStopped()) {
							break;
						} else if (ev.isPropagationStopped()) {
							if (prevTarget == target) {
								_handler.callback.call(_me, ev);
							} else {
								break;
							}
						} else {
							_handler.callback.call(_me, ev);
							prevTarget = target;
						}
					}
				}
			}
		}, {
			key: "_fixEvent",
			value: function _fixEvent(event) {
				var _me = this;
				var returnTrue = function returnTrue() {
					return true;
				};
				var returnFalse = function returnFalse() {
					return false;
				};

				if (!event || !event.isPropagationStopped) {
					(function () {
						event = event ? event : {};

						var preventDefault = event.preventDefault;
						var stopPropagation = event.stopPropagation;
						var stopImmediatePropagation = event.stopImmediatePropagation;

						if (!event.target) {
							event.target = event.srcElement || document;
						}

						if (!event.currentTarget) {
							event.currentTarget = _me;
						}

						event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

						event.preventDefault = function () {
							if (preventDefault) {
								preventDefault.call(event);
							}
							event.returnValue = false;
							event.isDefaultPrevented = returnTrue;
							event.defaultPrevented = true;
						};

						event.isDefaultPrevented = returnFalse;
						event.defaultPrevented = false;

						event.stopPropagation = function () {
							if (stopPropagation) {
								stopPropagation.call(event);
							}
							event.cancelBubble = true;
							event.isPropagationStopped = returnTrue;
						};

						event.isPropagationStopped = returnFalse;

						event.stopImmediatePropagation = function () {
							if (stopImmediatePropagation) {
								stopImmediatePropagation.call(event);
							}
							event.isImmediatePropagationStopped = returnTrue;
							event.stopPropagation();
						};

						event.isImmediatePropagationStopped = returnFalse;

						if (event.clientX != null) {
							var doc = document.documentElement,
							    body = document.body;

							event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);

							event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
						}

						event.which = event.charCode || event.keyCode;
					})();
				}

				return event;
			}
		}]);

		return EventDispatcher;
	}();

	Moco.EventDispatcher = EventDispatcher;

	var DisplayObject = function (_EventDispatcher) {
		_inherits(DisplayObject, _EventDispatcher);

		function DisplayObject() {
			_classCallCheck(this, DisplayObject);

			var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObject).call(this));

			_this3.name = "DisplayObject";
			_this3.alpha = 1;
			_this3._height = 0;
			_this3._width = 0;
			_this3.mask = null;
			_this3.rotate = 0;
			_this3.scaleX = 1;
			_this3.scaleY = 1;
			_this3.parent = null;
			_this3.globalCompositeOperation = "";
			_this3.x = 0;
			_this3.y = 0;
			_this3.parent = null;
			_this3.visible = true;
			_this3.aIndex = _this3.objectIndex = "" + guid++;
			_this3._isSaved = false;
			_this3._matrix = Matrix3.identity();

			_this3._observeOffsetProperty();
			_this3._observeTransformProperty();
			return _this3;
		}

		_createClass(DisplayObject, [{
			key: "show",
			value: function show(matrix) {
				var _me = this;
				var ctx = _me.ctx || _me.stage.ctx;

				_me._matrix = Matrix3.identity();

				if (!_me.visible || _me.alpha <= 0.001) {
					return false;
				}

				if (_me.mask != null && _me.mask.show || _me.alpha < 1 || _me.rotate != 0 || _me.scaleX != 1 || _me.scaleY != 1 || _me.x != 0 || _me.y != 0 || _me.globalCompositeOperation != "") {
					_me._isSaved = true;
					ctx.save();
				}

				if (_me.mask != null && _me.mask.show) {
					_me.mask.show();
					ctx.clip();
				}

				if (_me.alpha < 1) {
					ctx.globalAlpha = _me.alpha > 1 ? 1 : _me.alpha;
				}

				if (_me.x != 0 || _me.y != 0) {
					var x = _me.x;
					var _y2 = _me.y;
					_me._matrix.translate(x, _y2);
					ctx.translate(x, _y2);
				}

				if (_me.rotate != 0) {
					var angle = _me.rotate;
					_me._matrix.rotate(angle);
					ctx.rotate(Util.deg2rad(angle));
				}

				if (_me.scaleX != 1 || _me.scaleY != 1) {
					var scaleX = _me.scaleX;
					var scaleY = _me.scaleY;
					_me._matrix.scale(scaleX, scaleY);
					ctx.scale(scaleX, scaleY);
				}

				_me._matrix.multi(matrix);

				return true;
			}
		}, {
			key: "dispose",
			value: function dispose() {
				var _me = this;
				var eventNames = Util.keys(_me._handlers);
				_me.off(eventNames);
			}
		}, {
			key: "_getWidth",
			value: function _getWidth() {
				return this._width;
			}
		}, {
			key: "_getHeight",
			value: function _getHeight() {
				return this._height;
			}
		}, {
			key: "_observeOffsetProperty",
			value: function _observeOffsetProperty() {
				var _me = this;
				var properties = [{
					key: 'width',
					method: "_getWidth"
				}, {
					key: 'height',
					method: "_getHeight"
				}];

				var _loop = function _loop(len, _i12) {
					var prop = properties[_i12];
					Object.defineProperty(_me, prop.key, {
						get: function get() {
							return _me[prop.method].call(_me);
						}
					});
				};

				for (var _i12 = 0, len = properties.length; _i12 < len; _i12++) {
					_loop(len, _i12);
				}
			}
		}, {
			key: "_observeTransformProperty",
			value: function _observeTransformProperty() {
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
						return [value];
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

				var _loop2 = function _loop2(len, _i13) {
					var prop = properties[_i13];
					var val = _me[prop.key];
					Object.defineProperty(_me, prop.key, {
						set: function set(newValue) {
							val = newValue;
							_me._matrix[prop.method].apply(_me._matrix, prop.args(newValue));
						},
						get: function get() {
							return val;
						}
					});
				};

				for (var _i13 = 0, len = properties.length; _i13 < len; _i13++) {
					_loop2(len, _i13);
				}
			}
		}]);

		return DisplayObject;
	}(EventDispatcher);

	Moco.DisplayObject = DisplayObject;

	var InteractiveObject = function (_DisplayObject) {
		_inherits(InteractiveObject, _DisplayObject);

		function InteractiveObject() {
			_classCallCheck(this, InteractiveObject);

			var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(InteractiveObject).call(this));

			_this4.name = "InteractiveObject";
			return _this4;
		}

		_createClass(InteractiveObject, [{
			key: "on",
			value: function on(eventName, callback, useCapture) {
				var _me = this;
				var eventNameUpperCase = eventName.toUpperCase();
				var isMouseEvent = Util.inArray(eventNameUpperCase, MouseEvent.nameList) != -1;
				var isKeyboardEvent = Util.inArray(eventNameUpperCase, KeyboardEvent.nameList) != -1;

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
				var isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) != -1;
				var isKeyboardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) != -1;

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

	var DisplayObjectContainer = function (_InteractiveObject) {
		_inherits(DisplayObjectContainer, _InteractiveObject);

		function DisplayObjectContainer() {
			_classCallCheck(this, DisplayObjectContainer);

			var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObjectContainer).call(this));

			_this5.name = "DisplayObjectContainer";
			_this5._childList = [];
			return _this5;
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
					for (var _i14 = _me._childList.length - 1; _i14 >= 0; _i14--) {
						var item = _me._childList[_i14];
						if (item.aIndex == child.aIndex) {
							item.parent = null;
							item.stage = null;
							Array.prototype.splice.call(_me._childList, _i14, 1);
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

				var isDrew = _get(Object.getPrototypeOf(DisplayObjectContainer.prototype), "show", this).call(this, matrix);

				if (isDrew) {
					if (_me instanceof Sprite) {
						if (_me.graphics && _me.graphics.show) {
							_me.graphics.show(_me._matrix);
						}
					}

					for (var _i15 = 0, len = _me._childList.length; _i15 < len; _i15++) {
						var item = _me._childList[_i15];
						if (item.show) {
							item.show(_me._matrix);
						}
					}

					if (_me._isSaved) {
						var ctx = _me.ctx || _me.stage.ctx;
						_me._isSaved = false;
						ctx.restore();
					}
				}

				return isDrew;
			}
		}, {
			key: "_getWidth",
			value: function _getWidth() {
				var _me = this;
				var ex = 0;
				var childList = _me._childList;

				for (var _i16 = 0, len = childList.length; _i16 < len; _i16++) {
					var item = childList[_i16];
					var itemEx = item.width + item.x;
					ex = itemEx < ex ? ex : itemEx;
				}

				return ex;
			}
		}, {
			key: "_getHeight",
			value: function _getHeight() {
				var _me = this;
				var ey = 0;
				var childList = _me._childList;

				for (var _i17 = 0, len = childList.length; _i17 < len; _i17++) {
					var item = childList[_i17];
					var itemEy = item.height + item.y;
					ey = itemEy < ey ? ey : itemEy;
				}

				return ey;
			}
		}]);

		return DisplayObjectContainer;
	}(InteractiveObject);

	Moco.DisplayObjectContainer = DisplayObjectContainer;

	var Stage = function (_DisplayObjectContain) {
		_inherits(Stage, _DisplayObjectContain);

		function Stage(canvasId, fn) {
			_classCallCheck(this, Stage);

			var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Stage).call(this));

			_this6.name = "Stage";
			_this6.domElem = document.getElementById(canvasId);
			_this6._width = parseFloat(_this6.domElem.getAttribute("width"), 10);
			_this6._height = parseFloat(_this6.domElem.getAttribute("height"), 10);
			_this6.ctx = _this6.domElem.getContext("2d");

			var offset = _this6._getOffset();
			_this6.x = offset.left;
			_this6.y = offset.top;

			if (typeof fn == "function") {
				fn(_this6);
			}

			_this6.initialize();
			return _this6;
		}

		_createClass(Stage, [{
			key: "initialize",
			value: function initialize() {
				var _me = this;

				// Stage接管所有交互事件
				Util.each(MouseEvent.nameList, function (eventName) {
					eventName = MouseEvent[eventName];
					EventDispatcher.prototype.on.call(_me, _me.domElem, eventName, function (event) {
						_me._mouseEvent(event);
					}, false);
				});

				Util.each(KeyboardEvent.nameList, function (eventName) {
					eventName = KeyboardEvent[eventName];
					EventDispatcher.prototype.on.call(_me, document, eventName, function (event) {
						_me._keyboardEvent(event);
					});
				}, false);

				Timer.add(_me);
				Timer.start();
			}
		}, {
			key: "show",
			value: function show() {
				var _me = this;
				_me.ctx.clearRect(0, 0, _me._width, _me._height);
				_get(Object.getPrototypeOf(Stage.prototype), "show", this).call(this);
			}
		}, {
			key: "tick",
			value: function tick() {
				var _me = this;
				_me.show();
			}
		}, {
			key: "addChild",
			value: function addChild(child) {
				var _me = this;
				var addStage = function addStage(child) {
					child.stage = _me;

					if (child instanceof Sprite && child.graphics) {
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
			key: "isMouseon",
			value: function isMouseon(cord) {
				return true;
			}
		}, {
			key: "_getWidth",
			value: function _getWidth() {
				return this._width;
			}
		}, {
			key: "_getHeight",
			value: function _getHeight() {
				return this._height;
			}
		}, {
			key: "_mouseEvent",
			value: function _mouseEvent(event) {
				var _me = this;
				var cord = {
					x: 0,
					y: 0
				};

				if (event.clientX != null) {
					cord.x = event.pageX - _me.x;
					cord.y = event.pageY - _me.y;
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

	var Sprite = function (_DisplayObjectContain2) {
		_inherits(Sprite, _DisplayObjectContain2);

		function Sprite() {
			_classCallCheck(this, Sprite);

			var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Sprite).call(this));

			_this7.name = "Sprite";
			_this7.graphics = null;
			return _this7;
		}

		_createClass(Sprite, [{
			key: "addChild",
			value: function addChild(child) {
				if (child instanceof Shape) {
					console.error("shape object should be linked to Sprite's graphics property");
				} else {
					_get(Object.getPrototypeOf(Sprite.prototype), "addChild", this).call(this, child);
				}
			}
		}, {
			key: "removeChild",
			value: function removeChild(child) {
				if (child instanceof Shape) {
					console.error("shape object should be linked to Sprite's graphics property");
				} else {
					_get(Object.getPrototypeOf(Sprite.prototype), "removeChild", this).call(this, child);
				}
			}
		}, {
			key: "show",
			value: function show(matrix) {
				var _me = this;
				var isDrew = _get(Object.getPrototypeOf(Sprite.prototype), "show", this).call(this, matrix);

				if (isDrew) {
					if (_me._isSaved) {
						var ctx = _me.ctx || _me.stage.ctx;
						_me._isSaved = false;
						ctx.restore();
					}
				}

				return isDrew;
			}
		}, {
			key: "isMouseon",
			value: function isMouseon(cord) {
				return true;
			}
		}, {
			key: "_getWidth",
			value: function _getWidth() {
				var _me = this;
				var shape = _me.graphics;
				var width = _get(Object.getPrototypeOf(Sprite.prototype), "_getWidth", this).call(this);

				if (shape) {
					var shapeWidth = shape.x + shape.width;
					width = shapeWidth < width ? width : shapeWidth;
				}

				return width;
			}
		}, {
			key: "_getHeight",
			value: function _getHeight() {
				var _me = this;
				var shape = _me.graphics;
				var height = _get(Object.getPrototypeOf(Sprite.prototype), "_getHeight", this).call(this);

				if (shape) {
					var shapeHeight = shape.x + shape.height;
					height = shapeHeight < height ? height : shapeHeight;
				}

				return height;
			}
		}]);

		return Sprite;
	}(DisplayObjectContainer);

	Moco.Sprite = Sprite;

	var Shape = function (_DisplayObject2) {
		_inherits(Shape, _DisplayObject2);

		function Shape() {
			_classCallCheck(this, Shape);

			var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(Shape).call(this));

			_this8.name = "Shape";
			_this8._showList = [];
			_this8._setList = [];
			return _this8;
		}

		_createClass(Shape, [{
			key: "on",
			value: function on() {
				console.error("shape object can't interative event, please add shape to sprite");
			}
		}, {
			key: "off",
			value: function off() {
				console.error("shape object can't interative event, please add shape to sprite");
			}
		}, {
			key: "show",
			value: function show(matrix) {
				var _me = this;
				var showList = _me._showList;
				var isDrew = _get(Object.getPrototypeOf(Shape.prototype), "show", this).call(this, matrix);

				if (isDrew) {
					for (var _i18 = 0, len = showList.length; _i18 < len; _i18++) {
						var showListItem = showList[_i18];
						if (typeof showListItem == "function") {
							showListItem();
						}
					}

					if (_me._isSaved) {
						var ctx = _me.ctx || _me.stage.ctx;
						_me._isSaved = false;
						ctx.restore();
					}
				}

				return isDrew;
			}
		}, {
			key: "lineWidth",
			value: function lineWidth(thickness) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.lineWidth = thickness;
				});
			}
		}, {
			key: "strokeStyle",
			value: function strokeStyle(color) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.strokeStyle = color;
				});
			}
		}, {
			key: "stroke",
			value: function stroke() {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.stroke();
				});
			}
		}, {
			key: "beginPath",
			value: function beginPath() {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.beginPath();
				});
			}
		}, {
			key: "closePath",
			value: function closePath() {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.closePath();
				});
			}
		}, {
			key: "moveTo",
			value: function moveTo(x, y) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.moveTo(x, y);
				});
			}
		}, {
			key: "lineTo",
			value: function lineTo(x, y) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.lineTo(x, y);
				});
			}
		}, {
			key: "clear",
			value: function clear() {
				var _me = this;
				_me._showList = [];
				_me._setList = [];
			}
		}, {
			key: "rect",
			value: function rect(x, y, width, height) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					_me.stage.ctx.rect(x, y, width, height);
				});

				_me._setList.push({
					type: "rect",
					area: [x, y, width, height]
				});
			}
		}, {
			key: "fillStyle",
			value: function fillStyle(color) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.fillStyle = color;
				});
			}
		}, {
			key: "fill",
			value: function fill() {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.fill();
				});
			}
		}, {
			key: "arc",
			value: function arc(x, y, r, sAngle, eAngle, direct) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.arc(x, y, r, sAngle, eAngle, direct);
				});

				_me._setList.push({
					type: "arc",
					area: [x, y, r, sAngle, eAngle, direct]
				});
			}
		}, {
			key: "drawArc",
			value: function drawArc(thickness, lineColor, arcArgs, isFill, color) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.beginPath();
					ctx.arc(arcArgs[0], arcArgs[1], arcArgs[2], arcArgs[3], arcArgs[4], arcArgs[5]);

					if (isFill) {
						ctx.fillStyle = color;
						ctx.fill();
					}

					ctx.lineWidth = thickness;
					ctx.strokeStyle = lineColor;
					ctx.stroke();
				});

				_me._setList.push({
					type: "arc",
					area: arcArgs
				});
			}
		}, {
			key: "drawRect",
			value: function drawRect(thickness, lineColor, rectArgs, isFill, color) {
				var _me = this;
				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.beginPath();
					ctx.rect(rectArgs[0], rectArgs[1], rectArgs[2], rectArgs[3]);

					if (isFill) {
						ctx.fillStyle = color;
						ctx.fill();
					}

					ctx.lineWidth = thickness;
					ctx.strokeStyle = lineColor;
					ctx.stroke();
				});

				_me._setList.push({
					type: "rect",
					area: rectArgs
				});
			}
		}, {
			key: "drawVertices",
			value: function drawVertices(thickness, lineColor, vertices, isFill, color) {
				var _me = this;
				var len = vertices.length;

				if (len < 3) {
					return;
				}

				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.beginPath();
					ctx.moveTo(vertices[0][0], vertices[0][1]);

					for (i = 1; i < len; i++) {
						var pointArr = vertices[i];
						ctx.lineTo(pointArr[0], pointArr[1]);
					}

					ctx.lineTo(vertices[0][0], vertices[0][1]);

					if (isFill) {
						ctx.fillStyle = color;
						ctx.fill();
					}

					ctx.lineWidth = thickness;
					ctx.strokeStyle = lineColor;
					ctx.closePath();
					ctx.stroke();
				});

				_me._setList.push({
					type: "vertices",
					area: vertices
				});
			}
		}, {
			key: "drawLine",
			value: function drawLine(thickness, lineColor, points) {
				var _me = this;

				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.beginPath();
					ctx.moveTo(points[0], points[1]);
					ctx.lineTo(points[2], points[3]);
					ctx.lineWidth = thickness;
					ctx.strokeStyle = lineColor;
					ctx.closePath();
					ctx.stroke();
				});
			}
		}, {
			key: "lineStyle",
			value: function lineStyle(thickness, color, alpha) {
				var _me = this;

				if (alpha) {
					_me.alpha = alpha;
				}

				_me._showList.push(function () {
					var ctx = _me.ctx || _me.stage.ctx;
					ctx.lineWidth = thickness;
					ctx.strokeStyle = color;
				});
			}
		}, {
			key: "add",
			value: function add(fn) {
				var _me = this;
				_me._showList.push(function () {
					fn.call(_me);
				});
			}
		}, {
			key: "isMouseon",
			value: function isMouseon(cord) {
				return false;
			}
		}, {
			key: "_getWidth",
			value: function _getWidth() {
				return this._width;
			}
		}, {
			key: "_getHeight",
			value: function _getHeight() {
				return this._height;
			}
		}]);

		return Shape;
	}(DisplayObject);

	Moco.Shape = Shape;

	window.Moco = Moco;
})(window, undefined);
