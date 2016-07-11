import Matrix3 from './Matrix3';

export default class BitmapData {
    constructor(width, height) {
        this._ctx = null;
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
        let _me = this;
        if (_me._locked) {
            return;
        }

        if (!(source instanceof Image || (source instanceof Node && source.nodeName.toUpperCase() === 'CANVAS'))) {
            return;
        }

        let canvas = document.createElement('CANVAS');
        canvas.width = source.width;
        canvas.height = source.height;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        this._source = canvas;
        this._ctx = canvas.getContext('2d');

        if (matrix instanceof Matrix3) {
            this._matrix.multi(matrix);
        }
    }

    getPixel(x, y) {
        let _me = this;
        if (!_me._ctx || x > _me.width || y > _me.height) {
            return new ImageData(new Uint8ClampedArray(new Array(4), 0, 4), 1, 1); // jshint ignore:line
        }

        let imageData = _me._ctx.getImageData(x, y, 1, 1);
        let data = imageData.data;
        return new ImageData(new Uint8ClampedArray([data[0], data[1], data[2], 0], 0, 4), 1, 1); // jshint ignore:line
    }

    getPixel32(x, y) {
        let _me = this;

        if (!_me._ctx || x > _me.width || y > _me.height) {
            return new ImageData(new Uint8ClampedArray([0, 0, 0, 0], 0, 4), 1, 1); // jshint ignore:line
        }

        return _me._ctx.getImageData(x, y, 1, 1);
    }

    getPixels(x, y, width, height) {
        let _me = this;

        if (!_me._ctx || x > _me.width || y > _me.height) {
            return new ImageData(new Uint8ClampedArray([0, 0, 0, 0], 0, 4), 1, 1); // jshint ignore:line
        }

        width = x + width > _me.width ? _me.width - x : width;
        height = y + height > _me.height ? _me.height : height;

        return _me._ctx.getImageData(x, y, width, height);
    }

    setPixel(x, y, imageData) {
        let _me = this;
        let _ctx = _me._ctx;

        if (_me._locked || !_ctx || !imageData) {
            return;
        }

        let tmp = _me.getPixels(x, y, 1, 1);
        tmp.data[0] = imageData.data[0];
        tmp.data[1] = imageData.data[1];
        tmp.data[2] = imageData.data[2];
        _ctx.putImageData(tmp, x, y, 0, 0, 1, 1);
    }

    setPixel32(x, y, imageData) {
        let _me = this;
        let _ctx = _me._ctx;

        if (_me._locked || !_ctx || !imageData) {
            return;
        }

        let tmp = _me.getPixels(x, y, 1, 1);
        tmp.data[0] = imageData.data[0];
        tmp.data[1] = imageData.data[1];
        tmp.data[2] = imageData.data[2];
        tmp.data[3] = imageData.data[3];
        _ctx.putImageData(tmp, x, y, 0, 0, 1, 1);
    }

    setPixels(x, y, width, height, imageData) {
        let _me = this;
        let _ctx = _me._ctx;

        if (_me._locked || !_ctx || x > _me.width || y > _me.height || !imageData) {
            return;
        }

        width = x + width > _me.width ? _me.width - x : width;
        height = y + height > _me.height ? _me.height : height;

        let tmp = _me.getPixels(x, y, width, height);
        for (var i = 0, len = imageData.data.length; i < len; i += 1) {
            tmp.data[i] = imageData.data[i];
        }

        _ctx.putImageData(tmp, x, y, x, y, width, height);
    }

    lock() {
        this._locked = true;
    }

    unlock() {
        this._locked = false;
    }
}