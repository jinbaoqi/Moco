class DisplayObjectContainer extends InteractiveObject {
    constructor() {
        super();
        this.name = "DisplayObjectContainer";
        this._childList = [];
    }

    addChild(child) {
        let _me = this;
        if (child instanceof DisplayObject) {
            let isNotExists = Util.inArray(child, _me._childList, (child, item) => {
                    return child.aIndex == item.aIndex;
                }) == -1;

            if (isNotExists) {
                child.parent = _me;
                child.stage = child.stage ? child.stage : _me.stage;
                child.objectIndex = _me.objectIndex + "." + (_me._childList.length + 1);
                _me._childList.push(child);
            }
        }
    }

    removeChild(child) {
        let _me = this;
        if (child instanceof DisplayObject) {
            for (let i = _me._childList.length - 1; i >= 0; i--) {
                let item = _me._childList[i];
                if (item.aIndex == child.aIndex) {
                    item.parent = null;
                    item.stage = null;
                    Array.prototype.splice.call(_me._childList, i, 1);
                    break;
                }
            }
        }
    }

    getAllChild() {
        let _me = this;
        return Util.clone(_me._childList);
    }

    getChildAt(index) {
        let _me = this;
        let len = _me._childList.length;

        if (Math.abs(index) > len) {
            return;
        } else if (index < 0) {
            index = len + index;
        }

        return _me._childList[index];
    }

    contains(child) {
        let _me = this;
        if (child instanceof DisplayObject) {
            return Util.inArray(child, _me._childList, function (child, item) {
                    return child.aIndex == item.aIndex;
                }) != -1;
        }
    }

    show(matrix) {
        let _me = this;

        if (matrix == null) {
            matrix = Matrix3.clone(_me._matrix);
        }

        let isDrew = super.show(matrix);

        if (isDrew) {
            for (let i = 0, len = _me._childList.length; i < len; i++) {
                let item = _me._childList[i];
                if (item.show) {
                    item.show(_me._matrix);
                }
            }

            if (_me._isSaved) {
                let ctx = _me.ctx || _me.stage.ctx;
                _me._isSaved = false;
                ctx.restore();
            }
        }

        return isDrew;
    }

    isMouseon(cord) {
        let _me = this;

        for (let i = 0, len = _me._childList.length; i < len; i++) {
            let item = _me._childList[i];
            if (item.isMouseon && item.isMouseon(cord)) {
                return true;
            }
        }

        return false;
    }

    getBounds() {
        let _me = this;
        let childList = _me._childList;
        let sv = Vec3.clone(maxNumberVec3);
        let ev = Vec3.clone(minNumberVec3);

        Util.each(childList, (child) => {
            if (typeof child.getBounds == "function") {
                let bounds = child.getBounds();
                sv.x = bounds.sv.x < sv.x ? bounds.sv.x : sv.x;
                sv.y = bounds.sv.y < sv.y ? bounds.sv.y : sv.y;
                ev.x = bounds.ev.x > ev.x ? bounds.ev.x : ev.x;
                sv.x = bounds.ev.y > ev.y ? bounds.ev.y : ev.y;
            }
        });

        if (sv.x == maxNumber || ev.x == minNumber || sv.y == maxNumber || ev.y == minNumber) {
            sx = sy = ex = ey = Vec3.zero();
        }

        return {
            sv: sv,
            ev: ev
        }
    }

    _getWidth() {
        let _me = this;
        let bounds = _me.getBounds();
        return Math.abs(bounds.ev.x - bounds.sv.x);
    }

    _getHeight() {
        let _me = this;
        let bounds = _me.getBounds();
        return Math.abs(bounds.ev.y - bounds.sv.y);
    }
}

Moco.DisplayObjectContainer = DisplayObjectContainer;