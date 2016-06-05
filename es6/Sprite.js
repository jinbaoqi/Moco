class Sprite extends DisplayObjectContainer {
    constructor() {
        super();
        this.name = "Sprite";
        this.graphics = null;
    }

    addChild(child) {
        if (child instanceof Shape) {
            console.error("shape object should be linked to Sprite's graphics property");
        } else {
            super.addChild(child);
        }
    }

    removeChild(child) {
        if (child instanceof Shape) {
            console.error("shape object should be linked to Sprite's graphics property");
        } else {
            super.removeChild(child);
        }
    }

    show(matrix) {
        let _me = this;
        let isDrew = super.show(matrix);

        if (isDrew) {
            if (_me.graphics && _me.graphics.show) {
                DisplayObject.prototype.show.call(_me, matrix);
                _me.graphics.show(_me._matrix);
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
        let isOn = super.isMouseon(cord);

        if (!isOn && _me.graphics && _me.graphics instanceof Shape) {
            isOn = _me.graphics.isMouseon && _me.graphics.isMouseon(cord);
        }

        return isOn;
    }

    _getWidth() {
        let _me = this;
        let bounds = super.getBounds();
        let shapeBounds = null;

        if (_me.graphics instanceof Shape) {
            shapeBounds = _me.graphics.getBounds();
        }

        if (shapeBounds) {
            bounds.sv.x = bounds.sv.x < shapeBounds.sv.x ? bounds.sv.x : shapeBounds.sv.x;
            bounds.ev.x = bounds.ev.x > shapeBounds.ev.x ? bounds.ev.x : shapeBounds.ev.x;
        }

        return Math.abs(bounds.ev.x - bounds.sv.x);
    }

    _getHeight() {
        let _me = this;
        let bounds = super.getBounds();
        let shapeBounds = null;

        if (_me.graphics instanceof Shape) {
            shapeBounds = _me.graphics.getBounds();
        }

        if (shapeBounds) {
            bounds.sv.y = bounds.sv.y < shapeBounds.sv.y ? bounds.sv.y : shapeBounds.sv.y;
            bounds.ev.y = bounds.ev.y > shapeBounds.ev.y ? bounds.ev.y : shapeBounds.ev.y;
        }

        return Math.abs(bounds.ev.y - bounds.sv.y);
    }
}

Moco.Sprite = Sprite;