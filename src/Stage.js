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

Stage.prototype._addStage = function(obj){
    var self = this;

    obj.stage = self;

    if (obj.graphics) {
        obj.graphics.stage = self;
        obj.graphics.parent = obj;
        obj.graphics.objectIndex = obj.objectIndex + ".0";
    }

    Util.each(obj._childList,function(item){
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
    if (!domElem.getBoundingClientRect) {
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