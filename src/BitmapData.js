import Matrix3 from './Matrix3';

export default class BitmapData {
    constructor(width, height) {
        let canvas = document.createElement('CANVAS');
        canvas.width = width;
        canvas.height = height;

        this._source = canvas;
        this._ctx = canvas.getContext('2d');
        this._matrix = Matrix3.identity();
        this._locked = false;
        this._imageData = null;
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

        if (
            !(source instanceof Image ||
            (source instanceof Node && source.nodeName.toUpperCase() === 'CANVAS'))
        ) {
            return;
        }

        _me.width = source.width;
        _me.height = source.height;
        _me._ctx.drawImage(source, 0, 0);
        _me._imageData = null;
        _me._locked = false;

        if (matrix instanceof Matrix3) {
            this._matrix.multi(matrix);
        }
    }

    getPixel(x, y) {
        let _me = this;
        if (!_me._ctx || x > _me.width || y > _me.height) {
            return new ImageData(new Uint8ClampedArray(new Array(4), 0, 4), 1, 1); // jshint ignore:line
        }

        let imageData = null;
        let data = null;
        if (_me._locked) {
            let index = (x * _me.width + _me.height) * 4;
            imageData = _me._imageData;
            data = imageData.data;
            return new ImageData(new Uint8ClampedArray([data[index], data[index + 1], data[index + 2], data[index + 3]], 0, 4), 1, 1); // jshint ignore:line
        } else {
            imageData = _me._ctx.getImageData(x, y, 1, 1);
            data = imageData.data;
            return new ImageData(new Uint8ClampedArray([data[0], data[1], data[2], 0], 0, 4), 1, 1); // jshint ignore:line
        }
    }

    getPixel32(x, y) {
        let _me = this;

        if (!_me._ctx || x > _me.width || y > _me.height) {
            return new ImageData(new Uint8ClampedArray([0, 0, 0, 0], 0, 4), 1, 1); // jshint ignore:line
        }

        if (_me._locked) {
            let imageData = _me._imageData;
            let data = imageData.data;
            let index = (x * _me.width + _me.height) * 4;
            return new ImageData(new Uint8ClampedArray([data[index], data[index + 1], data[index + 2], data[index + 3]], 0, 4), 1, 1); // jshint ignore:line
        } else {
            return _me._ctx.getImageData(x, y, 1, 1);
        }
    }

    getPixels(x, y, width, height) {
        let _me = this;

        if (!_me._ctx || x > _me.width || y > _me.height) {
            return new ImageData(new Uint8ClampedArray([0, 0, 0, 0], 0, 4), 1, 1); // jshint ignore:line
        }

        width = x + width > _me.width ? _me.width - x : width;
        height = y + height > _me.height ? _me.height - y : height;

        if (_me._locked) {
            let imageData = _me._imageData;
            let data = imageData.data;
            let tmp = [];
            for (let i = 0; i < height; i += 1) {
                let startIndex = (y + i) * _me.height + x;
                for (let j = 0; j < width; j += 1) {
                    let index = (startIndex + j) * 4;
                    tmp.push(data[index], data[index + 1], data[index + 2], data[index + 3]);
                }
            }
            return new ImageData(new Uint8ClampedArray(tmp, 0, tmp.length), width, height); // jshint ignore:line
        } else {
            return _me._ctx.getImageData(x, y, width, height);
        }
    }

    setPixel(x, y, imageData) {
        let _me = this;
        let _ctx = _me._ctx;

        if (!_ctx || !imageData) {
            return;
        }

        if (_me._locked) {
            let index = (x * _me.width + y) * 4;
            let data = _me._imageData.data;
            data[index] = imageData.data[0];
            data[index + 1] = imageData.data[1];
            data[index + 2] = imageData.data[2];
        } else {
            let tmp = _me.getPixels(x, y, 1, 1);
            tmp.data[0] = imageData.data[0];
            tmp.data[1] = imageData.data[1];
            tmp.data[2] = imageData.data[2];
            _ctx.putImageData(tmp, x, y, 0, 0, 1, 1);
        }
    }

    setPixel32(x, y, imageData) {
        let _me = this;
        let _ctx = _me._ctx;

        if (!_ctx || !imageData) {
            return;
        }

        if (_me._locked) {
            let index = (x * _me.width + y) * 4;
            let data = _me._imageData.data;
            data[index] = imageData.data[0];
            data[index + 1] = imageData.data[1];
            data[index + 2] = imageData.data[2];
            data[index + 3] = imageData.data[3];
        } else {
            let tmp = _me.getPixels(x, y, 1, 1);
            tmp.data[0] = imageData.data[0];
            tmp.data[1] = imageData.data[1];
            tmp.data[2] = imageData.data[2];
            tmp.data[3] = imageData.data[3];
            _ctx.putImageData(tmp, x, y, 0, 0, 1, 1);
        }
    }

    setPixels(x, y, width, height, imageData) {
        let _me = this;
        let _ctx = _me._ctx;

        if (!_ctx || x > _me.width || y > _me.height || !imageData) {
            return;
        }

        width = x + width > _me.width ? _me.width - x : width;
        height = y + height > _me.height ? _me.height - y : height;

        if (_me._locked) {
            let data = _me._imageData.data;
            for (let i = 0; i < height; i += 1) {
                let startIndex = (y + i) * _me.height + x;
                for (let j = 0; j < width; j += 1) {
                    let index = (i * height + j) * 4;
                    for (let m = 0; m < 4; m += 1) {
                        data[(startIndex + j) * 4 + m] = imageData.data[index + m];
                    }
                }
            }
        } else {
            let tmp = _me.getPixels(x, y, width, height);
            for (let i = 0; i < height; i += 1) {
                for (let j = 0; j < width; j += 1) {
                    let index = (i * height + j) * 4;
                    for (let m = 0; m < 4; m += 1) {
                        tmp.data[index + m] = imageData.data[index + m];
                    }
                }
            }

            _ctx.putImageData(tmp, x, y, 0, 0, width, height);
        }
    }

    lock() {
        let _me = this;
        _me._locked = true;
        _me._imageData = _me._ctx.getImageData(0, 0, _me.width, _me.height);
    }

    unlock() {
        let _me = this;
        _me._locked = false;
        if (_me._imageData) {
            _me._ctx.putImageData(_me._imageData, 0, 0);
        }
        _me._imageData = null;
    }
}