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
    this.mouseX = 0;
    this.mouseY = 0;
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
