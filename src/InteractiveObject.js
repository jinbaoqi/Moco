/**
 * InteractiveObject可交互类
 * @constructor
 */
function InteractiveObject(){
    DisplayObject.call(this);

    this._inMouseList = false;
    this._inKeyBordList = false;
}

InteractiveObject.prototype.on = function(eventName, callback, useCapture){
    var self = this,
        isMouseEvent = Util.inArray(eventName, MouseEvent.nameList) == -1,
        isKeyBoardEvent = Util.inArray(eventName, KeyBoardEvent.nameList) == -1;

    EventDispatcher.prototype.on.apply(self,[self,eventName,callback,useCapture]);

    if(
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
};

Base.inherit(InteractiveObject,DisplayObject);