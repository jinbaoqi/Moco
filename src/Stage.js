
/**
 * Stage全局画布类
 */

function Stage(canvasId,fn){
    DisplayObjectContainer.call(this);

    this.name = "Stage";
    this.domElem = document.getElementById(canvasId);
    this.width = parseFloat(this.domElem.getAttribute("width"),10);
    this.height = parseFloat(this.domElem.getAttribute("height"),10);
    this.offset = this._getOffset(this.domElem);
    this.x = this.offset.left;
    this.y = this.offset.top;

    if(typeof fn == "function"){
        fn.call(self);
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
    })

    self.show();
};

Stage.prototype.show = function(){
    var self = this,
        item;

    for(var i = 0,len = self._childList.length; i < len; i++){
        item = self._childList[i];

        if(item.show){
            item.show();
        }
    }

    raf(function(){
        self.show();
    });
}

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