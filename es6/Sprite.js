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
        return true;
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

        let width = Math.abs(bounds.ev.x - bounds.sv.x);
        return Number.isNaN(width) ? 0 : width;
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

        let height = Math.abs(bounds.ev.y - bounds.sv.y);
        return Number.isNaN(height) ? 0 : height;
    }
}

Moco.Sprite = Sprite;