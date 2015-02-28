/**
 * Sprite精灵类，继承自DisplayContaianer
 */

function Sprite(){
    DisplayObjectContainer.call(this);

    this.name = "Sprite";
    this.graphics = null;
}

//TODO:父级的定位应该是会影响到子级的定位的
Sprite.prototype.show = function(){
    var self = this;

    DisplayObjectContainer.prototype.show.call(self);

    if(self.graphics && self.graphics.show){
        self.graphics.show();
    }

    if (self._saveFlag) {
        self.stage.ctx.restore();
    }
};

Sprite.prototype.addChild = function(obj){
    var self = this;
    DisplayObjectContainer.prototype.addChild.call(self,obj);
    self._resize();
};

Sprite.prototype.removeChild = function(obj){
    var self = this;
    DisplayObjectContainer.prototype.removeChild.call(self,obj);
    self._resize();
};

Sprite.prototype.getRotateXY = function(){

};

Sprite.prototype.getWidth = function(){
    var self = this,
        w = 0,
        w1 = 0;

    Util.each(self._childList,function(item){
        if(item.getWidth){
            w1 = item.getWidth();
            w = w < w1 ? w1 : w;
        }
    });

    return w;
};

Sprite.prototype.getHeight = function(){
    var self = this,
        w = 0,
        w1 = 0;

    Util.each(self._childList,function(item){
        if(item.getWidth){
            w1 = item.getHeight();
            w = w < w1 ? w1 : w;
        }
    });

    return w;
};

Sprite.prototype._resize = function(){
    var self = this,
        sx = 0,
        sy = 0,
        ex = 0,
        ey = 0,
        item;

    for (var i = 0; i < self._childList.length; i ++) {
        item =  self._childList[i];

        if (sx > item.x) {
            sx = item.x;
        }
        if (ex < item.width + item.x) {
            ex = item.width + item.x;
        }
        if (sy > item.y) {
            sy = item.y;
        }
        if (ey < item.height + item.y) {
            ey = item.height + item.y;
        }
    }

    self.width = ex - sx;
    self.height = ey - sy;
};

Sprite.prototype.isMouseon = function(cord){
    var self = this,
        isOn = false,
        i,len,item;

    if(!self.visible || self.alpha < 0.01){
        return false;
    }

    for(i = 0,len = self._childList.length; i < len; i++){
        item = self._childList[i];

        if(item.isMouseon){
            isOn = item.isMouseon(cord);
        }

        if(isOn){
            return true;
        }
    }

    if(!isOn && self.graphics && self.graphics.isMouseon){
        isOn = self.graphics.isMouseon(cord);
    }

    return isOn;
};

Base.inherit(Sprite,DisplayObjectContainer);