/**
 * 工具类
 * @type {Object|Function|Array}
 */

var arrProto = Array.prototype,
    objProto = Object.prototype;

var fnRegExp = /\s+/g,
    guid = 0;

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

            return tmp;
        }
    },
    inArray: function(item,arr,fn){
        var self = this,
            flag;

        if(arrProto.inArray){
            return arrProto.inArray.call(arr,item);
        }else{
            for(var i = 0,len = arr.length; i < len; i++){
                if(typeof fn == "function"){
                    flag = fn.call(item,item,arr[i],i,arr);

                    if(flag == true){
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
    }
};

var EventCore = {
    _list: [],
    _getObjsFromCord: function(cord){
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
    MOUSE_MOVE: "mousemove",
    MOUSE_OVER: "mouseover",
    MOUSE_LEAVE: "mouseleave"
};

Util.extends(MouseEvent,EventCore);

var KeyBoardEvent = {
    KEY_DOWN: "keydown",
    KEY_UP: "keyup",
    KEY_PRESS: "keypress"
};

Util.extends(KeyBoardEvent,EventCore);

/**
 * 事件部分
 * @type {RegExp}
 */

function EventDispatcher(){};

/**
 * 事件注册
 * @param eventName
 * @param callback
 * @param useCapture
 */
EventDispatcher.prototype.on = function(eventName,callback,useCapture){
    var self = this,
        handlers,fn;

    if(eventName && callback){
        useCapture = useCapture ? useCapture : false;

        if(Util.isType(eventName,"Array")){
            Util.each(eventName,function(item){
                self.on(item,callback,useCapture);
            });
        }else{

            handlers = self.handlers;

            fn = function(event){
                var callbacks = handlers[eventName],
                    item;

                event = self._fixEvent(event);

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
                handlers = self.handlers = {};
            }

            if(!handlers[eventName]){
                handlers[eventName] = [];
            }

            handlers[eventName].push(fn);

            if(handlers[eventName].length == 1){
                if(self.addEventListener){
                    self.addEventListener(eventName,fn,useCapture);
                }else if(self.attachEvent){
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
EventDispatcher.prototype.off = function(eventName,callback){
    var self = this,
        handlers,callbacks,fnStr,fnItem;

    if(eventName || callback){
        if(Util.isType(eventName,"Array")){
            Util.each(eventName,function(item){
                self.off(self,item,callback);
            });
        }else if(!callback){
            handlers = self.handlers;

            if(handlers){
                callbacks = handlers[eventName] ? handlers[eventName] : [];
                Util.each(callbacks,function(item){
                    self.off(self,eventName,item);
                });
            }
        }else{
            handlers = self.handlers;

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
EventDispatcher.prototype.once = function(eventName,callback){
    var self = this,
        fn;

    fn = function(event){
        callback.call(self,event);
        self.off(self,eventName,fn);
    };

    fn.fnStr = callback.toString().replace(fnRegExp,'');

    return self.on(self,eventName,fn);
};

/**
 * 事件触发
 * @param eventName
 */
EventDispatcher.prototype.trigger = function(eventName){
    var self = this,
        handlers,callbacks,event,item;

    if(!eventName){
        return;
    }

    handlers = self.handlers;

    if(handlers){
        callbacks = handlers[eventName] ? handlers[eventName] : [];
    }

    event = self._fixEvent(event);
    event.target = event.currentTarget = self;

    for(var i = 0,len = callbacks.length; i < len; i++){
        item = callbacks[i];
        if(event.isImmediatePropagationStopped()){
            break;
        }else{
            item.callback.call(self,event);
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
        var old = event || window.event;

        event = {};
        for (var key in old) {
            if (key !== 'layerX' && key !== 'layerY' && key !== 'keyLocation') {
                if (!(key == 'returnValue' && old.preventDefault)) {
                    event[key] = old[key];
                }
            }
        }

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
            if (old && old.preventDefault) {
                old.preventDefault();
            }
            event.returnValue = false;
            event.isDefaultPrevented = returnTrue;
            event.defaultPrevented = true;
        };

        event.isDefaultPrevented = returnFalse;
        event.defaultPrevented = false;

        event.stopPropagation = function () {
            if (old && old.stopPropagation) {
                old.stopPropagation();
            }
            event.cancelBubble = true;
            event.isPropagationStopped = returnTrue;
        };

        event.isPropagationStopped = returnFalse;

        event.stopImmediatePropagation = function () {
            if (old && old.stopImmediatePropagation) {
                old.stopImmediatePropagation();
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
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.scale = 1;
    this.parent = null;
    this.x = 0;
    this.y = 0;
    this.visible = true;
    this.aIndex = this.objectIndex = guid++;
}

DisplayObject.prototype = {
    constructor: DisplayObject,
    show: function(){},
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

DisplayObjectContainer.prototype = {
    constructor: DisplayObjectContainer,
    addChild: function(obj){
        var self = this;

        if(obj instanceof DisplayObject){
            self._childList.push(obj);
            obj.parent = self;
            obj.objectIndex = self.objectIndex+"."+self._childList.length;
        }

        return self;
    },
    removeChild: function(obj){
        var self = this,
            item;

        if(obj instanceof DisplayObject){
            for(var i = self._childList.length - 1; i >= 0; i++){
                item = self._childList[i];
                if(item.aIndex == obj.aIndex){
                    arrProto.splice.call(self._childList,i,1);
                }
            }
        }

        return self;
    },
    getChildAt: function(index){
        var self = this,
            len = self._childList.length;

        if(Math.abs(index) > len){
            return;
        }else if(index < 0){
            index = len + index;
        }

        return self._childList[index];
    },
    contains: function(obj){
        var self = this;

        if(obj instanceof DisplayObject){
            return Util.inArray(self._childList,obj,function(obj,item){
                return obj.aIndex == item.aIndex;
            }) == -1 ? false : true;
        }
    }
};

Base.inherit(DisplayObjectContainer,DisplayObject);

/**
 * Stage全局画布类
 */

function Stage(canvasId){
    DisplayObjectContainer.call(this);

    this.name = "Stage";
    this.domElem = document.getElementById(canvasId);
    this.width = parseFloat(this.domElem.getAttribute("width"),10);
    this.height = parseFloat(this.domElem.getAttribute("height"),10);
    this.offset = this._getOffset(this.domElem);
    this.x = this.offset.left;
    this.y = this.offset.top;

    this.initialize();
}

Stage.prototype.initialize = function(){
    var self = this;
};

Stage.prototype.isMouseOn = function(){

};

Stage.prototype.mouseEvent = function(){

};

Stage.prototype._getOffset = function(domElem){
    var self = this,
        docElem = document.documentElement,
        scrollTop = docElem.scrollTop,
        scrollLeft = docElem.scrollLeft,
        actualLeft,actualTop;

    if(domElem.getBoundingClientRect){
        if(typeof arguments.callee.offset != "number"){
            var tmp = document.createElement("div");
            tmp.style.cssText = "position:absolute;left:0;top:0";
            document.body.appendChild(tmp);
            arguments.callee.offset = -tmp.getBoundingClientRect().top - scrollTop;
            document.body.removeChild(tmp);
            tmp = null;
        }

        var rect = domElem.getBoundingClientRect();
        var offset = arguments.callee.offset;

        return{
            left: rect.left + offset,
            top: rect.top + offset
        }

    }else{
        actualLeft = self._getElementLeft(domElem);
        actualTop = self._getElementTop(domElem);

        return {
            left: actualLeft - scrollLeft,
            top: actualTop - scrollTop
        }
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
