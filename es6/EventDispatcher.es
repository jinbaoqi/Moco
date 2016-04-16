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
				target._useCapture = target._useCapture | useCapture;

				let handlers = target._handlers;
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
				let handlers = target._handlers;

				if (handlers) {
					let callbacks = handlers[eventName] ? handlers[eventName] : [];
					Util.each(callbacks, function(item) {
						_me.off(target, eventName, item);
					});
				}
			} else {
				let handlers = target._handlers;

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
			_me.off(target, eventName, fn);
		};

		fn._fnStr = callback.toString().replace(fnRegExp, '');

		return _me.on(target, eventName, fn, useCapture);
	}

	trigger(target, eventName, event, isPropagation, isCapture) {
		let _me = this;

		if (!target && !eventName) {
			return;
		} else if (typeof target == "string") {
			[target, eventName, event, isDeep, isCapture] = [_me, target, eventName, event, isDeep];
		}

		let handlers = target && target._handlers;

		if (!handlers) {
			return _me;
		}

		let callbacks = handlers[eventName] ? handlers[eventName] : [];

		//自定义事件trigger的时候需要修正target和currentTarget
		let ev = event || {};
		if (ev.target == null) {
			ev.target = ev.currentTarget = target;
		}

		if (ev.target._captureList == null) {
			ev.target._captureList = [];
		}

		ev = _me._fixEvent(ev);

		for (let i = 0, len = callbacks.length; i < len; i++) {
			let item = callbacks[i];
			if (ev.isImmediatePropagationStopped()) {
				break;
			} else {
				item.call(_me, ev);
				!isCapture && ev.target._captureList.push(target);
			}
		}

		// 冒泡的模拟
		if (isPropagation) {
			let parent = target.parentNode;
			if (parent) {
				_me.trigger(parent, eventName, ev, true, false);
			}
		}

		// 捕获阶段的模拟
		if (isCapture && target == ev.target) {
			let captureList = ev.target._captureList;
			for (let i = captureList.length - 1; i >= 0; i--) {
				let target = captureList[i];
				if (target._useCapture) {
					_me.trigger(target, eventName, ev, false, true);
				}
			}
		}

		return _me;
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
				var doc = document.documentElement,
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