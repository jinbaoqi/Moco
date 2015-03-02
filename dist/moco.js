/**
 * 工具类
 * @type {Object|Function|Array}
 */

var arrProto = Array.prototype,
    objProto = Object.prototype;

var Util = {
    isType: function (target, type) {
        return objProto.toString.call(target) == "[object " + type + "]";
    },
    each: function (arr, callback) {
        var self = this;

        if (arr && arrProto.forEach) {
            arrProto.forEach.call(arr, callback);
        } else if (self.isType("Array", arr)) {
            for (var i = 0, len = arr.length; i < len; i++) {
                callback(arr[i], i, arr);
            }
        }
    },
    filter: function (arr, callback) {
        var self = this,
            tmp = [];

        if (arr && arrProto.filter) {
            return arrProto.filter.call(arr, callback);
        } else {
            self.each(arr, function (item, index, arr) {
                if (callback.call(arr, item, index, arr) == true) {
                    tmp.push(item);
                }
            });
        }

        return tmp;
    },
    reverse: function (arr) {
        var self = this,
            tmp = [];

        arr = self.clone(arr);

        if (arrProto.reverse) {
            return arrProto.reverse.call(arr);
        } else {
            for (var i = arr.length - 1; i >= 0; i--) {
                tmp.push(arr[i]);
            }
        }

        return tmp;
    },
    inArray: function (item, arr, fn) {
        var self = this;

        if (arrProto.inArray) {
            return arrProto.inArray.call(arr, item);
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
    },
    extends: function (obj) {
        var self = this,
            source, prop;

        if (!self.isType(obj, "Object")) {
            return obj;
        }

        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }

        return obj;
    },
    keys: function (obj) {
        var self = this,
            tmp = [];

        if (Object.keys) {
            return Object.keys(obj);
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    tmp.push(key);
                }
            }
        }

        return tmp;
    },
    clone: function (obj) {
        var self = this;

        if (typeof obj != "object") return obj;
        return self.isType(obj, "Array") ? obj.slice() : self.extends({}, obj);
    }
};
var EventCore = {
    _list: [],
    add: function (obj) {
        if (obj instanceof EventDispatcher) {
            this._list.push(obj);
        }
    },
    remove: function (obj) {
        var i, len, item;

        if (obj instanceof  EventDispatcher) {
            for (i = 0, len = this._list.length; i < len; i++) {
                item = this._list[i];
                if (item.aIndex == obj.aIndex) {
                    this._list.splice(i, 1);
                    break;
                }
            }
        }
    },
    getObjs: function () {
        return this._list;
    },
    getObjsFromCord: function (cord) {
        var self = this,
            objs = [],
            tmp = [],
            k = 0,
            item;

        objs = Util.filter(self._list, function (item) {
            if (item.isMouseon(cord)) {
                return true;
            }
        });

        objs = arrProto.sort.call(objs, function (i, j) {
            var a1 = i.objectIndex.split("."),
                a2 = j.objectIndex.split("."),
                len = Math.max(a1.length, a2.length);

            for (var i = 0; i < len; i++) {
                if (!a2[i] || !a1[i]) {
                    return a2[i] ? 1 : -1;
                } else if (a2[i] != a1[i]) {
                    return a2[i] - a1[i];
                }
            }
        });

        if (objs.length) {
            k = objs[0].objectIndex;
            tmp.push(objs[0]);

            for (var i = 1, len = objs.length; i < len; i++) {
                item = objs[i];
                if (
                    k.indexOf(item.objectIndex) != -1 ||
                    k.indexOf(item.aIndex) != -1
                    ) {
                    tmp.push(item);
                }
            }
        }

        return tmp;
    }
};

var Event = {
    RENDER: "render",
    COMPLETE: "complete",
    ADD_TO_STAGE: "add_to_stage"
};

Util.extends(Event, EventCore);
var MouseEvent = {
    CLICK: "click",
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    MOUSE_MOVE: "mousemove"
};

MouseEvent.nameList = Util.keys(MouseEvent);

Util.extends(MouseEvent, EventCore);
var KeyBoardEvent = {
    KEY_DOWN: "keydown",
    KEY_UP: "keyup",
    KEY_PRESS: "keypress"
};

KeyBoardEvent.nameList = Util.keys(KeyBoardEvent);

Util.extends(KeyBoardEvent, EventCore);
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
/**
 * Base继承类
 */

var Base = {
    inherit: function (Child, Parent) {
        var F = function () {
            },
            old = Child.prototype;

        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;

        for (var key in old) {
            if (old.hasOwnProperty(key)) {
                Child.prototype[key] = old[key];
            }
        }
    }
};
/**
 * Display显示对象抽象类
 */

function DisplayObject() {
    EventDispatcher.call(this);

    this.name = "DisplayObject";
    this.alpha = 1;
    this.height = 0;
    this.width = 0;
    this.mask = null;
    this.rotate = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.center = null;
    this.parent = null;
    this.globalCompositeOperation = "";
    this.x = 0;
    this.y = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.visible = true;
    this.aIndex = this.objectIndex = "" + (guid++);
    this._saveFlag = false;
}

DisplayObject.prototype.show = function (cord) {
    var self = this,
        rotateFlag = Math.PI / 180,
        canvas = self.ctx || self.stage.ctx;

    if (!self.visible) {
        return;
    }

    cord.scaleX *= self.scaleX;
    cord.scaleY *= self.scaleY;
    cord.x += self.x / cord.scaleX;
    cord.y += self.y / cord.scaleY;

    if (
        (self.mask != null && self.mask.show) ||
            self.alpha < 1 ||
            self.rotate != 0 ||
            self.scaleX != 1 ||
            self.scaleY != 1 ||
            self.translateX != 0 ||
            self.translateY != 0 ||
            self.globalCompositeOperation != ""
        ) {
        self._saveFlag = true;
        canvas.save();
    }

    //TODO:mask在graphics下由于不resize(涉及到复杂图形面积)，因此不起作用，暂时没想到好的解决办法
    if (self.mask != null && self.mask.show) {
        self.mask.show();
        canvas.clip();
    }

    if (self.alpha < 1) {
        canvas.globalAlpha = self.alpha > 1 ? 1 : self.alpha;
    }

    if (self.globalCompositeOperation != "") {
        canvas.globalCompositeOperation = self.globalCompositeOperation;
    }

//    if (self.rotate != 0) {
//        canvas.translate(cord.x, cord.y);
//        canvas.rotate(self.rotate * rotateFlag);
//        canvas.translate(-cord.x, -cord.y);
//    }

    if (self.scaleX != 1 || self.scaleY != 1) {
        canvas.scale(self.scaleX, self.scaleY);
    }

    if (self.translateX != 0 || self.translateY != 0) {
        canvas.translate(self.translateX, self.translateY);
    }
};

DisplayObject.prototype.isMouseon = function (cord, pos) {
    var self = this;

    if (!self.visible || self.alpha < 0.01) {
        return false;
    }

    pos = self._getOffset();

    return pos;
};

DisplayObject.prototype.dispose = function () {
    var self = this,
        eventName = Util.keys(self.handlers),
        parent = self.parent;

    self.off(eventName);

    if (parent && parent.removeChild) {
        parent.removeChild(self);
    }
};

DisplayObject.prototype._getOffset = function () {
    var self = this,
        parents = [],
        parent = self,
        tmp = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        }, i;

    while (parent = parent.parent) {
        parents.push(parent);
    }

    for (i = parents.length - 1; i >= 0; i--) {
        parent = parents[i];

        tmp.scaleX *= parent.scaleX;
        tmp.scaleY *= parent.scaleY;

        tmp.x += (parent.x + parent.translateX) * tmp.scaleX;
        tmp.y += (parent.y + parent.translateY) * tmp.scaleY;
    }

    return tmp;
};

DisplayObject.prototype._getRotateCord = function (cord, pos, angle) {
    var ox = cord.x - pos.x,
        oy = cord.y - pos.y;

    angle = angle * Math.PI / 180;

    return {
        x: Math.cos(angle) * ox + Math.sin(angle) * oy + pos.x,
        y: Math.cos(angle) * oy - Math.sin(angle) * ox + pos.y
    }
};

Base.inherit(DisplayObject, EventDispatcher);

/**
 * InteractiveObject可交互类
 * @constructor
 */

var EventDispatcherProto = EventDispatcher.prototype;

function InteractiveObject() {
    DisplayObject.call(this);

    this._inMouseList = false;
    this._inKeyBordList = false;
}

InteractiveObject.prototype.on = function (eventName, callback, useCapture) {
    var self = this,
        isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) == -1,
        isKeyBoardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) == -1;

    if (
        (!isMouseEvent && !isKeyBoardEvent) ||
        (isMouseEvent && self._inMouseList) ||
        (isKeyBoardEvent && self._inKeyBordList)
        ) {
        return;
    } else if (isMouseEvent) {
        MouseEvent.add(self);
        self._inMouseList = true;
    } else if (isKeyBoardEvent) {
        KeyBoardEvent.add(self);
        self._inKeyBordList = true;
    }

    EventDispatcherProto.on.apply(EventDispatcherProto, [self, eventName, callback, useCapture]);
};

InteractiveObject.prototype.off = function (eventName, callback) {
    var self = this,
        isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) == -1,
        isKeyBoardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) == -1;

    if (!isMouseEvent && !isKeyBoardEvent) {
        return;
    }

    EventDispatcherProto.off.apply(EventDispatcherProto, [self, eventName, callback]);

    if (!Util.keys(self.handlers).length) {
        if (isMouseEvent) {
            MouseEvent.remove(self);
            self._inMouseList = true;
        } else if (isKeyBoardEvent) {
            KeyBoardEvent.remove(self);
            self._inKeyBordList = true;
        }
    }
}

Base.inherit(InteractiveObject, DisplayObject);
/**
 * DisplayContainer显示容器抽象类
 */

function DisplayObjectContainer() {
    DisplayObject.call(this);

    this.name = "DisplayObjectContainer";
    this._childList = [];
}

DisplayObjectContainer.prototype.addChild = function (obj) {
    var self = this;

    if (obj instanceof DisplayObject) {
        self._childList.push(obj);
        obj.parent = self;
        obj.objectIndex = self.objectIndex + "." + self._childList.length;
    }
};

DisplayObjectContainer.prototype.removeChild = function (obj) {
    var self = this,
        item;

    if (obj instanceof DisplayObject) {
        for (var i = self._childList.length - 1; i >= 0; i--) {
            item = self._childList[i];
            if (item.aIndex == obj.aIndex) {
                arrProto.splice.call(self._childList, i, 1);
            }
        }
    }
};

DisplayObjectContainer.prototype.getChildAt = function (index) {
    var self = this,
        len = self._childList.length;

    if (Math.abs(index) > len) {
        return;
    } else if (index < 0) {
        index = len + index;
    }

    return self._childList[index];
};

DisplayObjectContainer.prototype.contains = function (obj) {
    var self = this;

    if (obj instanceof DisplayObject) {
        return Util.inArray(self._childList, obj, function (obj, item) {
            return obj.aIndex == item.aIndex;
        }) == -1 ? false : true;
    }
};

DisplayObjectContainer.prototype.show = function (cord) {
    var self = this,
        item;

    if (cord == null) {
        cord = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    DisplayObject.prototype.show.call(self, cord);

    for (var i = 0, len = self._childList.length; i < len; i++) {
        item = self._childList[i];

        if (item.show) {
            item.show(cord);
        }
    }
};

Base.inherit(DisplayObjectContainer, InteractiveObject);
/**
 * requestAnimationFrame兼容写法
 * https://github.com/ngryman/raf.js
 */
var lastTime = 0,
    vendors = ['webkit', 'moz'],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame,
    i = vendors.length,
    raf, craf;

while (--i >= 0 && !requestAnimationFrame) {
    requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
}

if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback) {
        var now = +new Date(), nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
            callback(lastTime = nextTime);
        }, nextTime - now);
    };

    cancelAnimationFrame = clearTimeout;
}

raf = requestAnimationFrame;
craf = cancelAnimationFrame;
/**
 * Stage全局画布类
 */

function Stage(canvasId, fn) {
    DisplayObjectContainer.call(this);

    this.name = "Stage";
    this.domElem = document.getElementById(canvasId);
    this.ctx = this.domElem.getContext("2d");
    this.width = parseFloat(this.domElem.getAttribute("width"), 10);
    this.height = parseFloat(this.domElem.getAttribute("height"), 10);
    this.offset = this._getOffset(this.domElem);
    this.x = this.offset.left;
    this.y = this.offset.top;

    if (typeof fn == "function") {
        fn(this);
    }

    this.initialize();
}

Stage.prototype.on = function () {
    EventDispatcher.prototype.on.apply(this, arguments);
};

Stage.prototype.off = function () {
    EventDispatcher.prototype.off.apply(this, arguments);
}

Stage.prototype.initialize = function () {
    var self = this;

    //鼠标事件的注册
    Util.each(MouseEvent.nameList, function (eventName) {
        eventName = eventName.toLowerCase().replace("_", "");
        self.on(self.domElem, eventName, function (event) {
            var cord = {
                x: 0,
                y: 0
            };

            event = Util.clone(event);

            if (event.clientX != null) {
                cord.x = event.pageX - self.x;
                cord.y = event.pageY - self.y;
                self.mouseX = cord.x;
                self.mouseY = cord.y;
            }

            event.cord = cord;

            self.mouseEvent(cord, event);

            //Stage类本身只允许冒泡触发
            event.target = self;

            if (event.currentTarget == null) {
                event.currentTarget = self;
            }

            self.trigger(event.type, event);
        });
    });

    //键盘事件的注册
    Util.each(KeyBoardEvent.nameList, function (eventName) {
        eventName = eventName.toLowerCase().replace("_", "");
        self.on(document, eventName.toLowerCase(), function (event) {
            self.trigger(event.type, event);
            self.mouseEvent(null, event);
        });
    });

    self.show();
};

Stage.prototype.show = function () {
    var self = this;

    self.ctx.clearRect(0, 0, self.width, self.height);

    DisplayObjectContainer.prototype.show.call(self);

    if (self._saveFlag) {
        self.ctx.restore();
    }

    raf(function () {
        self.show();
    });
};

Stage.prototype.mouseEvent = function (cord, event) {
    var objs = [],
        reverseObjs = [],
        i, len, item;

    function returnFalse() {
        return false
    };

    if (cord != null) {
        objs = MouseEvent.getObjsFromCord(cord);
        event.currentTarget = objs[0];

        //捕获阶段的模拟
        if (objs.length && objs[0].useCapture) {
            reverseObjs = Util.reverse(objs);
            reverseObjs = reverseObjs.splice(0, reverseObjs.length - 1);
            for (i = 0, len = reverseObjs.length; i < len; i++) {
                item = reverseObjs[i];
                event.target = item;
                item.trigger(event.type, event, false, true);
            }
        }

    } else {
        objs = KeyBoardEvent.getObjs();
    }

    event.isImmediatePropagationStopped = returnFalse;
    event.isPropagationStopped = returnFalse;

    //模拟目标阶段和冒泡阶段
    for (i = 0, len = objs.length; i < len; i++) {
        if (event.isPropagationStopped()) {
            break;
        } else {
            item = objs[i];
            event.target = item;
            item.trigger(event.type, event);
        }
    }
};

Stage.prototype.addChild = function (obj) {
    var self = this;

    DisplayObjectContainer.prototype.addChild.call(self, obj);
    self._addStage(obj);

    obj.stage = self;

    if (obj.graphics) {
        obj.graphics.stage = self;
        obj.graphics.objectIndex = obj.objectIndex + ".0";
    }

};

Stage.prototype._addStage = function (obj) {
    var self = this;

    obj.stage = self;

    if (obj.graphics) {
        obj.graphics.stage = self;
        obj.graphics.parent = obj;
        obj.graphics.objectIndex = obj.objectIndex + ".0";
    }

    Util.each(obj._childList, function (item) {
        self._addStage(item);
    });
};

Stage.prototype._getOffset = function (domElem) {
    var self = this,
        docElem = document.documentElement,
        scrollTop = docElem.scrollTop,
        scrollLeft = docElem.scrollLeft,
        actualLeft, actualTop, rect, offset;

    //TODO:此处取值有问题
    if (domElem.getBoundingClientRect) {
        if (typeof arguments.callee.offset != "number") {
            var tmp = document.createElement("div");
            tmp.style.cssText = "position:absolute;left:0;top:0";
            document.body.appendChild(tmp);
            arguments.callee.offset = -tmp.getBoundingClientRect().top - scrollTop;
            document.body.removeChild(tmp);
            tmp = null;
        }

        rect = domElem.getBoundingClientRect();
        offset = arguments.callee.offset;

        return {
            left: rect.left + offset,
            top: rect.top + offset
        };

    } else {
        actualLeft = self._getElementLeft(domElem);
        actualTop = self._getElementTop(domElem);

        return {
            left: actualLeft - scrollLeft,
            top: actualTop - scrollTop
        };
    }
};

Stage.prototype._getElementLeft = function (elem) {
    var actualLeft = elem.offsetLeft;
    var current = elem.offsetParent;

    while (current != null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return actualLeft;
};

Stage.prototype._getElementTop = function (elem) {
    var actualTop = elem.offsetTop;
    var current = elem.offsetParent;

    while (current != null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
};

Base.inherit(Stage, DisplayObjectContainer);
/**
 * Shape绘图类
 */

function Shape() {
    DisplayObject.call(this);

    this.name = "Shape";
    this._showList = [];
    this._setList = [];
}

Shape.prototype.show = function (cord) {
    var self = this,
        showList = self._showList,
        len = showList.length;

    if (cord == null) {
        cord = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    debugger;
    DisplayObject.prototype.show.call(this, cord);

    if (len) {
        for (var i = 0; i < len; i++) {
            showList[i](cord);
        }
    }

    if (self._saveFlag) {
        self.stage.ctx.restore();
    }
};

Shape.prototype.lineWidth = function (thickness) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.lineWidth = thickness;
    });
};

Shape.prototype.strokeStyle = function (color) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.strokeStyle = color;
    });
};

Shape.prototype.stroke = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.stroke();
    });
};

Shape.prototype.beginPath = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.beginPath();
    });
};

Shape.prototype.closePath = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.closePath();
    });
};

Shape.prototype.moveTo = function (x, y) {
    var self = this;
    self._showList.push(function (cord) {
        self.stage.ctx.moveTo(x + cord.x, y + cord.y);
    });
};

Shape.prototype.lineTo = function (x, y) {
    var self = this;
    self._showList.push(function (cord) {
        self.stage.ctx.lineTo(x + cord.x, y + cord.y);
    });
};

Shape.prototype.clear = function () {
    var self = this;
    self._showList = [];
    self._setList = [];
};

Shape.prototype.rect = function (x, y, width, height) {
    var self = this;

    self._showList.push(function (cord) {
        self.stage.ctx.rect(x + cord.x, y + cord.y, width, height);
    });

    self._setList.push({
        type: "rect",
        pos: [x, y, width, height]
    });
};

Shape.prototype.fillStyle = function (color) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.fillStyle = color;
    });
};

Shape.prototype.fill = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.fill();
    });
};

Shape.prototype.arc = function (x, y, r, sAngle, eAngle, direct) {
    var self = this;

    self._showList.push(function (cord) {
        self.stage.ctx.arc(x + cord.x, y + cord.y, r, sAngle, eAngle, direct);
    });

    self._setList.push({
        type: "arc",
        pos: pointArr
    });
};

Shape.prototype.drawArc = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.arc(pointArr[0] + cord.x, pointArr[1] + cord.y, pointArr[2], pointArr[3], pointArr[4], pointArr[5]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });

    self._setList.push({
        type: "arc",
        pos: pointArr
    });
};

Shape.prototype.drawRect = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.rect(pointArr[0] + cord.x, pointArr[1] + cord.y, pointArr[2], pointArr[3]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });

    self._setList.push({
        type: "rect",
        pos: pointArr
    });
};

//TODO:多边形不具有事件检测的功能
Shape.prototype.drawVertices = function (thickness, lineColor, vertices, isFill, color) {
    var self = this,
        length = vertices.length,
        canvas, i;

    if (length < 3) {
        return;
    }

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.moveTo(vertices[0][0] + cord.x, vertices[0][1] + cord.y);

        for (i = 1; i < length; i++) {
            var pointArr = vertices[i];
            canvas.lineTo(pointArr[0] + cord.x, pointArr[1] + cord.y);
        }

        canvas.lineTo(vertices[0][0] + cord.x, vertices[0][1] + cord.y);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }

        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath();
        canvas.stroke();
    });
};

Shape.prototype.drawLine = function (thickness, lineColor, pointArr) {
    var self = this,
        canvas;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.moveTo(pointArr[0] + cord.x, pointArr[1] + cord.y);
        canvas.lineTo(pointArr[2] + cord.x, pointArr[3] + cord.y);
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath();
        canvas.stroke();
    });
};

Shape.prototype.lineStyle = function (thickness, color, alpha) {
    var self = this,
        canvas;

    if (!color) {
        color = self.color;
    }

    if (!alpha) {
        alpha = self.alpha;
    }

    self.color = color;
    self.alpha = alpha;

    self._showList.push(function () {
        canvas = self.stage.ctx;

        canvas.lineWidth = thickness;
        canvas.strokeStyle = color;
    });
};

Shape.prototype.add = function (fn) {
    var self = this;

    self._showList.push(function (cord) {
        fn.call(self.stage);
    });
};

Shape.prototype.isMouseon = function (cord, pos) {
    var self = this,
        i, len, item, ax, ay, ar, ar2, ox, oy, osx, osy;

    if (pos == null) {
        pos = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    debugger;
    pos = DisplayObject.prototype.isMouseon.call(self, cord, pos);
    cord = self._getRotateCord(cord, pos, self.rotate);


    osx = pos.scaleX * self.scaleX;
    osy = pos.scaleY * self.scaleY;

    ox = (self.x + self.translateX) * osx + pos.x;
    oy = (self.y + self.translateY) * osy + pos.y;

    for (i = 0, len = self._setList.length; i < len; i++) {
        item = self._setList[i];

        if (
                item.type == "rect" &&
                cord.x >= item.pos[0] * osx + ox &&
                cord.x <= (item.pos[2] + item.pos[0]) * osx + ox &&
                cord.y >= item.pos[1]* osy + oy &&
                cord.y <= (item.pos[3] + item.pos[1]) * osy + oy
            ) {
            return true;
        }
        else if (item.type == "arc") {
            ax = Math.pow(cord.x - (item.pos[0] * osx + ox), 2);
            ay = Math.pow(cord.y - (item.pos[1] * osy + oy), 2);
            ar = Math.pow(item.pos[2] * osx, 2);
            ar2 = Math.pow(item.pos[2] * osy, 2);

            if (osx == osy && ax + ay <= ar) {
                return true;
            } else if (osx != osy && ax / ar + ay / ar2 <= 1) {
                return true;
            }
        }
    }

    return false;
}

Base.inherit(Shape, InteractiveObject);

/**
 * Sprite精灵类，继承自DisplayContaianer
 */

function Sprite() {
    DisplayObjectContainer.call(this);

    this.name = "Sprite";
    this.graphics = null;
}

Sprite.prototype.show = function (cord) {
    var self = this;

    if (cord == null) {
        cord = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    DisplayObjectContainer.prototype.show.call(self, cord);

    if (self.graphics && self.graphics.show) {
        self.graphics.show(cord);
    }

    if (self._saveFlag) {
        self.stage.ctx.restore();
    }
};

Sprite.prototype.addChild = function (obj) {
    var self = this;
    DisplayObjectContainer.prototype.addChild.call(self, obj);
    self._resize();
};

Sprite.prototype.removeChild = function (obj) {
    var self = this;
    DisplayObjectContainer.prototype.removeChild.call(self, obj);
    self._resize();
};

Sprite.prototype.getWidth = function () {
    var self = this,
        w = 0,
        w1 = 0;

    Util.each(self._childList, function (item) {
        if (item.getWidth) {
            w1 = item.getWidth();
            w = w < w1 ? w1 : w;
        }
    });

    return w;
};

Sprite.prototype.getHeight = function () {
    var self = this,
        w = 0,
        w1 = 0;

    Util.each(self._childList, function (item) {
        if (item.getWidth) {
            w1 = item.getHeight();
            w = w < w1 ? w1 : w;
        }
    });

    return w;
};

Sprite.prototype._resize = function () {
    var self = this,
        sx = 0,
        sy = 0,
        ex = 0,
        ey = 0,
        item;

    for (var i = 0; i < self._childList.length; i++) {
        item = self._childList[i];

        if (sx > item.x) {
            sx = item.x;
        }
        if (ex < item.width + item.x) {
            ex = item.width + item.x;
        }
        if (sy > item.y) {
            sy = item.y;
        }
        if (ey < item.height + item.y) {
            ey = item.height + item.y;
        }
    }

    self.width = ex - sx;
    self.height = ey - sy;
};

Sprite.prototype.isMouseon = function (cord, pos) {
    var self = this,
        isOn = false,
        i, len, item;

    if(pos == null){
        pos = {
            x:0,
            y:0,
            scaleX: 1,
            scaleY: 1
        };
    }

    pos = DisplayObject.prototype.isMouseon.call(self, cord, pos);
    cord = self._getRotateCord(cord, pos, self.rotate);

    pos = {
        x: self.x + pos.x + self.translateX,
        y: self.y + pos.y + self.translateY,
        scaleX: self.scaleX * pos.scaleX,
        scaleY: self.scaleY * pos.scaleY
    };

    for (i = 0, len = self._childList.length; i < len; i++) {
        item = self._childList[i];

        if (item.isMouseon) {
            isOn = item.isMouseon(cord, pos);
        }

        if (isOn) {
            return true;
        }
    }

    if (!isOn && self.graphics && self.graphics.isMouseon) {
        isOn = self.graphics.isMouseon(cord, pos);
    }

    return isOn;
};

Base.inherit(Sprite, DisplayObjectContainer);
/**
 * Bitmap位图容器类
 */

/**
 * BitmapData位图数据类
 */


/**
 * Animation帧动画类
 */


/**
 * URLLoader数据加载类
 */

/**
 * Loader加载显示对象类
 */

/**
 * Tween动画类
 */
