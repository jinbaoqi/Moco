class BitmapData {
    constructor(width, height) {
        this._source = null;
        this._matrix = Matrix3.identity();
        this._locked = false;
        this.width = width || 0;
        this.height = height || 0;
        this.rect = {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        };
    }

    clone() {
        let bmd = new BitmapData(this.width, this.height);
        bmd.draw(this._source, this._matrix);
        return bmd;
    }

    copyChannel(sourceBitmapData, sourceRect, destPoint, sourceChannel, destChannel) {

    }

    copyPixels(sourceBitmapData, sourceRect, destPoint) {

    }

    copyPixelsToByteArray(rect, data) {

    }

    dispose() {
        this._source = null;
        this._matrix = Matrix3.identity();
        this._locked = false;
        this.width = 0;
        this.height = 0;
        this.rect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }

    draw(source, matrix) {
        var _me = this;
        if (_me._locked) {
            return;
        }

        if (!(source instanceof Image || (source instanceof Node && source.nodeName.toUpperCase() == "CANVAS"))) {
            return;
        }

        let canvas = document.createElement("CANVAS");
        canvas.width = source.width;
        canvas.height = source.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(source, 0, 0);
        this._source = canvas;

        if (matrix instanceof Matrix3) {
            this._matrix.multi(matrix);
        }
    }

    getPixel(x, y) {

    }

    getPixel32(x, y) {

    }

    getPixels(rect) {

    }

    getVector(rect) {

    }

    setPixel(x, y, color) {
        var _me = this;
        if (_me._locked) {
            return;
        }
    }

    setPixel32(x, y, color) {
        var _me = this;
        if (_me._locked) {
            return;
        }
    }

    setPixels(rect, inputByteArray) {
        var _me = this;
        if (_me._locked) {
            return;
        }
    }

    setVector(rect, inputVector) {
        var _me = this;
        if (_me._locked) {
            return;
        }
    }

    lock() {
        this._locked = true;
    }

    unlock() {
        this._locked = false;
    }
}

Moco.BitmapData = BitmapData;