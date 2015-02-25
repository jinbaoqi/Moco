/**
 * 工具类
 * @type {Object|Function|Array}
 */

var arrProto = Array.prototype,
    objProto = Object.prototype;

var Util = {
    isType: function(target,type){
        return objProto.toString.call(target) == "[object "+type+"]";
    },
    each: function(arr,callback){
        var self = this;

        if(arr && arrProto.forEach){
            arrProto.forEach.call(arr,callback);
        }else if(self.isType("Array",arr)){
            for(var i = 0,len = arr.length; i < len; i++){
                callback(arr[i],i,arr);
            }
        }
    },
    filter: function(arr,callback){
        var self = this,
            tmp = [];

        if(arr && arrProto.filter){
            return arrProto.filter.call(arr,callback);
        }else{
            self.each(arr,function(item,index,arr){
                if(callback.call(arr,item,index,arr) == true){
                    tmp.push(item);
                }
            });
        }

        return tmp;
    },
    reverse: function(arr){
        var self = this,
            tmp = [];

        if(arrProto.reverse){
            return arrProto.reverse.call(arr);
        }else{
            for(var i = arr.length - 1; i >= 0; i--){
                tmp.push(arr[i]);
            }
        }

        return tmp;
    },
    inArray: function(item,arr,fn){
        var self = this;

        if(arrProto.inArray){
            return arrProto.inArray.call(arr,item);
        }else{
            for(var i = 0,len = arr.length; i < len; i++){
                if(typeof fn == "function"){
                    if(fn.call(item,item,arr[i],i,arr)){
                        return i;
                    }
                }else if(arr[i] == item){
                    return i;
                }
            }

            return -1;
        }
    },
    extends: function(obj) {
        var self = this,
            source, prop;

        if (!self.isType(obj,"Object")) {
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
    keys: function(obj){
        var self = this,
            tmp = [];

        if(Object.keys){
            return Object.keys(obj);
        }else{
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    tmp.push(key);
                }
            }
        }

        return tmp;
    }
};

var EventCore = {
    _list: [],
    getObjs: function(){
        return this._list;
    },
    getObjsFromCord: function(cord){
        var self = this,
            objs = [],
            tmp = [],
            k = 0,
            item;

        objs = Util.filter(self._list,function(item){
            if(item.isMouseon(cord)){
                return true;
            }
        });

        objs = arrProto.sort.call(objs,function(i,j){
            var a1 = i.objectIndex.split("."),
                a2 = j.objectIndex.split("."),
                len = Math.max(a1.length,a2.length);

            for(var i = 0; i < len; i++){
                if(!a1[i] || !a2[i]){
                    return a1[i] ? 1 : -1;
                }else if(a1[i] != a2[i]){
                    return a1[i] - a2[i];
                }
            }
        });

        k = objs[0] && objs[0].aIndex;

        for(var i = 0,len = objs.length; i < len; i++){
            item = objs[i];
            if(k != item.aIndex){
                break;
            }else{
                tmp.push(item);
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

Util.extends(Event,EventCore);

var MouseEvent = {
    CLICK: "click",
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    MOUSE_MOVE: "mousemove"
};

MouseEvent.nameList = Util.keys(MouseEvent);

Util.extends(MouseEvent,EventCore);

var KeyBoardEvent = {
    KEY_DOWN: "keydown",
    KEY_UP: "keyup",
    KEY_PRESS: "keypress"
};

KeyBoardEvent.nameList = Util.keys(KeyBoardEvent);

Util.extends(KeyBoardEvent,EventCore);

/**
 * 事件部分
 * @type {RegExp}
 */

var fnRegExp = /\s+/g,
    guid = 0;


function EventDispatcher(){};

/**
 * 事件注册
 * @param eventName
 * @param callback
 * @param useCapture
 */
EventDispatcher.prototype.on = function(target,eventName,callback,useCapture){
    var self = this,
        handlers,fn;

    if(typeof target == "string"){
        useCapture = callback;
        callback = eventName;
        eventName = target;
        target = self;
    }

    if(eventName && callback){
        useCapture = useCapture ? useCapture : false;

        if(Util.isType(eventName,"Array")){
            Util.each(eventName,function(item){
                self.on(item,callback,useCapture);
            });
        }else{

            handlers = target.handlers;

            fn = function(event){
                var callbacks = handlers[eventName],
                    item;

                event = self._fixEvent(event);
                event.useCapture = useCapture;

                for(var i = 0,len = callbacks.length; i < len; i++){
                    item = callbacks[i];

                    if(event.isImmediatePropagationStopped()){
                        break;
                    }else if(item.guid == fn.guid){
                        item.callback.call(self,event);
                    }
                }
            };


            fn.fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(fnRegExp,'');
            fn.callback = callback;
            fn.guid = guid++;

            if(!handlers){
                handlers = target.handlers = {};
            }

            if(!handlers[eventName]){
                handlers[eventName] = [];
            }

            handlers[eventName].push(fn);

            if(handlers[eventName].length == 1){
                if(target.addEventListener){
                    target.addEventListener(eventName,fn,useCapture);
                }else if(target.attachEvent){
                    self.attachEvent(eventName,fn);
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
EventDispatcher.prototype.off = function(target,eventName,callback){
    var self = this,
        handlers,callbacks,fnStr,fnItem;

    if(typeof target == "string"){
        callback = eventName;
        eventName = target;
        target = self;
    }

    if(eventName || callback){
        if(Util.isType(eventName,"Array")){
            Util.each(eventName,function(item){
                self.off(target,item,callback);
            });
        }else if(!callback){
            handlers = target.handlers;

            if(handlers){
                callbacks = handlers[eventName] ? handlers[eventName] : [];
                Util.each(callbacks,function(item){
                    self.off(target,eventName,item);
                });
            }
        }else{
            handlers = target.handlers;

            if(handlers){
                callbacks = handlers[eventName] ? handlers[eventName] : [];
                fnStr = callback.fnStr ? callback.fnStr : callback.toString().replace(fnRegExp,'');

                for(var i = callbacks.length - 1; i >= 0 ; i--){
                    fnItem = callbacks[i];
                    if(fnItem.fnStr == fnStr){
                        arrProto.splice.call(callbacks,i,1);
                    }
                }

                if(!callbacks.length){
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
EventDispatcher.prototype.once = function(target,eventName,callback,useCapture){
    var self = this,
        fn;

    if(typeof target == "string"){
        useCapture = callback;
        callback = eventName;
        eventName = target;
        target = self;
    }

    fn = function(event){
        callback.call(self,event);
        self.off(target,eventName,fn);
    };

    fn.fnStr = callback.toString().replace(fnRegExp,'');

    return self.on(target,eventName,fn,useCapture);
};

/**
 * 事件触发
 * @param eventName
 */
EventDispatcher.prototype.trigger = function(target,eventName,event,isDeep){
    var self = this,
        handlers,callbacks,item,parent;

    if(!target && !eventName){
        return;
    }else if(typeof target == "string"){
        event = eventName;
        eventName = target;
        target = self;
    }

    handlers = target && target.handlers;

    if(!handlers){
        return self;
    }

    callbacks = handlers[eventName] ? handlers[eventName] : [];

    event = self._fixEvent(event);

    if(event.target == null){
        event.target = event.currentTarget = self;
    }

    for(var i = 0,len = callbacks.length; i < len; i++){
        item = callbacks[i];
        if(event.isImmediatePropagationStopped()){
            break;
        }else{
            item.callback.call(self,event);
        }
    }

    parent = target.parentNode || target.parent;

    if(!isDeep){
        while(parent){
            self.trigger(parent,eventName,event,true);
            parent = parent.parentNode || parent.parent;
        }
    }

    return self;
};

/**
 * 统一event的部分方法和属性
 * @param event
 * @returns {*}
 */
EventDispatcher.prototype._fixEvent = function(event){
    function returnTrue() { return true; }
    function returnFalse() { return false; }

    if (!event || !event.isPropagationStopped) {

        event = event ? event : {};

        var preventDefault = event.preventDefault,
            stopPropagation = event.stopPropagation,
            stopImmediatePropagation = event.stopImmediatePropagation;

        if (!event.target) {
            event.target = event.srcElement || document;
        }

        if(!event.currentTarget){
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
    inherit: function(Child,Parent){
        var F = function(){},
            old = Child.prototype;

        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;

        for(var key in old){
            if(old.hasOwnProperty(key)){
                Child.prototype[key] = old[key];
            }
        }
    }
};
/**
 * Display显示对象抽象类
 */

function DisplayObject(){
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
    this.aIndex = this.objectIndex = guid++;
    this._saveFlag = false;
}

DisplayObject.prototype = {
    constructor: DisplayObject,
    show: function(){
        var self = this,
            rotateFlag = Math.PI / 180,
            canvas = self.stage.ctx;

        if (!self.visible) {
            return;
        }

        if (
                (self.mask != null && self.mask.show) ||
                self.alpha < 1 ||
                self.rotate != 0 ||
                self.scaleX != 1 ||
                self.scaleY != 1 ||
                self.translateX != 0 ||
                self.translateY != 0 ||
                self.globalCompositeOperation != ""
            ){
            self._saveFlag = true;
            canvas.save();
        }

        if (self.mask != null && self.mask.show){
            self.mask.show ();
            canvas.clip ();
        }

        if (self.alpha <= 1){
            canvas.globalAlpha = self.alpha > 1 ? 1 : self.alpha;
        }

        if(self.globalCompositeOperation != ""){
            canvas.globalCompositeOperation = self.globalCompositeOperation;
        }

        if (self.rotate != 0){
            if (self.center == null) {
                self.getRotateXY ();
            }
            canvas.translate(self.x + self.center.x, self.y + self.center.y);
            canvas.rotate(self.rotate * rotateFlag);
            canvas.translate(-(self.x + self.center.x), -(self.y + self.center.y));
        }

        if (self.scaleX != 1 || self.scaleY != 1){
            canvas.scale(self.scaleX, self.scaleY);
        }

        if(self.translateX != 0 || self.translateY != 0){
            canvas.translate(self.translateX,self.translateY);
        }
    },

    getRotateXY: function(){
        var self = this;
        self.center = {
            x: 0,
            y: 0
        };
    },

    isMouseon: function(cord){
        var self = this;

        if(self.visible == false || self.alpha <= 0.01){
            return false;
        }

        if(
            cord.x >= self.x &&
            cord.x <= self.x + self.width &&
            cord.y >= self.y &&
            cord.y <= self.y + self.height
          ){
            return true;
        }

        return false;
    }
};

Base.inherit(DisplayObject,EventDispatcher);

/**
 * DisplayContainer显示容器抽象类
 */

function DisplayObjectContainer(){
    DisplayObject.call(this);

    this.name = "DisplayObjectContainer";
    this._childList = [];
}

DisplayObjectContainer.prototype.addChild = function(obj){
    var self = this;

    if(obj instanceof DisplayObject){
        self._childList.push(obj);
        obj.parent = self;
        obj.objectIndex = self.objectIndex+"."+self._childList.length;
    }
};

DisplayObjectContainer.prototype.removeChild = function(obj){
    var self = this,
        item;

    if(obj instanceof DisplayObject){
        for(var i = self._childList.length - 1; i >= 0; i--){
            item = self._childList[i];
            if(item.aIndex == obj.aIndex){
                arrProto.splice.call(self._childList,i,1);
            }
        }
    }
};

DisplayObjectContainer.prototype.getChildAt = function(index){
    var self = this,
        len = self._childList.length;

    if(Math.abs(index) > len){
        return;
    }else if(index < 0){
        index = len + index;
    }

    return self._childList[index];
};

DisplayObjectContainer.prototype.contains = function(obj){
    var self = this;

    if(obj instanceof DisplayObject){
        return Util.inArray(self._childList,obj,function(obj,item){
            return obj.aIndex == item.aIndex;
        }) == -1 ? false : true;
    }
};

Base.inherit(DisplayObjectContainer,DisplayObject);

/**
 * requestAnimationFrame兼容写法
 * https://github.com/ngryman/raf.js
 */
var lastTime = 0,
    vendors = ['webkit', 'moz'],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame,
    i = vendors.length,
    raf,craf;

while (--i >= 0 && !requestAnimationFrame) {
    requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
}

if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function(callback) {
        var now = +new Date(), nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function() {
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

function Stage(canvasId,fn){
    DisplayObjectContainer.call(this);

    this.name = "Stage";
    this.domElem = document.getElementById(canvasId);
    this.ctx = this.domElem.getContext("2d");
    this.width = parseFloat(this.domElem.getAttribute("width"),10);
    this.height = parseFloat(this.domElem.getAttribute("height"),10);
    this.offset = this._getOffset(this.domElem);
    this.x = this.offset.left;
    this.y = this.offset.top;

    if(typeof fn == "function"){
        fn(this);
    }

    this.initialize();
}

Stage.prototype.initialize = function(){
    var self = this;

    //鼠标事件的注册
    Util.each(MouseEvent.nameList,function(eventName){
        eventName = eventName.toLowerCase().replace("_","");
        self.on(document,eventName,function(event){
            var cord = {
                x: 0,
                y: 0
            };

            if(event.clientX != null){
                cord.x = event.pageX - self.x;
                cord.y = event.pageY - self.y;
                self.mouseX = cord.x;
                self.mouseY = cord.y;
            }

            event.cord = cord;

            self.trigger(event.type,event);
            self.mouseEvent(cord,event);
        });
    });

    //键盘事件的注册
    Util.each(KeyBoardEvent.nameList,function(eventName){
        eventName = eventName.toLowerCase().replace("_","");
        self.on(document,eventName.toLowerCase(),function(event){
            self.trigger(event.type,event);
            self.mouseEvent(null,event);
        });
    });

    self.show();
};

Stage.prototype.show = function(){
    var self = this,
        item;

    self.ctx.clearRect(0,0,self.width,self.height);

    for(var i = 0,len = self._childList.length; i < len; i++){
        item = self._childList[i];

        if(item.show){
            item.show();
        }
    }

    raf(function(){
        self.show();
    });
};

Stage.prototype.mouseEvent = function(cord,event){
    var objs = [],
        reverseObjs = [],
        item;

    function returnFalse(){return false};

    if(cord != null){
        objs = MouseEvent.getObjsFromCord(cord);

        //模拟捕获阶段
        if(event.useCapture){
            reverseObjs = Util.reverse(objs);
            for(var i = reverseObjs.length - 1; i >= 0; i--){
                item = reverseObjs[i];
                item.trigger(event.type,event);
            }
        }

    }else{
        objs = KeyBoardEvent.getObjs();
    }

    event.isImmediatePropagationStopped = returnFalse;
    event.isPropagationStopped = returnFalse;

    //模拟目标阶段和冒泡阶段
    for(var i = 0,len = objs.length; i < len; i++){
        if(event.isPropagationStopped()){
            break;
        }else{
            item = objs[i];
            item.trigger(event.type,event);
        }
    }
};

Stage.prototype.addChild = function(obj){
    DisplayObjectContainer.prototype.addChild.call(this,obj);
    obj.stage = this;
};

Stage.prototype._getOffset = function(domElem){
    var self = this,
        docElem = document.documentElement,
        scrollTop = docElem.scrollTop,
        scrollLeft = docElem.scrollLeft,
        actualLeft,actualTop,rect,offset;

    if(domElem.getBoundingClientRect){
        if(typeof arguments.callee.offset != "number"){
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

    }else{
        actualLeft = self._getElementLeft(domElem);
        actualTop = self._getElementTop(domElem);

        return {
            left: actualLeft - scrollLeft,
            top: actualTop - scrollTop
        };
    }
};

Stage.prototype._getElementLeft = function(elem){
    var actualLeft = elem.offsetLeft;
    var current = elem.offsetParent;

    while(current != null){
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return actualLeft;
};

Stage.prototype._getElementTop = function(elem){
    var actualTop = elem.offsetTop;
    var current = elem.offsetParent;

    while(current != null){
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
};

Base.inherit(Stage,DisplayObjectContainer);
/**
 * Shape绘图类
 */

function Shape(){
    DisplayObject.call(this);

    this.name = "Shape";
    this._showList = [];
}

Shape.prototype.show = function(){
    DisplayObject.prototype.show.call(this);

    var self = this,
        showList = self._showList,
        len = showList.length;

    if(len > 0){
        for(var i = 0; i < len; i++){
            showList[i]();
        }
    }

    if(self._saveFlag){
        self.stage.ctx.restore();
    }
};

Shape.prototype.lineWidth = function(thickness){
    var self = this;
    self._showList.push (function(){
        self.stage.ctx.lineWidth = thickness;
    });
};

Shape.prototype.strokeStyle = function(color){
    var self = this;
    self._showList.push (function(){
        self.stage.ctx.strokeStyle = color;
    });
};

Shape.prototype.stroke = function(){
    var self = this;
    self._showList.push (function () {
        self.stage.ctx.stroke();
    });
};

Shape.prototype.beginPath = function(){
    var self = this;
    self._showList.push (function () {
        self.stage.ctx.beginPath();
    });
};

Shape.prototype.closePath = function(){
    var self = this;
    self._showList.push (function () {
        self.stage.ctx.closePath();
    });
};

Shape.prototype.moveTo = function(x, y){
    var self = this;
    self._showList.push (function () {
        self.stage.ctx.moveTo(x,y);
    });
};

Shape.prototype.lineTo = function(x, y){
    var self = this;
    self._showList.push (function(){
        self.stage.ctx.lineTo(x,y);
    });
};

Shape.prototype.clear = function(){
    var self = this;
    self._showList = [];
};

Shape.prototype.rect = function(x,y,width,height){
    var self = this;
    self._showList.push(function(){
        self.stage.ctx.rect(x,y,width,height);
    });
};

Shape.prototype.fillStyle = function(color){
    var self = this;
    self._showList.push(function(){
        self.stage.ctx.fillStyle = color;
    });
};

Shape.prototype.fill = function(){
    var self = this;
    self._showList.push(function(){
        self.stage.ctx.fill();
    });
};

Shape.prototype.arc = function(x,y,r,sAngle,eAngle,direct){
    var self = this;
    self._showList.push(function(){
        self.stage.ctx.arc(x,y,sAngle,eAngle,direct);
    });
};

Shape.prototype.drawArc = function(thickness,lineColor,pointArr,isFill,color){
    var self = this,
        canvas;

    self._showList.push (function(){
        canvas = self.stage.ctx;

        canvas.beginPath ();
        canvas.arc(pointArr[0], pointArr[1], pointArr[2], pointArr[3], pointArr[4], pointArr[5]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill ();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke ();
    });
};

Shape.prototype.drawRect = function(thickness,lineColor,pointArr,isFill,color){
    var self = this,
        canvas;

    self._showList.push (function(){
        canvas = self.stage.ctx;

        canvas.beginPath();
        canvas.rect (pointArr[0], pointArr[1], pointArr[2], pointArr[3]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill ();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke ();
    });
};

Shape.prototype.drawVertices = function(thickness,lineColor,vertices,isFill,color){
    var self = this,
        length = vertices.length,
        canvas,i;

    if (length < 3) {
        return;
    }

    self._showList.push (function(){
        canvas = self.stage.ctx;

        canvas.beginPath ();
        canvas.moveTo (vertices[0][0], vertices[0][1]);

        for (i = 1; i < length; i ++) {
            var pointArr = vertices[i];
            canvas.lineTo (pointArr[0], pointArr[1]);
        }

        canvas.lineTo (vertices[0][0], vertices[0][1]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill ();
        }

        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath();
        canvas.stroke();
    });
};

Shape.prototype.drawLine = function(thickness,lineColor,pointArr){
    var self = this,
        canvas;

    self._showList.push (function(){
        canvas = self.stage.ctx;

        canvas.beginPath ();
        canvas.moveTo (pointArr[0], pointArr[1]);
        canvas.lineTo (pointArr[2], pointArr[3]);
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath ();
        canvas.stroke ();
    });
};

Shape.prototype.lineStyle = function(thickness,color,alpha){
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

    self._showList.push (function(){
        canvas = self.stage.ctx;

        canvas.lineWidth = thickness;
        canvas.strokeStyle = color;
    });
};

Shape.prototype.add = function(fn){
    var self = this;

    self._showList.push(function(){
        fn.call(self.stage);
    });
};

Base.inherit(Shape,DisplayObject);
/**
 * Sprite精灵类，继承自DisplayContaianer
 */

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
