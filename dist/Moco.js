"use strict";

var Util = {
	isType: function isType(target, type) {
		return Object.prototype.toString.call(target) == "[object " + type + "]";
	},
	each: function each(arr, callback) {
		if (arr && arrProto.forEach) {
			arrProto.forEach.call(arr, callback);
		} else if (undefined.isType("Array", arr)) {
			for (var i = 0, len = arr.length; i < len; i++) {
				callback(arr[i], i, arr);
			}
		}
	}
};

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventDispatcher = function () {
	function EventDispatcher() {
		_classCallCheck(this, EventDispatcher);

		this.fnRegExp = /\s+/g;
		this.guid = 0;
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
						target._useCapture = target._useCapture | useCapture;

						var handlers = target._handlers;
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

						fn._fnStr = callback._fntStr ? callback._fnStr : callback.toString().replace(_me.fnRegExp, '');
						fn._callback = callback;
						fn._useCapture = useCapture;
						fn._guid = _me.guid++;

						if (!handlers) {
							handlers = target._handlers = {};
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
					var handlers = target._handlers;

					if (handlers) {
						var _callbacks = handlers[eventName] ? handlers[eventName] : [];
						Util.each(_callbacks, function (item) {
							_me.off(target, eventName, item);
						});
					}
				} else {
					var _handlers = target._handlers;

					if (_handlers) {
						var fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(_me.fnRegExp, '');
						var _callbacks2 = _handlers[eventName] ? _handlers[eventName] : [];

						for (var i = _callbacks2.length - 1; i >= 0; i--) {
							var item = _callbacks2[i];
							if (item._fnStr == fnStr) {
								Array.prototype.splice.call(_callbacks2, i, 1);
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
				_me.off(target, eventName, fn);
			};

			fn._fnStr = callback.toString().replace(_me.fnRegExp, '');

			return _me.on(target, eventName, fn, useCapture);
		}
	}, {
		key: "trigger",
		value: function trigger(target, eventName, event, isPropagation, isCapture) {
			var _me = this;

			if (!target && !eventName) {
				return;
			} else if (typeof target == "string") {
				var _ref4 = [_me, target, eventName, event, isDeep];
				target = _ref4[0];
				eventName = _ref4[1];
				event = _ref4[2];
				isDeep = _ref4[3];
				isCapture = _ref4[4];
			}

			var handlers = target && target._handlers;

			if (!handlers) {
				return _me;
			}

			var callbacks = handlers[eventName] ? handlers[eventName] : [];

			//自定义事件trigger的时候需要修正target和currentTarget
			var ev = event || {};
			if (ev.target == null) {
				ev.target = ev.currentTarget = target;
			}

			if (ev.target._captureList == null) {
				ev.target._captureList = [];
			}

			ev = _me._fixEvent(ev);

			for (var i = 0, len = callbacks.length; i < len; i++) {
				var item = callbacks[i];
				if (ev.isImmediatePropagationStopped()) {
					break;
				} else {
					item.call(_me, ev);
					!isCapture && ev.target._captureList.push(target);
				}
			}

			// 冒泡的模拟
			if (isPropagation) {
				var parent = target.parentNode;
				if (parent) {
					_me.trigger(parent, eventName, ev, true, false);
				}
			}

			// 捕获阶段的模拟
			if (isCapture && target == ev.target) {
				var captureList = ev.target._captureList;
				for (var _i = captureList.length - 1; _i >= 0; _i--) {
					var _target = captureList[_i];
					if (_target._useCapture) {
						_me.trigger(_target, eventName, ev, false, true);
					}
				}
			}

			return _me;
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
