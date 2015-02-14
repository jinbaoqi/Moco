/**
 * Shape绘图类
 */

function Shape(){
    DisplayObject.call(this);

    this.name = "Shape";
    this._showList = [];
}

Shape.prototype.show = function(){
    var self = this,
        showList = self._showList,
        len = showList.length;

    if(len == 0){
        return;
    }

    for(var i = 0; i < len; i++){
        showList[i]();
    }
};

Shape.prototype.lineWidth = function(thickness){
    var self = this;
    self._showList.push (function(){
    });
};

Shape.prototype.strokeStyle = function(color){
    var self = this;
    self._showList.push (function(){
    });
};

Shape.prototype.stroke = function(){
    var self = this;
    self._showList.push (function () {

    });
};

Shape.prototype.beginPath = function(){
    var self = this;
    self._showList.push (function () {
    });
};

Shape.prototype.closePath = function(){
    var self = this;
    self._showList.push (function () {
    });
};

Shape.prototype.moveTo = function(x, y){
    var self = this;
    self._showList.push (function () {
    });
};

Shape.prototype.lineTo = function(x, y){
    var self = this;
    self._showList.push (function(){
    });
};


Base.inherit(Shape,DisplayObject);