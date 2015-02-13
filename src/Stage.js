
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