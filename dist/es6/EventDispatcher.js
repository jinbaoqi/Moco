

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

						fn._fnStr = callback._fntStr ? callback._fnStr : callback.toString().replace(fnRegExp, '');
						fn._callback = callback;
						fn._useCapture = useCapture;
						fn._guid = guid++;

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
						var fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(fnRegExp, '');
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
					if (_handlers2 = parent._handlers) {
						var _callbacks3 = _handlers2[eventName] ? _handlers2[eventName] : [];
						for (var i = 0, len = _callbacks3.length; i < len; i++) {
							var useCapture = _callbacks3[i]._useCapture;
							if (!useCapture) {
								handlerList.propagations.push({
									target: parent,
									callback: _callbacks3[i]
								});
							} else {
								handlerList.useCaptures.push({
									target: parent,
									callback: _callbacks3[i]
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
