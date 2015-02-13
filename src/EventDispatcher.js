
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

    if(!target){
        return;
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

                event = self._fixEvent(event);

                var callbacks = handlers[eventName];

                for(var i = 0,len = callbacks.length; i < len; i++){
                    if(event.isImmediatePropagationStopped()){
                        break;
                    }else{
                        callbacks[i].callback.call(self,event);
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

    if(!target){
        return;
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
EventDispatcher.prototype.once = function(target,eventName,callback){
    var self = this,
        fn;

    if(!target){
        return;
    }

    fn = function(event){
        callback.call(self,event);
        self.off(target,eventName,fn);
    };

    fn.fnStr = callback.toString().replace(fnRegExp,'');

    return self.on(target,eventName,fn);
};

/**
 * 事件触发
 * @param eventName
 */
EventDispatcher.prototype.trigger = function(target,eventName){
    var self = this,
        handlers,callbacks;

    if(!target || !eventName){
        return;
    }

    handlers = target.handlers;

    if(handlers){
        callbacks = handlers[eventName] ? handlers[eventName] : [];
    }

    Util.each(callbacks,function(item){
        item.call(self);
    });

    return self;
};

/**
 * 修复event的部分方法和属性
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

        event.relatedTarget = event.fromElement === event.target ?
            event.toElement :
            event.fromElement;

        event.preventDefault = function () {
            if (old.preventDefault) {
                old.preventDefault();
            }
            event.returnValue = false;
            event.isDefaultPrevented = returnTrue;
            event.defaultPrevented = true;
        };

        event.isDefaultPrevented = returnFalse;
        event.defaultPrevented = false;

        event.stopPropagation = function () {
            if (old.stopPropagation) {
                old.stopPropagation();
            }
            event.cancelBubble = true;
            event.isPropagationStopped = returnTrue;
        };

        event.isPropagationStopped = returnFalse;

        event.stopImmediatePropagation = function () {
            if (old.stopImmediatePropagation) {
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