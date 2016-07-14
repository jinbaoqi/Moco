import Util from './Util';
import Easing from './Easing';
import Timer from './Timer';

export default class Animate {
    static to(target, params) {
        let _me = this;

        if (!Util.isType(params, 'Object')) {
            return;
        }

        _me._addQueue({
            target: target,
            args: _me._init.call(_me, ...arguments)
        });
    }

    static from(target, params) {
        let _me = this;

        if (!Util.isType(params, 'Object')) {
            return;
        }

        for (let key in params) {
            if (params.hasOwnProperty(key) && key !== 'onComplete' && key !== 'onCompleteParam') {
                let tmp = parseFloat(target[key]);
                target[key] = params[key];
                params[key] = tmp;
            }
        }

        arguments[1] = params;

        _me._addQueue({
            target: target,
            args: _me._init.call(_me, ...arguments)
        });
    }

    static fromTo(target, fParams, tParams) {
        let _me = this;

        if (!Util.isType(tParams, 'Object') || !Util.isType(fParams, 'Object')) {
            return;
        }

        for (let key in fParams) {
            if (fParams.hasOwnProperty(key) && key !== 'onComplete' && key !== 'onCompleteParam') {
                target[key] = fParams[key];
            }
        }

        Array.prototype.splice.call(arguments, 1, 1);

        _me._addQueue({
            target: target,
            args: _me._init.call(_me, ...arguments)
        });
    }

    static remove(animator) {
        let index = Util.inArray(animator, this._animators, function (animator, item) {
            return animator === item.target;
        });

        if (index !== -1) {
            this._animators.splice(index, 1);
        }
    }

    static resume(target) {
        let _me = this;
        let index = Util.inArray(target, _me._pausedAnimators, (target, item)=> {
            return target === item.target;
        });

        if (index > -1) {
            let item = _me._pausedAnimators.splice(index, 1);
            item[0].timestamp = +new Date();
            _me._animators.push(item[0]);
            _me._animate();
        }
    }

    static pause(target) {
        let _me = this;
        let index = Util.inArray(target, _me._animators, (target, item)=> {
            return target === item.target;
        });

        if (index > -1) {
            let item = _me._animators.splice(index, 1);
            _me._pausedAnimators.push(item[0]);
        }
    }

    static start() {
        Util.each(this._animators, (animators)=> {
            animators.timestamp = +new Date();
        });
        this._animate();
    }

    static stop() {
        this._isAnimated = false;
        Timer.remove(this);
    }

    static _init(target, params) {
        let attr = {};
        let fn = null;
        let fnParams = [];
        let type = {};
        let speed = 0;
        let val = [];

        for (var item in params) {
            if (params.hasOwnProperty(item)) {
                if (item === 'onComplete') {
                    fn = params[item];
                } else if (item === 'onCompleteParam') {
                    fnParams = params[item];
                } else {
                    attr[item] = params[item];
                }
            }
        }

        type = arguments[2];
        if (typeof type === 'object' && type.a && type.b) {
            type = arguments[2] || Easing.easeInSine;
            speed = arguments[3] || 1000;
            fn = fn || arguments[3];
            fnParams = fnParams || arguments[4];
        }
        else {
            type = Easing.easeInSine;
            speed = arguments[2] || 1000;
            fn = fn || arguments[3];
            fnParams = fnParams || arguments[4];
        }

        val.push(target, attr, type, speed, fn, fnParams);

        return val;
    }

    static _addQueue(animator) {
        let target = animator.target;
        let params = animator.args[1];

        animator.shouldStop = false;
        animator.timeCount = 0;
        animator.origin = {};

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                animator.origin[key] = target[key];
            }
        }

        animator.timestamp = +new Date();
        this._animators.push(animator);
        this._animate();
    }

    static _cubicBezier(type, t) {
        let pa = {x: 0, y: 0};
        let pb = type.a;
        let pc = type.b;
        let pd = {x: 1, y: 1};

        return {
            x: pa.x * Math.pow(1 - t, 3) + 3 * pb.x * t * Math.pow(1 - t, 2) + 3 * pc.x * Math.pow(t, 2) * (1 - t) + pd.x * Math.pow(t, 3),
            y: pa.y * Math.pow(1 - t, 3) + 3 * pb.y * t * Math.pow(1 - t, 2) + 3 * pc.y * Math.pow(t, 2) * (1 - t) + pd.y * Math.pow(t, 3)
        };
    }

    static _animate() {
        let _me = this;
        if (!_me._isAnimated) {
            _me._isAnimated = true;
            Timer.add(_me);
        }
    }

    static tick() {
        let _me = this;
        let renderTime = 1000 / 60;
        if (!_me._animators.length || !_me._isAnimated) {
            _me.stop();
            return;
        }

        Util.each(_me._animators, (animator) => {
            let [target, attrs, type, speed, fn, fnParams] = animator.args;
            let timestamp = +new Date();
            let timeCount = animator.timeCount += (timestamp - animator.timestamp);
            let shouldStop = animator.shouldStop = speed - timeCount <= renderTime || timeCount > speed;
            let origin = animator.origin;
            let scale = _me._cubicBezier(type, shouldStop ? 1 : timeCount / speed);
            for (let key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    target[key] = origin[key] + (attrs[key] - origin[key]) * scale.y;
                }
            }

            if (shouldStop) {
                if (typeof fn === 'function') {
                    fn.call(target, fnParams);
                }
            }

            animator.timestamp = +new Date();
        });

        for (let i = _me._animators.length - 1; i >= 0; i -= 1) {
            if (_me._animators[i].shouldStop) {
                _me._animators.splice(i, 1);
            }
        }
    }

    static get _animators() {
        this._animators_ = this._animators_ || [];
        return this._animators_;
    }

    static get _pausedAnimators() {
        this._pausedAnimators_ = this._pausedAnimators_ || [];
        return this._pausedAnimators_;
    }

    static get _isAnimated() {
        this._isAnimated_ = this._isAnimated_ || false;
        return this._isAnimated_;
    }

    static set _isAnimated(isAnimated) {
        this._isAnimated_ = isAnimated;
    }
}