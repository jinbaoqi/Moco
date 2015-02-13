
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