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
    this.parent = null;
    this.globalCompositeOperation = "";
    this.x = 0;
    this.y = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.visible = true;
    this.aIndex = this.objectIndex = "" + (guid++);
    this._saveFlag = false;
}

DisplayObject.prototype.show = function (cord) {
    var self = this,
        rotateFlag = Math.PI / 180,
        canvas = self.ctx || self.stage.ctx;

    if (!self.visible) {
        return;
    }

    if (self.parent && self.parent instanceof Stage) {
        cord.ox = self.x;
        cord.oy = self.y;
    } else {
        cord.x += self.x;
        cord.y += self.y;
    }

    cord.scaleX *= self.scaleX;
    cord.scaleY *= self.scaleY;

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

    //TODO:mask在graphics下由于不resize(涉及到复杂图形面积)，因此不起作用，暂时没想到好的解决办法
    if (self.mask != null && self.mask.show) {
        self.mask.show();
        canvas.clip();
    }

    if (self.alpha < 1) {
        canvas.globalAlpha = self.alpha > 1 ? 1 : self.alpha;
    }

    if (self.globalCompositeOperation != "") {
        canvas.globalCompositeOperation = self.globalCompositeOperation;
    }

//    if (self.rotate != 0) {
//        canvas.translate(cord.x, cord.y);
//        canvas.rotate(self.rotate * rotateFlag);
//        canvas.translate(-cord.x, -cord.y);
//    }

    if (self.translateX != 0 || self.translateY != 0) {
        canvas.translate(self.translateX, self.translateY);
    }

    if (self.scaleX != 1 || self.scaleY != 1) {
        canvas.scale(self.scaleX, self.scaleY);
    }
};

DisplayObject.prototype.isMouseon = function (cord, pos) {
    var self = this;

    if (!self.visible || self.alpha < 0.01) {
        return false;
    }

    pos = self._getOffset();

    return pos;
};

DisplayObject.prototype.dispose = function () {
    var self = this,
        eventName = Util.keys(self.handlers),
        parent = self.parent,
        childList = self._childList;

    if (childList && childList.length) {
        Util.each(childList, function (item) {
            if (item.graphics) {
                item.graphics.dispose();
                item.graphics = null;
            }
            item.dispose();
        });
    }

    self.off(eventName);

    if (parent && parent.removeChild) {
        parent.removeChild(self);
    }
};

DisplayObject.prototype._getOffset = function () {
    var self = this,
        parents = [],
        parent = self,
        tmp = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        }, i;

    while (parent = parent.parent) {
        parents.push(parent);
    }

    for (i = parents.length - 1; i >= 0; i--) {
        parent = parents[i];

        if (parent.parent instanceof Stage) {
            tmp.x += parent.x + parent.translateX;
            tmp.y += parent.y + parent.translateY;
        } else {
            tmp.x += (parent.x + parent.translateX) * tmp.scaleX;
            tmp.y += (parent.y + parent.translateY) * tmp.scaleY;
        }

        tmp.scaleX *= parent.scaleX;
        tmp.scaleY *= parent.scaleY;
    }

    return tmp;
};

DisplayObject.prototype._getRotateCord = function (cord, pos, angle) {
    var ox = cord.x - pos.x,
        oy = cord.y - pos.y;

    angle = angle * Math.PI / 180;

    return {
        x: Math.cos(angle) * ox + Math.sin(angle) * oy + pos.x,
        y: Math.cos(angle) * oy - Math.sin(angle) * ox + pos.y
    }
};

Base.inherit(DisplayObject, EventDispatcher);
