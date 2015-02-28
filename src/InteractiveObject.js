/**
 * InteractiveObject可交互类
 * @constructor
 */

var EventDispatcherProto = EventDispatcher.prototype;

function InteractiveObject(){
    DisplayObject.call(this);

    this._inMouseList = false;
    this._inKeyBordList = false;
}

InteractiveObject.prototype.on = function(eventName, callback, useCapture){
    var self = this,
        isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) == -1,
        isKeyBoardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) == -1;

    if(
        (!isMouseEvent && !isKeyBoardEvent) ||
        (isMouseEvent && self._inMouseList) ||
        (isKeyBoardEvent && self._inKeyBordList)
    ){
        return;
    }else if(isMouseEvent){
        MouseEvent.add(self);
        self._inMouseList = true;
    }else if(isKeyBoardEvent){
        KeyBoardEvent.add(self);
        self._inKeyBordList = true;
    }

    EventDispatcherProto.on.apply(EventDispatcherProto,[self,eventName,callback,useCapture]);
};

InteractiveObject.prototype.off = function(eventName, callback){
    var self = this,
        isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) == -1,
        isKeyBoardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) == -1;

    if(!isMouseEvent && !isKeyBoardEvent){
        return;
    }

    EventDispatcherProto.off.apply(EventDispatcherProto,[self,eventName,callback]);

    if(!Util.keys(self.handlers).length) {
        if(isMouseEvent){
            MouseEvent.remove(self);
            self._inMouseList = true;
        }else if(isKeyBoardEvent){
            KeyBoardEvent.remove(self);
            self._inKeyBordList = true;
        }
    }
}

Base.inherit(InteractiveObject,DisplayObject);