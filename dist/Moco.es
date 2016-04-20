;(function(window, undefined) {
var Moco = {};
let fnRegExp = /\s+/g;
let guid = 0;

class Util {
	static isType(target, type) {
		return Object.prototype.toString.call(target) == "[object " + type + "]";
	}

	static each(arr, callback) {
		if (arr && Array.prototype.forEach) {
			Array.prototype.forEach.call(arr, callback);
		} else if (this.isType("Array", arr)) {
			for (var i = 0, len = arr.length; i < len; i++) {
				callback(arr[i], i, arr);
			}
		}
	}

	static filter(arr, callback) {
		let _me = this;

		if (arr && Array.prototype.filter) {
			return Array.prototype.filter.call(arr, callback);
		} else {
			let tmp = [];
			_me.each(arr, function(item, index, arr) {
				if (callback.call(arr, item, index, arr) == true) {
					tmp.push(item);
				}
			});
			return tmp;
		}
	}

	static deg2rad(deg) {
		return deg * Math.PI / 180;
	}

	static keys(obj) {
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

	static inArray(item, arr, fn) {
		for (let i = 0, len = arr.length; i < len; i++) {
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

	static extends(obj) {
		var _me = this;

		if (!_me.isType(obj, "Object")) {
			return obj;
		}

		for (let i = 1, length = arguments.length; i < length; i++) {
			let source = arguments[i];
			for (let prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}

		return obj;
	}

	static clone(obj) {
		let _me = this;

		if (typeof obj != "object") {
			return obj;
		}

		return _me.isType(obj, "Array") ? Array.prototype.slice.call(obj) : _me.extends({}, obj);
	}
}

Moco.Util = Util;
class Timer {
	static add(timerObject) {
		let _me = this;
		let index = Util.inArray(timerObject, _me._list, (obj, item) => {
			return obj.aIndex == item.aIndex;
		});

		if (index == -1) {
			_me._list.push(timerObject);
		}

		return _me;
	}

	static remove(timerObject) {
		let _me = this;
		let index = Util.inArray(timerObject, _me._list, (obj, item) => {
			return obj.aIndex == item.aIndex;
		});

		if (index != -1) {
			_me._list.splice(index, 1);
		}

		return _me;
	}

	static start() {
		let _me = this;
		_me.isStoped = false;

		if (!_me._isInit) {
			_me._init();
		}

		_me._raf();

		return _me;
	}

	static stop() {
		let _me = this;
		_me.isStoped = true;

		if (!_me._isInit) {
			_me._init();
		}

		_me._craf();

		return _me;
	}

	static _init() {
		let _me = this;
		let lastTime = 0;
		let vendors = ['webkit', 'moz'];
		let requestAnimationFrame = window.requestAnimationFrame;
		let cancelAnimationFrame = window.cancelAnimationFrame;
		let i = vendors.length;

		while (--i >= 0 && !requestAnimationFrame) {
			requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
		}

		if (!requestAnimationFrame || !cancelAnimationFrame) {
			requestAnimationFrame = (callback) => {
				var now = +new Date(),
					nextTime = Math.max(lastTime + 16, now);
				return setTimeout(function() {
					callback(lastTime = nextTime);
				}, nextTime - now);
			};

			cancelAnimationFrame = clearTimeout;
		}

		_me._requestAnimationFrame = requestAnimationFrame;
		_me._cancelAnimationFrame = cancelAnimationFrame;
		_me._isInit = true;
	}

	static _raf() {
		let _me = this;
		let callback = () => {
			let list = _me._list;
			for (let i = 0, len = list.length; i < len; i++) {
				let item = list[i];
				if (item.tick) {
					item.tick();
				}
			}
			_me._raf();
		}

		_me._timer = _me._requestAnimationFrame.call(window, callback);
	}

	static _craf() {
		let _me = this;
		_me._cancelAnimationFrame.call(window, _me._timer);
	}
}

Timer._list = [];
Timer._isInit = false;
Timer._timer = null;
Timer._requestAnimationFrame = null;
Timer._cancelAnimationFrame = null;
Timer.isStoped = false;

Moco.Timer = Timer;
class Vec3 {
	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	distance() {
		let {
			x, y, z
		} = this;
		return Math.sqrt(x * x + y * y + z * z);
	}

	multi(k) {
		if (k instanceof Vec3) {
			let {
				x, y, z
			} = k;

			return this.x * x + this.y * y + this.z * z;
		} else {
			let x = y = z = k;

			this.x *= x;
			this.y *= y;
			this.z *= z;
		}

		return this;
	}

	divi(k) {
		if (k instanceof Vec3) {
			var {
				x, y, z
			} = k;

			return this.x / x + this.y / y + this.z / z;
		} else {
			let x = y = z = k;

			this.x /= x;
			this.y /= y;
			this.z /= z;
		}

		return this;
	}

	add(vec3) {
		this.x += vec3.x;
		this.y += vec3.y;
		this.z += vec3.z;
		return this;
	}

	sub(vec3) {
		let clone = Vec3.clone(vec3);
		clone.multi(-1);
		this.add(clone);
		return this;
	}

	multiMatrix3(m) {
		let matrix = m.getMatrix();
		let {
			x, y, z
		} = this;
		this.x = x * matrix[0] + y * matrix[3] + z * matrix[6];
		this.y = x * matrix[1] + y * matrix[4] + z * matrix[7];
		this.z = x * matrix[2] + y * matrix[5] + z * matrix[8];
		return this;
	}

	static zero() {
		return new Vec3(0, 0, 0);
	}

	static clone(vec3) {
		return new Vec3(vec3.x, vec3.y, vec3.z);
	}

	static angle(v1, v2) {
		let c1 = Vec3.clone(v1);
		let c2 = Vec3.clone(v2);
		let rad = c1.multi(c2) / (v1.distance() * v2.distance());
		return Math.acos(rad);
	}

	static equal(v1, v2) {
		return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
	}

	static crossProduct(v1, v2) {
		return new Vec3(
			v1.y * v2.z - v1.z * v2.y,
			v1.z * v2.x - v1.x * v2.z,
			v1.x * v2.y - v1.y * v2.x
		);
	}

	static proj(v1, v2) {
		let v = Vec3.clone(v2);
		let distance = v.distance();
		let vii = v.multi(Vec3.zero().add(v1).multi(v) / (distance * distance));
		return v1.sub(vii);
	}

	static norm(vec3) {
		let clone = Vec3.clone(vec3);
		let distance = clone.distance();
		if (distance) {
			return clone.multi(1 / distance);
		} else {
			throw new Exception("zero vec3 can't be norm");
		}
	}
}

Moco.Vec3 = Vec3;
class Matrix3 {
	constructor(m) {
		this._matrix = m || [
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0
		];
	}

	setMatrix(matrix) {
		this._matrix = matrix;
		return this;
	}

	getMatrix() {
		return this._matrix;
	}

	add(matrix3) {
		let matrix = matrix3._matrix;

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

	sub(matrix3) {
		let matrix = matrix3._matrix;

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

	multi(matrix3) {
		let matrix = matrix3._matrix;

		let b00 = matrix[0];
		let b10 = matrix[1];
		let b20 = matrix[2];

		let b01 = matrix[3];
		let b11 = matrix[4];
		let b21 = matrix[5];

		let b02 = matrix[6];
		let b12 = matrix[7];
		let b22 = matrix[8];

		matrix = this._matrix;

		let a00 = matrix[0];
		let a10 = matrix[1];
		let a20 = matrix[2];

		let a01 = matrix[3];
		let a11 = matrix[4];
		let a21 = matrix[5];

		let a02 = matrix[6];
		let a12 = matrix[7];
		let a22 = matrix[8];

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

	translate(x, y) {
		this._matrix[6] = x;
		this._matrix[7] = y;

		return this;
	}

	rotate(angle) {
		let cosa = Math.cos(angle * Math.PI / 180);
		let sina = Math.sin(angle * Math.PI / 180);
		this._matrix[0] = cosa;
		this._matrix[1] = sina;
		this._matrix[3] = -sina;
		this._matrix[4] = cosa;

		return this;
	}

	scale(scaleX, scaleY) {
		this._matrix[0] = scaleX;
		this._matrix[4] = scaleY;

		return this;
	}

	static clone(m) {
		let matrix = m.getMatrix();
		let tmp = [];

		for (let i = 0, len = matrix.length; i < len; i++) {
			tmp[i] = matrix[i];
		}

		return new Matrix3(tmp);
	}

	static copy(m) {
		let clone = Matrix3.clone(m2);
		m1.setMatrix(clone.getMatrix());
	}

	static zero() {
		return new Matrix3([
			0, 0, 0,
			0, 0, 0,
			0, 0, 0
		]);
	}

	static identity() {
		return new Matrix3([
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]);
	}

	static translation(x, y) {
		return new Matrix3([
			1, 0, 0,
			0, 1, 0,
			x, y, 1
		]);
	}

	static rotation(angle) {
		let cosa = Math.cos(angle * Math.PI / 180);
		let sina = Math.sin(angle * Math.PI / 180);
		return new Matrix3([
			cosa, sina, 0, -sina, cosa, 0,
			0, 0, 1
		]);
	}

	static scaling(scaleX, scaleY) {
		return new Matrix3([
			scaleX, 0, 0,
			0, scaleY, 0,
			0, 0, 1
		]);
	}

	static transpose(m) {
		let matrix = m.getMatrix();
		let tmp = null;

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

	static inverse(m) {
		let matrix = m.getMatrix();

		let a00 = matrix[0];
		let a01 = matrix[1];
		let a02 = matrix[2];

		let a10 = matrix[3];
		let a11 = matrix[4];
		let a12 = matrix[5];

		let a20 = matrix[6];
		let a21 = matrix[7];
		let a22 = matrix[8];

		let deter = a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 - a02 * a11 * a20 - a01 * a10 * a22 - a00 * a12 * a21;

		let c00 = (a11 * a22 - a21 * a12) / deter;
		let c01 = -(a10 * a22 - a20 * a12) / deter;
		let c02 = (a10 * a21 - a20 * a11) / deter;

		let c10 = -(a01 * a22 - a21 * a02) / deter;
		let c11 = (a00 * a22 - a20 * a02) / deter;
		let c12 = -(a00 * a21 - a20 * a01) / deter;

		let c20 = (a01 * a12 - a11 * a02) / deter;
		let c21 = -(a00 * a12 - a10 * a02) / deter;
		let c22 = (a00 * a11 - a10 * a01) / deter;

		matrix = new Matrix3([
			c00, c01, c02,
			c10, c11, c12,
			c20, c21, c22
		]);

		Matrix3.transpose(matrix);

		return matrix;
	}
}

Moco.Matrix3 = Matrix3;
class InteractiveEvent {
	static getList() {
		return Util.clone(this._list);
	}

	static add(eventName, item) {
		if (item instanceof EventDispatcher) {
			let list = this._list;
			list[eventName] = list[eventName] ? list[eventName] : [];

			let isNotExists = Util.inArray(item, list[eventName], (a1, a2) => {
				return a1.aIndex == a2.aIndex;
			}) == -1;

			if (isNotExists) {
				list[eventName].push(item);
			}
		}
	}

	static remove(eventName, item) {
		if (item instanceof EventDispatcher) {
			let list = this._list;
			if (list[eventName]) {
				let isExists = Util.inArray(item, list[eventName], (a1, a2) => {
					return a1.aIndex == a2.aIndex;
				}) != -1

				if (isExists) {
					list[eventName].splice(i, 1);
				}
			}
		}
	}
}

InteractiveEvent._list = {};

Moco.InteractiveEvent = InteractiveEvent;
class MouseEvent extends InteractiveEvent {
	static getTopItem(eventName, cord) {
		let _me = this;
		let items = _me._list[eventName] || [];

		items = Util.filter(items, function(item) {
			if (item.isMouseon && item.isMouseon(cord)) {
				return true;
			}
		});

		items = Array.prototype.sort.call(items, function(i, j) {
			let a1 = i.objectIndex.split(".");
			let a2 = j.objectIndex.split(".");
			let len = Math.max(a1.length, a2.length);

			for (let i = 0; i < len; i++) {
				if (!a2[i] || !a1[i]) {
					return a2[i] ? 1 : -1;
				} else if (a2[i] != a1[i]) {
					return a2[i] - a1[i];
				}
			}
		});

		return items[0];
	}
}

let mouseEvents = {
	CLICK: "click",
	MOUSEDOWN: "mousedown",
	MOUSEUP: "mouseup",
	MOUSEMOVE: "mousemove"
};

for (let key in mouseEvents) {
	MouseEvent[key] = mouseEvents[key];
}

MouseEvent.nameList = Util.keys(mouseEvents);

Moco.MouseEvent = MouseEvent;
class KeyboardEvent extends InteractiveEvent {
	static getItems(eventName) {
		let _me = this;
		return _me._list[eventName] || [];
	}
}

let keyboardEvents = {
	KEYDOWN: "keydown",
	KEYUP: "keyup",
	KEYPRESS: "keypress"
};

for (let key in keyboardEvents) {
	KeyboardEvent[key] = keyboardEvents[key];
}

KeyboardEvent.nameList = Util.keys(keyboardEvents);

Moco.KeyboardEvent = KeyboardEvent;
class EventDispatcher {
	on(target, eventName, callback, useCapture) {
		let _me = this;
		
		if (typeof target == "string") {
			[target, eventName, callback, useCapture] = [_me, target, eventName, callback];
		}

		if (eventName && callback) {
			useCapture = useCapture ? useCapture : false;

			if (Util.isType(eventName, "Array")) {
				Util.each(eventName, (item) => {
					_me.on(item, callback, useCapture);
				});
			} else {
				let handlers = target.handlers;
				let fn = (event) => {
					let callbacks = handlers[eventName];
					let ev = _me._fixEvent(event);

					for (let i = 0, len = callbacks.length; i < len; i++) {
						let item = callbacks[i];
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
			}
		}

		return _me;
	}

	off(target, eventName, callback) {
		let _me = this;

		if (typeof target == "string") {
			[target, eventName, callback] = [_me, target, eventName];
		}

		if (eventName || callback) {
			if (Util.isType(eventName, "Array")) {
				Util.each(eventName, function(item) {
					_me.off(target, item, callback);
				});
			} else if (!callback) {
				let handlers = target.handlers;

				if (handlers) {
					let callbacks = handlers[eventName] ? handlers[eventName] : [];
					Util.each(callbacks, function(item) {
						_me.off(target, eventName, item);
					});
				}
			} else {
				let handlers = target.handlers;

				if (handlers) {
					let fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(fnRegExp, '');
					let callbacks = handlers[eventName] ? handlers[eventName] : [];

					for (let i = callbacks.length - 1; i >= 0; i--) {
						let item = callbacks[i];
						if (item._fnStr == fnStr) {
							Array.prototype.splice.call(callbacks, i, 1);
						}
					}
				}
			}
		}

		return _me;
	}

	once(target, eventName, callback, useCapture) {
		var _me = this;

		if (typeof target == "string") {
			[target, eventName, callback, useCapture] = [_me, target, eventName, callback];
		}

		let fn = function(event) {
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

	trigger(target, eventName, event) {
		let _me = this;

		if (!target && !eventName) {
			return;
		} else if (typeof target == "string") {
			[target, eventName, event] = [_me, target, eventName];
		}

		let handlers = target && target.handlers;

		if (!handlers) {
			return _me;
		}

		let callbacks = handlers[eventName] ? handlers[eventName] : [];

		//自定义事件trigger的时候需要修正target和currentTarget
		let ev = event || {};
		if (ev.target == null) {
			ev.target = ev.currentTarget = target;
		}

		ev = _me._fixEvent(ev);

		// 此处分开冒泡阶段函数和捕获阶段函数
		let parent = target.parent || target.parentNode;
		let handlerList = {
			propagations: [],
			useCaptures: []
		};

		while (parent) {
			let handlers = null;
			if (handlers = parent.handlers) {
				let callbacks = handlers[eventName] ? handlers[eventName] : [];
				for (let i = 0, len = callbacks.length; i < len; i++) {
					let useCapture = callbacks[i]._useCapture;
					if (!useCapture) {
						handlerList.propagations.push({
							target: parent,
							callback: callbacks[i]
						});
					} else {
						let tmp = {
							target: parent,
							callback: callbacks[i]
						};

						!i ? handlerList.useCaptures.unshift(tmp) : handlerList.useCaptures.splice(1, 0, tmp);
					}
				}
			}
			parent = parent.parent || parent.parentNode;
		}

		// 捕获阶段的模拟
		let useCaptures = handlerList.useCaptures;
		let prevTarget = null;
		ev.eventPhase = 0;
		for (let i = 0, len = useCaptures.length; i < len; i++) {
			let handler = useCaptures[i];
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

		let isUseCapturePhaseStopped = false;
		if (useCaptures.length) {
			isUseCapturePhaseStopped = ev.isImmediatePropagationStopped() || ev.isPropagationStopped();
		}

		// 目标阶段
		ev.eventPhase = 1;
		for (let i = 0, len = callbacks.length; i < len; i++) {
			let item = callbacks[i];
			if (isUseCapturePhaseStopped) {
				break;
			} else {
				item.call(_me, ev);
			}
		}

		// 冒泡的模拟
		let propagations = handlerList.propagations;
		prevTarget = null;
		ev.eventPhase = 2;
		for (let i = 0, len = propagations.length; i < len; i++) {
			let handler = propagations[i];
			target = handler.target;
			ev.target = target;
			if (isUseCapturePhaseStopped) {
				if (ev.isImmediatePropagationStopped() || ev.isPropagationStopped()) {
					break;
				} else {
					handler.callback.call(_me, ev);
					prevTarget = target;
				}
			} else {
				if (ev.isImmediatePropagationStopped()) {
					break;
				} else if (ev.isPropagationStopped()) {
					if (prevTarget == target) {
						handler.callback.call(_me, ev);
					} else {
						break;
					}
				} else {
					handler.callback.call(_me, ev);
					prevTarget = target;
				}
			}
		}
	}

	_fixEvent(event) {
		let _me = this;
		let returnTrue = () => {
			return true
		};
		let returnFalse = () => {
			return false
		};

		if (!event || !event.isPropagationStopped) {
			event = event ? event : {};

			let preventDefault = event.preventDefault;
			let stopPropagation = event.stopPropagation;
			let stopImmediatePropagation = event.stopImmediatePropagation;


			if (!event.target) {
				event.target = event.srcElement || document;
			}

			if (!event.currentTarget) {
				event.currentTarget = _me;
			}

			event.relatedTarget = event.fromElement === event.target ?
				event.toElement :
				event.fromElement;

			event.preventDefault = () => {
				if (preventDefault) {
					preventDefault.call(event);
				}
				event.returnValue = false;
				event.isDefaultPrevented = returnTrue;
				event.defaultPrevented = true;
			};

			event.isDefaultPrevented = returnFalse;
			event.defaultPrevented = false;

			event.stopPropagation = () => {
				if (stopPropagation) {
					stopPropagation.call(event);
				}
				event.cancelBubble = true;
				event.isPropagationStopped = returnTrue;
			};

			event.isPropagationStopped = returnFalse;

			event.stopImmediatePropagation = () => {
				if (stopImmediatePropagation) {
					stopImmediatePropagation.call(event);
				}
				event.isImmediatePropagationStopped = returnTrue;
				event.stopPropagation();
			};

			event.isImmediatePropagationStopped = returnFalse;

			if (event.clientX != null) {
				let doc = document.documentElement,
					body = document.body;

				event.pageX = event.clientX +
					(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
					(doc && doc.clientLeft || body && body.clientLeft || 0);

				event.pageY = event.clientY +
					(doc && doc.scrollTop || body && body.scrollTop || 0) -
					(doc && doc.clientTop || body && body.clientTop || 0);
			}

			event.which = event.charCode || event.keyCode;
		}

		return event;
	}
}

Moco.EventDispatcher = EventDispatcher;
class DisplayObject extends EventDispatcher {
	constructor() {
		super();
		this.name = "DisplayObject";
		this.alpha = 1;
		this._height = 0;
		this._width = 0;
		this.mask = null;
		this.rotate = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.parent = null;
		this.globalCompositeOperation = "";
		this.x = 0;
		this.y = 0;
		this.parent = null;
		this.visible = true;
		this.aIndex = this.objectIndex = "" + (guid++);
		this._isSaved = false;
		this._matrix = Matrix3.identity();

		this._observeOffsetProperty();
		this._observeTransformProperty();
	}

	show(matrix) {
		let _me = this;
		let ctx = _me.ctx || _me.stage.ctx;

		_me._matrix = Matrix3.identity();

		if (!_me.visible || _me.alpha <= 0.001) {
			return false;
		}

		if (
			(_me.mask != null && _me.mask.show) ||
			_me.alpha < 1 ||
			_me.rotate != 0 ||
			_me.scaleX != 1 ||
			_me.scaleY != 1 ||
			_me.x != 0 ||
			_me.y != 0 ||
			_me.globalCompositeOperation != ""
		) {
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
			let x = _me.x;
			let y = _me.y;
			_me._matrix.translate(x, y);
			ctx.translate(x, y);
		}

		if (_me.rotate != 0) {
			let angle = _me.rotate;
			_me._matrix.rotate(angle);
			ctx.rotate(Util.deg2rad(angle));
		}

		if (_me.scaleX != 1 || _me.scaleY != 1) {
			let scaleX = _me.scaleX;
			let scaleY = _me.scaleY;
			_me._matrix.scale(scaleX, scaleY);
			ctx.scale(scaleX, scaleY);
		}

		_me._matrix.multi(matrix);

		return true;
	}

	dispose() {
		let _me = this;
		let eventNames = Util.keys(_me._handlers);
		_me.off(eventNames);
	}

	_getWidth() {
		return this._width;
	}

	_getHeight() {
		return this._height;
	}

	_observeOffsetProperty() {
		let _me = this;
		let properties = [{
			key: 'width',
			method: "_getWidth"
		}, {
			key: 'height',
			method: "_getHeight"
		}];

		for (let i = 0, len = properties.length; i < len; i++) {
			let prop = properties[i];
			Object.defineProperty(_me, prop.key, {
				get: () => {
					return _me[prop.method].call(_me);
				}
			});
		}
	}

	_observeTransformProperty() {
		let _me = this;
		let properties = [{
			key: 'x',
			method: 'translate',
			args: (value) => {
				return [value, _me.y]
			}
		}, {
			key: 'y',
			method: 'translate',
			args: (value) => {
				return [_me.x, value]
			}
		}, {
			key: 'rotate',
			method: 'rotate',
			args: (value) => {
				return [value];
			}
		}, {
			key: 'scaleX',
			method: 'scale',
			args: (value) => {
				return [value, _me.scaleY]
			}
		}, {
			key: 'scaleY',
			method: 'scale',
			args: (value) => {
				return [_me.scaleX, value]
			}
		}];

		for (let i = 0, len = properties.length; i < len; i++) {
			let prop = properties[i];
			let val = _me[prop.key];
			Object.defineProperty(_me, prop.key, {
				set: (newValue) => {
					val = newValue;
					_me._matrix[prop.method].apply(_me._matrix, prop.args(newValue));
				},
				get: () => {
					return val;
				}
			})
		}
	}
}

Moco.DisplayObject = DisplayObject;
class InteractiveObject extends DisplayObject {
	constructor() {
		super();
		this.name = "InteractiveObject";
	}

	on(eventName, callback, useCapture) {
		let _me = this;
		let eventNameUpperCase = eventName.toUpperCase();
		let isMouseEvent = Util.inArray(eventNameUpperCase, MouseEvent.nameList) != -1;
		let isKeyboardEvent = Util.inArray(eventNameUpperCase, KeyboardEvent.nameList) != -1;

		if (!isMouseEvent && !isKeyboardEvent) {
			return;
		} else if (isMouseEvent) {
			MouseEvent.add(eventName, _me);
		} else if (isKeyboardEvent) {
			KeyboardEvent.add(eventName, _me);
		}

		super.on(eventName, callback, useCapture);
	}

	off(eventName, callback) {
		let _me = this;
		let eventNameUpperCase = eventName.toUpperCase();
		let isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) != -1;
		let isKeyboardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) != -1;

		if (!isMouseEvent && !isKeyboardEvent) {
			return;
		} else if (isMouseEvent) {
			MouseEvent.remove(eventName, _me);
		} else if (isKeyboardEvent) {
			KeyBoardEvent.remove(eventName, _me);
		}

		super.off(eventName, callback);
	}
}

Moco.InteractiveObject = InteractiveObject;
class DisplayObjectContainer extends InteractiveObject {
	constructor() {
		super();
		this.name = "DisplayObjectContainer";
		this._childList = [];
	}

	addChild(child) {
		let _me = this;
		if (child instanceof DisplayObject) {
			let isNotExists = Util.inArray(child, _me._childList, (child, item) => {
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

	removeChild(child) {
		let _me = this;
		if (child instanceof DisplayObject) {
			for (let i = _me._childList.length - 1; i >= 0; i--) {
				let item = _me._childList[i];
				if (item.aIndex == child.aIndex) {
					item.parent = null;
					item.stage = null;
					Array.prototype.splice.call(_me._childList, i, 1);
					break;
				}
			}
		}
	}

	getAllChild() {
		let _me = this;
		return Util.clone(_me._childList);
	}

	getChildAt(index) {
		let _me = this;
		let len = _me._childList.length;

		if (Math.abs(index) > len) {
			return;
		} else if (index < 0) {
			index = len + index;
		}

		return _me._childList[index];
	}

	contains(child) {
		let _me = this;
		if (child instanceof DisplayObject) {
			return Util.inArray(child, _me._childList, function(child, item) {
				return child.aIndex == item.aIndex;
			}) != -1;
		}
	}

	show(matrix) {
		let _me = this;

		if (matrix == null) {
			matrix = Matrix3.clone(_me._matrix);
		}

		let isDrew = super.show(matrix);

		if (isDrew) {
			if (_me instanceof Sprite) {
				if (_me.graphics && _me.graphics.show) {
					_me.graphics.show(_me._matrix);
				}
			}

			for (let i = 0, len = _me._childList.length; i < len; i++) {
				let item = _me._childList[i];
				if (item.show) {
					item.show(_me._matrix);
				}
			}

			if (_me._isSaved) {
				let ctx = _me.ctx || _me.stage.ctx;
				_me._isSaved = false;
				ctx.restore();
			}
		}

		return isDrew;
	}

	_getWidth() {
		let _me = this;
		let ex = 0;
		let childList = _me._childList;

		for (let i = 0, len = childList.length; i < len; i++) {
			let item = childList[i];
			let itemEx = item.width + item.x;
			ex = itemEx < ex ? ex : itemEx;
		}

		return ex;
	}

	_getHeight() {
		let _me = this;
		let ey = 0;
		let childList = _me._childList;

		for (let i = 0, len = childList.length; i < len; i++) {
			let item = childList[i];
			let itemEy = item.height + item.y;
			ey = itemEy < ey ? ey : itemEy;
		}

		return ey;
	}
}

Moco.DisplayObjectContainer = DisplayObjectContainer;
class Stage extends DisplayObjectContainer {
	constructor(canvasId, fn) {
		super();

		this.name = "Stage";
		this.domElem = document.getElementById(canvasId);
		this._width = parseFloat(this.domElem.getAttribute("width"), 10);
		this._height = parseFloat(this.domElem.getAttribute("height"), 10);
		this.ctx = this.domElem.getContext("2d");

		let offset = this._getOffset();
		this.x = offset.left;
		this.y = offset.top;

		if (typeof fn == "function") {
			fn(this);
		}

		this.initialize();
	}

	initialize() {
		let _me = this;

		// Stage接管所有交互事件
		Util.each(MouseEvent.nameList, (eventName) => {
			eventName = MouseEvent[eventName];
			EventDispatcher.prototype.on.call(_me, _me.domElem, eventName, (event) => {
				_me._mouseEvent(event);
			}, false);
		});

		Util.each(KeyboardEvent.nameList, (eventName) => {
			eventName = KeyboardEvent[eventName];
			EventDispatcher.prototype.on.call(_me, document, eventName, (event) => {
				_me._keyboardEvent(event);
			});
		}, false);

		Timer.add(_me);
		Timer.start();
	}

	show() {
		let _me = this;
		_me.ctx.clearRect(0, 0, _me._width, _me._height);
		super.show();
	}

	tick() {
		let _me = this;
		_me.show();
	}

	addChild(child) {
		let _me = this;
		let addStage = (child) => {
			child.stage = _me;

			if (child instanceof Sprite && child.graphics) {
				child.graphics.stage = _me;
				child.graphics.parent = child;
				child.graphics.objectIndex = child.objectIndex + ".0";
			}
		};

		addStage(child);

		if (child.getAllChild) {
			let childs = child.getAllChild();
			Util.each(childs, (item) => {
				addStage(item);
			});
		}

		super.addChild(child);
	}

	isMouseon(cord) {
		return true;
	}

	_getWidth() {
		return this._width;
	}

	_getHeight() {
		return this._height;
	}

	_mouseEvent(event) {
		let _me = this;
		let cord = {
			x: 0,
			y: 0
		};

		if (event.clientX != null) {
			cord.x = event.pageX - _me.x;
			cord.y = event.pageY - _me.y;
		}

		event.cord = cord;

		let eventName = event.type;
		let item = MouseEvent.getTopItem(eventName, cord);
		if (item) {
			item.trigger(eventName, event);
		}
	}

	_keyboardEvent(event) {
		let eventName = event.type;
		let items = KeyboardEvent.getItems(eventName);

		if (items.length) {
			Util.each(items, (item) => {
				item.trigger(eventName, event);
			});
		}
	}

	_getOffset() {
		return {
			top: 0,
			left: 0
		}
	}

}

Moco.Stage = Stage;
class Sprite extends DisplayObjectContainer {
	constructor() {
		super();
		this.name = "Sprite";
		this.graphics = null;
	}

	addChild(child) {
		if (child instanceof Shape) {
			console.error("shape object should be linked to Sprite's graphics property");
		} else {
			super.addChild(child);
		}
	}

	removeChild(child) {
		if (child instanceof Shape) {
			console.error("shape object should be linked to Sprite's graphics property");
		} else {
			super.removeChild(child);
		}
	}

	show(matrix) {
		let _me = this;
		let isDrew = super.show(matrix);

		if (isDrew) {
			if (_me._isSaved) {
				let ctx = _me.ctx || _me.stage.ctx;
				_me._isSaved = false;
				ctx.restore();
			}
		}

		return isDrew;
	}

	isMouseon(cord) {
		return true;
	}

	_getWidth() {
		let _me = this;
		let shape = _me.graphics;
		let width = super._getWidth();

		if (shape) {
			let shapeWidth = shape.x + shape.width;
			width = shapeWidth < width ? width : shapeWidth;
		}

		return width;
	}

	_getHeight() {
		let _me = this;
		let shape = _me.graphics;
		let height = super._getHeight();

		if (shape) {
			let shapeHeight = shape.x + shape.height;
			height = shapeHeight < height ? height : shapeHeight;
		}

		return height;
	}
}

Moco.Sprite = Sprite;
class Shape extends DisplayObject {
	constructor() {
		super();
		this.name = "Shape";
		this._showList = [];
		this._setList = [];
	}

	on() { 
		console.error("shape object can't interative event, please add shape to sprite");
	}

	off() {
		console.error("shape object can't interative event, please add shape to sprite");
	}

	show(matrix) {
		let _me = this;
		let showList = _me._showList;
		let isDrew = super.show(matrix);

		if (isDrew) {
			for (let i = 0, len = showList.length; i < len; i++) {
				let showListItem = showList[i];
				if (typeof showListItem == "function") {
					showListItem();
				}
			}

			if (_me._isSaved) {
				let ctx = _me.ctx || _me.stage.ctx;
				_me._isSaved = false;
				ctx.restore();
			}
		}

		return isDrew;
	}

	lineWidth(thickness) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.lineWidth = thickness;
		});
	}

	strokeStyle(color) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.strokeStyle = color;
		});
	}

	stroke() {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.stroke();
		});
	}

	beginPath() {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.beginPath();
		});
	}

	closePath() {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.closePath();
		});
	}

	moveTo(x, y) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.moveTo(x, y);
		});
	}

	lineTo(x, y) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.lineTo(x, y);
		});
	}

	clear() {
		let _me = this;
		_me._showList = [];
		_me._setList = [];
	}

	rect(x, y, width, height) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			_me.stage.ctx.rect(x, y, width, height);
		});

		_me._setList.push({
			type: "rect",
			area: [x, y, width, height]
		});
	}

	fillStyle(color) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.fillStyle = color;
		});
	}

	fill() {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.fill();
		});
	}

	arc(x, y, r, sAngle, eAngle, direct) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.arc(x, y, r, sAngle, eAngle, direct);
		});

		_me._setList.push({
			type: "arc",
			area: [x, y, r, sAngle, eAngle, direct]
		});
	}

	drawArc(thickness, lineColor, arcArgs, isFill, color) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
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

	drawRect(thickness, lineColor, rectArgs, isFill, color) {
		let _me = this;
		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
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

	drawVertices(thickness, lineColor, vertices, isFill, color) {
		let _me = this;
		let len = vertices.length;

		if (len < 3) {
			return;
		}

		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.beginPath();
			ctx.moveTo(vertices[0][0], vertices[0][1]);

			for (i = 1; i < len; i++) {
				let pointArr = vertices[i];
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

	drawLine(thickness, lineColor, points) {
		let _me = this;

		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.beginPath();
			ctx.moveTo(points[0], points[1]);
			ctx.lineTo(points[2], points[3]);
			ctx.lineWidth = thickness;
			ctx.strokeStyle = lineColor;
			ctx.closePath();
			ctx.stroke();
		});
	}

	lineStyle(thickness, color, alpha) {
		let _me = this;

		if (alpha) {
			_me.alpha = alpha;
		}

		_me._showList.push(function() {
			let ctx = _me.ctx || _me.stage.ctx;
			ctx.lineWidth = thickness;
			ctx.strokeStyle = color;
		});
	}

	add(fn) {
		let _me = this;
		_me._showList.push(function() {
			fn.call(_me);
		});
	}

	isMouseon(cord) {
		return false;
	}

	_getWidth() {
		return this._width;
	}

	_getHeight() {
		return this._height;
	}
}

Moco.Shape = Shape;

window.Moco = Moco;
}(window, undefined));