/**
 * DisplayContainer显示容器抽象类
 */

function DisplayObjectContainer() {
    DisplayObject.call(this);

    this.name = "DisplayObjectContainer";
    this._childList = [];
}

DisplayObjectContainer.prototype.addChild = function (obj) {
    var self = this;

    if (obj instanceof DisplayObject) {
        self._childList.push(obj);
        obj.parent = self;
        obj.objectIndex = self.objectIndex + "." + self._childList.length;
    }
};

DisplayObjectContainer.prototype.removeChild = function (obj) {
    var self = this,
        item;

    if (obj instanceof DisplayObject) {
        for (var i = self._childList.length - 1; i >= 0; i--) {
            item = self._childList[i];
            if (item.aIndex == obj.aIndex) {
                arrProto.splice.call(self._childList, i, 1);
            }
        }
    }
};

DisplayObjectContainer.prototype.getChildAt = function (index) {
    var self = this,
        len = self._childList.length;

    if (Math.abs(index) > len) {
        return;
    } else if (index < 0) {
        index = len + index;
    }

    return self._childList[index];
};

DisplayObjectContainer.prototype.contains = function (obj) {
    var self = this;

    if (obj instanceof DisplayObject) {
        return Util.inArray(self._childList, obj, function (obj, item) {
            return obj.aIndex == item.aIndex;
        }) == -1 ? false : true;
    }
};

DisplayObjectContainer.prototype.show = function (cord) {
    var self = this,
        item;

    if (cord == null) {
        cord = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    DisplayObject.prototype.show.call(self, cord);

    for (var i = 0, len = self._childList.length; i < len; i++) {
        item = self._childList[i];

        if (item.show) {
            item.show(cord);
        }
    }
};

Base.inherit(DisplayObjectContainer, InteractiveObject);