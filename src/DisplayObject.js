/**
 * Display显示对象抽象类
 */

function DisplayObject() {
    EventDispatcher.call(this);

    this.name = "DisplayObject";
    this.alpha = 1;
    this.height = 0;
    this.width = 0;
    this.mask = null;
    this.rotate = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.center = null;
    this.parent = null;
    this.globalCompositeOperation = "";
    this.x = 0;
    this.y = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.visible = true;
    this.aIndex = this.objectIndex = ""+(guid++);
    this._saveFlag = false;
}

DisplayObject.prototype.show = function () {
    var self = this,
        rotateFlag = Math.PI / 180,
        canvas = self.stage.ctx;

    if (!self.visible) {
        return;
    }

    if (
        (self.mask != null && self.mask.show) ||
        self.alpha < 1 ||
        self.rotate != 0 ||
        self.scaleX != 1 ||
        self.scaleY != 1 ||
        self.translateX != 0 ||
        self.translateY != 0 ||
        self.globalCompositeOperation != ""
    ) {
        self._saveFlag = true;
        canvas.save();
    }

    //TODO:mask在graphics下由于不resize，因此不起作用，暂时没想到好的解决办法
    if (self.mask != null && self.mask.show) {
        self.mask.show();
        canvas.clip();
    }

    if (self.alpha <= 1) {
        canvas.globalAlpha = self.alpha > 1 ? 1 : self.alpha;
    }

    if (self.globalCompositeOperation != "") {
        canvas.globalCompositeOperation = self.globalCompositeOperation;
    }

    if (self.rotate != 0) {
        if (self.center == null) {
            self.getRotateXY();
        }
        canvas.translate(self.x + self.center.x, self.y + self.center.y);
        canvas.rotate(self.rotate * rotateFlag);
        canvas.translate(-(self.x + self.center.x), -(self.y + self.center.y));
    }

    if (self.scaleX != 1 || self.scaleY != 1) {
        canvas.scale(self.scaleX, self.scaleY);
    }

    if (self.translateX != 0 || self.translateY != 0) {
        canvas.translate(self.translateX, self.translateY);
    }
};

DisplayObject.prototype.getRotateXY = function () {
    var self = this;
    self.center = {
        x: 0,
        y: 0
    };
};

DisplayObject.prototype.isMouseon = function (cord) {
        var self = this;

        if (self.visible == false || self.alpha <= 0.01) {
            return false;
        }

        if (
                cord.x >= self.x &&
                cord.x <= self.x + self.width &&
                cord.y >= self.y &&
                cord.y <= self.y + self.height
            ) {
            return true;
        }

        return false;
};

DisplayObject.prototype.dispose = function(){
    var self = this,
        eventName = Util.keys(self.handlers),
        parent = self.parent;

    self.off(eventName);

    if(parent && parent.removeChild){
        parent.removeChild(self);
    }
};

Base.inherit(DisplayObject, EventDispatcher);
