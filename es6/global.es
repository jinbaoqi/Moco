let fnRegExp = /\s+/g;
let guid = 0;

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
	requestAnimationFrame = function(callback) {
		var now = +new Date(),
			nextTime = Math.max(lastTime + 16, now);
		return setTimeout(function() {
			callback(lastTime = nextTime);
		}, nextTime - now);
	};

	cancelAnimationFrame = clearTimeout;
}

let raf = requestAnimationFrame;
let craf = cancelAnimationFrame;