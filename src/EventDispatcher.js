/**
 * 事件部分
 * @type {RegExp}
 */

var fnRegExp = /\s+/g,
    guid = 0;


function EventDispatcher() {
};

/**
 * 事件注册
 * @param eventName
 * @param callback
 * @param useCapture
 */
EventDispatcher.prototype.on = function (target, eventName, callback, useCapture) {
    var self = this,
        handlers, fn;

    if (typeof target == "string") {
        useCapture = callback;
        callback = eventName;
        eventName = target;
        target = self;
    }

    if (eventName && callback) {
        useCapture = useCapture ? useCapture : false;

        if (Util.isType(eventName, "Array")) {
            Util.each(eventName, function (item) {
                self.on(item, callback, useCapture);
            });
        } else {

            //用于捕获阶段触发的判断，如果注册过一个捕获函数，那么说明此对象是可以被捕获触发的
            target.useCapture = target.useCapture | useCapture;
            handlers = target.handlers;

            fn = function (event) {
                var callbacks = handlers[eventName],
                    item;

                event = self._fixEvent(event);

                for (var i = 0, len = callbacks.length; i < len; i++) {
                    item = callbacks[i];

                    if (event.isImmediatePropagationStopped()) {
                        break;
                    } else if (item.guid == fn.guid) {
                        item.callback.call(self, event);
                    }
                }
            };


            fn.fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(fnRegExp, '');
            fn.callback = callback;
            fn.useCapture = useCapture;
            fn.guid = guid++;

            if (!handlers) {
                handlers = target.handlers = {};
            }

            if (!handlers[eventName]) {
                handlers[eventName] = [];
            }

            handlers[eventName].push(fn);

            if (handlers[eventName].length == 1) {
                if (target.addEventListener) {
                    target.addEventListener(eventName, fn, useCapture);
                } else if (target.attachEvent) {
                    self.attachEvent(eventName, fn);
                }
            }
        }
    }

    return self;
};

/**
 * 事件解绑
 * @param eventName
 * @param callback
 */
EventDispatcher.prototype.off = function (target, eventName, callback) {
    var self = this,
        handlers, callbacks, fnStr, fnItem;

    if (typeof target == "string") {
        callback = eventName;
        eventName = target;
        target = self;
    }

    if (eventName || callback) {
        if (Util.isType(eventName, "Array")) {
            Util.each(eventName, function (item) {
                self.off(target, item, callback);
            });
        } else if (!callback) {
            handlers = target.handlers;

            if (handlers) {
                callbacks = handlers[eventName] ? handlers[eventName] : [];
                Util.each(callbacks, function (item) {
                    self.off(target, eventName, item);
                });
            }
        } else {
            handlers = target.handlers;

            if (handlers) {
                callbacks = handlers[eventName] ? handlers[eventName] : [];
                fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(fnRegExp, '');

                for (var i = callbacks.length - 1; i >= 0; i--) {
                    fnItem = callbacks[i];
                    if (fnItem.fnStr == fnStr) {
                        arrProto.splice.call(callbacks, i, 1);
                    }
                }

                if (!callbacks.length) {
                    delete handlers[eventName];
                }
            }
        }
    }

    return self;
};

/**
 * 一次事件注册
 * @param target
 * @param eventName
 * @param callback
 */
EventDispatcher.prototype.once = function (target, eventName, callback, useCapture) {
    var self = this,
        fn;

    if (typeof target == "string") {
        useCapture = callback;
        callback = eventName;
        eventName = target;
        target = self;
    }

    fn = function (event) {
        callback.call(self, event);
        self.off(target, eventName, fn);
    };

    fn.fnStr = callback.toString().replace(fnRegExp, '');

    return self.on(target, eventName, fn, useCapture);
};

/**
 * 事件触发
 * @param eventName
 */
EventDispatcher.prototype.trigger = function (target, eventName, event, isDeep, isCapture) {
    var self = this,
        handlers, callbacks, item, parent;

    if (!target && !eventName) {
        return;
    } else if (typeof target == "string") {
        isCapture = isDeep;
        isDeep = event;
        event = eventName;
        eventName = target;
        target = self;
    }

    handlers = target && target.handlers;
    event = event || {};

    if (!handlers) {
        return self;
    }

    callbacks = handlers[eventName] ? handlers[eventName] : [];

    //自定义事件trigger的时候需要修正target和currentTarget
    if (event.target == null) {
        event.target = event.currentTarget = target;
    }

    event = self._fixEvent(event);

    for (var i = 0, len = callbacks.length; i < len; i++) {
        item = callbacks[i];
        if (!isCapture && event.isImmediatePropagationStopped()) {
            break;
        } else { //捕获阶段的修正
            item.callback.call(self, event);
        }
    }

    //只有Dom节点才会有下面的冒泡执行
    if (isDeep) {
        parent = target.parentNode;
        while (parent) {
            self.trigger(parent, eventName, event, true);
            parent = parent.parentNode;
        }
    }

    return self;
};

/**
 * 统一event的部分方法和属性
 * @param event
 * @returns {*}
 */
EventDispatcher.prototype._fixEvent = function (event) {
    var self = this;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    if (!event || !event.isPropagationStopped) {

        event = event ? event : {};

        var preventDefault = event.preventDefault,
            stopPropagation = event.stopPropagation,
            stopImmediatePropagation = event.stopImmediatePropagation;

        if (!event.target) {
            event.target = event.srcElement || document;
        }

        if (!event.currentTarget) {
            event.currentTarget = self;
        }

        event.relatedTarget = event.fromElement === event.target ?
            event.toElement :
            event.fromElement;

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
            var doc = document.documentElement, body = document.body;

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
};