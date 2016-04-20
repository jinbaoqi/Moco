class Timer {
	static add(timerObject) {
		let _me = this;
		let index = Util.inArray(timerObject, _me._list, (obj, item) => {
			return obj.aIndex == item.aIndex;
		});

		if (index == -1) {
			_me._list.push(timerObject);
		}

		return _me;
	}

	static remove(timerObject) {
		let _me = this;
		let index = Util.inArray(timerObject, _me._list, (obj, item) => {
			return obj.aIndex == item.aIndex;
		});

		if (index != -1) {
			_me._list.splice(index, 1);
		}

		return _me;
	}

	static start() {
		let _me = this;
		_me.isStoped = false;

		if (!_me._isInit) {
			_me._init();
		}

		_me._raf();

		return _me;
	}

	static stop() {
		let _me = this;
		_me.isStoped = true;

		if (!_me._isInit) {
			_me._init();
		}

		_me._craf();

		return _me;
	}

	static _init() {
		let _me = this;
		let lastTime = 0;
		let vendors = ['webkit', 'moz'];
		let requestAnimationFrame = window.requestAnimationFrame;
		let cancelAnimationFrame = window.cancelAnimationFrame;
		let i = vendors.length;

		while (--i >= 0 && !requestAnimationFrame) {
			requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
		}

		if (!requestAnimationFrame || !cancelAnimationFrame) {
			requestAnimationFrame = (callback) => {
				var now = +new Date(),
					nextTime = Math.max(lastTime + 16, now);
				return setTimeout(function() {
					callback(lastTime = nextTime);
				}, nextTime - now);
			};

			cancelAnimationFrame = clearTimeout;
		}

		_me._requestAnimationFrame = requestAnimationFrame;
		_me._cancelAnimationFrame = cancelAnimationFrame;
		_me._isInit = true;
	}

	static _raf() {
		let _me = this;
		let callback = () => {
			let list = _me._list;
			for (let i = 0, len = list.length; i < len; i++) {
				let item = list[i];
				if (item.tick) {
					item.tick();
				}
			}
			_me._raf();
		}

		_me._timer = _me._requestAnimationFrame.call(window, callback);
	}

	static _craf() {
		let _me = this;
		_me._cancelAnimationFrame.call(window, _me._timer);
	}
}

Timer._list = [];
Timer._isInit = false;
Timer._timer = null;
Timer._requestAnimationFrame = null;
Timer._cancelAnimationFrame = null;
Timer.isStoped = false;

Moco.Timer = Timer;