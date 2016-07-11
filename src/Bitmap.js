import DisplayObject from './DisplayObject';

export default class Bitmap extends DisplayObject {
    constructor(bitmapData) {
        if (!bitmapData) {
            console.error('bitmapData must not be empty'); // jshint ignore:line
            return;
        }

        super();
        this.name = 'Bitmap';
        this._bitmapData = bitmapData;
    }

    show(matrix) {
        let isShow = super.show(matrix);
        if (!isShow) {
            return isShow;
        }

        let _me = this;
        let ctx = _me.ctx || _me.stage.ctx;

        matrix = _me._bitmapData._matrix.getMatrix();

        if (_me._bitmapData._source) {
            ctx.save();
            ctx.transform(matrix[0], matrix[1], matrix[3], matrix[4], matrix[6], matrix[7]);
            ctx.drawImage(_me._bitmapData._source, 0, 0);
            ctx.restore();
        }

        ctx.restore();

        return isShow;
    }
}