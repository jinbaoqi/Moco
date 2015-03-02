/**
 * Sprite精灵类，继承自DisplayContaianer
 */

function Sprite() {
    DisplayObjectContainer.call(this);

    this.name = "Sprite";
    this.graphics = null;
}

Sprite.prototype.show = function (cord) {
    var self = this;

    if (cord == null) {
        cord = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    DisplayObjectContainer.prototype.show.call(self, cord);

    if (self.graphics && self.graphics.show) {
        self.graphics.show(cord);
    }

    if (self._saveFlag) {
        self.stage.ctx.restore();
    }
};

Sprite.prototype.addChild = function (obj) {
    var self = this;
    DisplayObjectContainer.prototype.addChild.call(self, obj);
    self._resize();
};

Sprite.prototype.removeChild = function (obj) {
    var self = this;
    DisplayObjectContainer.prototype.removeChild.call(self, obj);
    self._resize();
};

Sprite.prototype.getWidth = function () {
    var self = this,
        w = 0,
        w1 = 0;

    Util.each(self._childList, function (item) {
        if (item.getWidth) {
            w1 = item.getWidth();
            w = w < w1 ? w1 : w;
        }
    });

    return w;
};

Sprite.prototype.getHeight = function () {
    var self = this,
        w = 0,
        w1 = 0;

    Util.each(self._childList, function (item) {
        if (item.getWidth) {
            w1 = item.getHeight();
            w = w < w1 ? w1 : w;
        }
    });

    return w;
};

Sprite.prototype._resize = function () {
    var self = this,
        sx = 0,
        sy = 0,
        ex = 0,
        ey = 0,
        item;

    for (var i = 0; i < self._childList.length; i++) {
        item = self._childList[i];

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

Sprite.prototype.isMouseon = function (cord, pos) {
    var self = this,
        isOn = false,
        i, len, item;

    if(pos == null){
        pos = {
            x:0,
            y:0,
            scaleX: 1,
            scaleY: 1
        };
    }

    pos = DisplayObject.prototype.isMouseon.call(self, cord, pos);
    cord = self._getRotateCord(cord, pos, self.rotate);

    pos = {
        x: self.x + pos.x + self.translateX,
        y: self.y + pos.y + self.translateY,
        scaleX: self.scaleX * pos.scaleX,
        scaleY: self.scaleY * pos.scaleY
    };

    for (i = 0, len = self._childList.length; i < len; i++) {
        item = self._childList[i];

        if (item.isMouseon) {
            isOn = item.isMouseon(cord, pos);
        }

        if (isOn) {
            return true;
        }
    }

    if (!isOn && self.graphics && self.graphics.isMouseon) {
        isOn = self.graphics.isMouseon(cord, pos);
    }

    return isOn;
};

Base.inherit(Sprite, DisplayObjectContainer);