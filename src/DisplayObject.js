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
    this.parent = null;
    this.visible = true;
    this.aIndex = this.objectIndex = "" + (guid++);
    this._saveFlag = false;
}

DisplayObject.prototype.show = function (cord) {
    var self = this,
        rotateFlag = Math.PI / 180,
        canvas = self.ctx || self.stage.ctx,
        ox, oy;

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

    if (self.translateX != 0 || self.translateY != 0) {
        canvas.translate(self.translateX, self.translateY);
    }

    if (self.scaleX != 1 || self.scaleY != 1) {
        canvas.scale(self.scaleX, self.scaleY);
    }

    if (self.rotate != 0) {
        ox = cord.x + cord.ox / cord.scaleX;
        oy = cord.y + cord.oy / cord.scaleY;
        
        canvas.translate(ox, oy);
        canvas.rotate(self.rotate * rotateFlag);
        canvas.translate(-ox, -oy);
    }
};

DisplayObject.prototype.isMouseon = function (cord, pos) {
    var self = this;

    if (!self.visible || self.alpha < 0.01) {
        return false;
    }

    if (pos == null) {
        pos = self._getOffset();
    } else {
        pos = DisplayObject.prototype._getActualOffset(pos, self);
    }

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

    while (parent) {
        parents.push(parent);
        parent = parent.parent;
    }

    for (i = parents.length - 1; i >= 0; i--) {
        parent = parents[i];
        tmp = self._getActualOffset(tmp, parent);
    }

    return tmp;
};

DisplayObject.prototype._getRotateCord = function (cord) {
    var self = this,
        parents = [],
        parent = self,
        tmp = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        }, i, ox, oy, rad;

    while (parent) {
        parents.push(parent);
        parent = parent.parent;
    }

    for (i = parents.length - 1; i >= 0; i--) {
        parent = parents[i];

        tmp = self._getActualOffset(tmp, parent);

        ox = cord.x - tmp.x;
        oy = cord.y - tmp.y;
        rad = parent.rotate * Math.PI / 180;

        cord = {
            x: Math.cos(rad) * ox + Math.sin(rad) * oy + tmp.x,
            y: Math.cos(rad) * oy - Math.sin(rad) * ox + tmp.y
        };
    }

    return cord;
};

DisplayObject.prototype._getActualOffset = function (offset, parent) {

    offset.scaleX *= parent.scaleX;
    offset.scaleY *= parent.scaleY;

    if (parent.parent instanceof Stage) {
        offset.x += parent.x + parent.translateX;
        offset.y += parent.y + parent.translateY;
    } else {
        offset.x += (parent.x + parent.translateX) * offset.scaleX;
        offset.y += (parent.y + parent.translateY) * offset.scaleY;
    }

    return offset;
};


Base.inherit(DisplayObject, EventDispatcher);
