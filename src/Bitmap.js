import DisplayObject from './DisplayObject';
import Global from './Global';
import Util from './Util';
import Vec3 from './Vec3';
import Matrix3 from './Matrix3';

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
        let isDrew = super.show(matrix);
        if (!isDrew) {
            return isDrew;
        }

        let _me = this;
        let ctx = _me.ctx || _me.stage.ctx;
        let bitmapData = _me._bitmapData;
        let source = bitmapData._source;

        if (source) {
            matrix = bitmapData._matrix.getMatrix();
            ctx.transform(matrix[0], matrix[1], matrix[3], matrix[4], matrix[6], matrix[7]);
            ctx.drawImage(source, 0, 0);
        }

        ctx.restore();

        return isDrew;
    }

    isMouseOn(cord) {
        let _me = this;
        let vec = new Vec3(cord.x, cord.y, 1);
        let matrix = _me._matrix.multi(_me._bitmapData._matrix);
        let inverse = Matrix3.inverse(matrix);
        let area = [
            [0, 0],
            [_me.width, 0],
            [_me.width, _me.height],
            [0, _me.height]
        ];

        vec.multiMatrix3(inverse);
        return Util.pip([vec.x, vec.y], area);
    }

    getBounds() {
        let _me = this;
        let sx = Global.maxNumber;
        let ex = Global.minNumber;
        let sy = Global.maxNumber;
        let ey = Global.minNumber;
        let area = [
            [0, 0],
            [_me.width, 0],
            [_me.width, _me.height],
            [0, _me.height]
        ];

        let matrix = _me._matrix.multi(_me._bitmapData._matrix);
        let vec3s = Util.map(area, (item) => {
            let vec = new Vec3(item[0], item[1], 1);
            return vec.multiMatrix3(matrix);
        });

        Util.each(vec3s, (item) => {
            sx = item.x < sx ? item.x : sx;
            ex = item.x > ex ? item.x : ex;
            sy = item.y < sy ? item.y : sy;
            ey = item.y > ey ? item.y : ey;
        });

        if (sx === Global.maxNumber ||
            ex === Global.minNumber ||
            sy === Global.maxNumber ||
            ey === Global.minNumber) {
            sx = sy = ex = ey = 0;
        }

        return {
            sv: new Vec3(sx, sy, 1),
            ev: new Vec3(ex, ey, 1)
        };
    }

    get width() {
        return this._bitmapData.width;
    }

    get height() {
        return this._bitmapData.height;
    }
}