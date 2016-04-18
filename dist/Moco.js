;(function(window, undefined) {
var Moco = {};

'use strict';

var fnRegExp = /\s+/g;
var guid = 0;

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

var raf = requestAnimationFrame;
var craf = cancelAnimationFrame;

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
			if (arr && arrProto.forEach) {
				arrProto.forEach.call(arr, callback);
			} else if (this.isType("Array", arr)) {
				for (var i = 0, len = arr.length; i < len; i++) {
					callback(arr[i], i, arr);
				}
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
			if (Array.prototype.inArray) {
				return Array.prototype.inArray.call(arr, item);
			} else {
				for (var i = 0, len = arr.length; i < len; i++) {
					if (typeof fn == "function") {
						if (fn.call(item, item, arr[i], i, arr)) {
							return i;
						}
					} else if (arr[i] == item) {
						return i;
					}
				}

				return -1;
			}
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

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	}]);

	return Vec3;
}();

Vec3.zero = function () {
	return new Vec3(0, 0, 0);
};

Vec3.clone = function (vec3) {
	return new Vec3(vec3.x, vec3.y, vec3.z);
};

Vec3.angle = function (v1, v2) {
	var c1 = Vec3.clone(v1);
	var c2 = Vec3.clone(v2);
	var rad = c1.multi(c2) / (v1.distance() * v2.distance());
	return Math.acos(rad);
};

Vec3.equal = function (v1, v2) {
	return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
};

Vec3.crossProduct = function (v1, v2) {
	return new Vec3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
};

Vec3.proj = function (v1, v2) {
	var v = Vec3.clone(v2);
	var distance = v.distance();
	var vii = v.multi(Vec3.zero().add(v1).multi(v) / (distance * distance));
	return v1.sub(vii);
};

Vec3.norm = function (vec3) {
	var clone = Vec3.clone(vec3);
	var distance = clone.distance();
	if (distance) {
		return clone.multi(1 / distance);
	} else {
		throw new Exception("zero vec3 can't be norm");
	}
};

Moco.Vec3 = Vec3;

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	}]);

	return Matrix3;
}();

Matrix3.clone = function (m) {
	var matrix = m.getMatrix();
	var tmp = [];

	for (var i = 0, len = matrix.length; i < len; i++) {
		tmp[i] = matrix[i];
	}

	return new Matrix3(tmp);
};

Matrix3.copy = function (m1, m2) {
	var clone = Matrix3.clone(m2);
	m1.setMatrix(clone.getMatrix());
};

Matrix3.zero = function () {
	return new Matrix3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
};

Matrix3.identity = function (m) {
	return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
};

Matrix3.translation = function (x, y) {
	return new Matrix3([1, 0, 0, 0, 1, 0, x, y, 1]);
};

Matrix3.rotation = function (angle) {
	var cosa = Math.cos(angle * Math.PI / 180);
	var sina = Math.sin(angle * Math.PI / 180);
	return new Matrix3([cosa, sina, 0, -sina, cosa, 0, 0, 0, 1]);
};

Matrix3.scaling = function (scaleX, scaleY) {
	return new Matrix3([scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1]);
};

Matrix3.transpose = function (m) {
	var matrix = m.getMatrix();
	var tmp = null;

	temp = matrix[1];
	matrix[1] = matrix[3];
	matrix[3] = temp;

	temp = matrix[2];
	matrix[2] = matrix[6];
	matrix[6] = temp;

	temp = matrix[5];
	matrix[5] = matrix[7];
	matrix[7] = temp;

	m.setMatrix(matrix);
};

Matrix3.inverse = function (m) {
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
};

Moco.Matrix3 = Matrix3;

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

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KeyboardEvent = function (_InteractiveEvent) {
	_inherits(KeyboardEvent, _InteractiveEvent);

	function KeyboardEvent() {
		_classCallCheck(this, KeyboardEvent);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(KeyboardEvent).apply(this, arguments));
	}

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

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

							for (var i = 0, len = callbacks.length; i < len; i++) {
								var item = callbacks[i];
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

						for (var i = _callbacks.length - 1; i >= 0; i--) {
							var item = _callbacks[i];
							if (item._fnStr == fnStr) {
								Array.prototype.splice.call(_callbacks, i, 1);
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
			var parent = null;
			var handlerList = {
				propagations: [],
				useCaptures: []
			};

			if (parent = target.parentNode) {
				while (parent) {
					var _handlers2 = null;
					if (_handlers2 = parent.handlers) {
						var _callbacks2 = _handlers2[eventName] ? _handlers2[eventName] : [];
						for (var i = 0, len = _callbacks2.length; i < len; i++) {
							var useCapture = _callbacks2[i]._useCapture;
							if (!useCapture) {
								handlerList.propagations.push({
									target: parent,
									callback: _callbacks2[i]
								});
							} else {
								handlerList.useCaptures.push({
									target: parent,
									callback: _callbacks2[i]
								});
							}
						}
					}
					parent = parent.parentNode;
				}
			}

			// 捕获阶段的模拟
			var useCaptures = handlerList.useCaptures;
			var prevTarget = null;
			ev.eventPhase = 0;
			for (var _i = 0, _len = useCaptures.length; _i < _len; _i++) {
				var handler = useCaptures[_i];
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
			for (var _i2 = 0, _len2 = callbacks.length; _i2 < _len2; _i2++) {
				var item = callbacks[_i2];
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
			for (var _i3 = 0, _len3 = propagations.length; _i3 < _len3; _i3++) {
				var _handler = propagations[_i3];
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
				var doc, body;

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
						doc = document.documentElement;
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
		return _this;
	}

	_createClass(DisplayObject, [{
		key: "show",
		value: function show(matrix) {
			var _me = this;
			var canvas = _me.ctx || _me.stage.ctx;

			if (!_me.visible) {
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
				canvas.translate(x, y);
				matrix.translation(x, y);
			}

			if (_me.rotate != 0) {
				var angle = _me.rotate;
				canvas.rotate(Util.deg2rad(angle));
				matrix.rotation(angle);
			}

			if (_me.scaleX != 1 || _me.scaleY != 1) {
				var scaleX = _me.scaleX;
				var scaleY = _me.scaleY;
				canvas.scale(scaleX, scaleY);
				matrix.scaling(scaleX, scaleY);
			}

			this._matrix = Matrix.clone(matrix);
		}
	}, {
		key: "dispose",
		value: function dispose() {
			var _me = this;
			var eventNames = Util.keys(_me._handlers);
			_me.off(eventNames);
		}
	}]);

	return DisplayObject;
}(EventDispatcher);

Moco.DisplayObject = DisplayObject;

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
		_this._isInMouseList = false;
		_this._isInKeyboardList = false;
		return _this;
	}

	_createClass(InteractiveObject, [{
		key: "on",
		value: function on(eventName, callback, useCapture) {
			var _me = this;
			var isMouseEvent = ~Util.inArray(eventName, MouseEvent.nameList);
			var isKeyboardEvent = ~Util.inArray(eventName, KeyboardEvent.nameList);

			if (!isMouseEvent && !isKeyboardEvent || isMouseEvent && _me._inMouseList || isKeyboardEvent && _me._inKeyboardList) {
				return;
			} else if (isMouseEvent) {
				MouseEvent.add(_me);
				_me._isInMouseList = true;
			} else if (isKeyboardEvent) {
				KeyboardEvent.add(_me);
				_me._isInKeyboardList = true;
			}

			_get(Object.getPrototypeOf(InteractiveObject.prototype), "on", this).call(this, eventName, callback, useCapture);
		}
	}, {
		key: "off",
		value: function off(eventName, callback) {
			var _me = this;
			var isMouseEvent = ~Util.inArray(eventName, MouseEvent.nameList);
			var isKeyboardEvent = ~Util.inArray(eventName, KeyBoardEvent.nameList);

			if (!isMouseEvent && !isKeyboardEvent) {
				return;
			}

			_get(Object.getPrototypeOf(InteractiveObject.prototype), "off", this).call(this, eventName, callback);

			if (!Util.keys(_me.handlers).length) {
				if (isMouseEvent) {
					MouseEvent.remove(_me);
					_me._isInMouseList = true;
				} else if (isKeyboardEvent) {
					KeyBoardEvent.remove(_me);
					_me._isInKeyboardList = true;
				}
			}
		}
	}]);

	return InteractiveObject;
}(DisplayObject);

Moco.InteractiveObject = InteractiveObject;

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayObjectContainer = function (_InteractiveObject) {
	_inherits(DisplayObjectContainer, _InteractiveObject);

	function DisplayObjectContainer() {
		_classCallCheck(this, DisplayObjectContainer);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DisplayObjectContainer).call(this));

		_this.name = "DisplayObjectContainer";
		_this._childList = [];
		return _this;
	}

	_createClass(DisplayObjectContainer, [{
		key: "addChild",
		value: function addChild(child) {
			var _me = this;
			if (child instanceof DisplayObject) {
				_me._childList.push(child);
				child.parent = _me;
				child.objectIndex = _me.objectIndex + "." + _me._childList.length;
			}
		}
	}, {
		key: "removeChild",
		value: function removeChild(child) {
			var _me = this;
			if (child instanceof DisplayObject) {
				for (var i = _me._childList.length - 1; i >= 0; i--) {
					var item = _me._childList[i];
					if (item.aIndex == child.aIndex) {
						Array.prototype.splice.call(_me._childList, i, 1);
					}
				}
			}
		}
	}, {
		key: "getChildAt",
		value: function getChildAt(index) {
			var _me = this;
			var len = self._childList.length;

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
				return Util.inArray(_me._childList, child, function (child, item) {
					return child.aIndex == item.aIndex;
				}) == -1 ? false : true;
			}
		}
	}, {
		key: "show",
		value: function show(matrix) {
			var _me = this;

			// if this is a top container, matrix base on the itself
			if (matrix == null) {
				matrix = Matrix3.clone(_me._matrix);
			}

			_get(Object.getPrototypeOf(DisplayObjectContainer.prototype), "show", this).call(this, matrix);

			for (var i = 0, len = _me._childList.length; i < len; i++) {
				var item = _me._childList[i];
				if (item.show) {
					item.show(Matrix3.clone(matrix));
				}
			}
		}
	}]);

	return DisplayObjectContainer;
}(InteractiveObject);

Moco.DisplayObjectContainer = DisplayObjectContainer;

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

window.Moco = Moco;

}(window, undefined));