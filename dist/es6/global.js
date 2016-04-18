'use strict';

var fnRegExp = /\s+/g;
var guid = 0;

var lastTime = 0;
var vendors = ['webkit', 'moz'];
var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;
var i = vendors.length;

while (--i >= 0 && !requestAnimationFrame) {
	requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
	cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
}

if (!requestAnimationFrame || !cancelAnimationFrame) {
	requestAnimationFrame = function requestAnimationFrame(callback) {
		var now = +new Date(),
		    nextTime = Math.max(lastTime + 16, now);
		return setTimeout(function () {
			callback(lastTime = nextTime);
		}, nextTime - now);
	};

	cancelAnimationFrame = clearTimeout;
}

var raf = requestAnimationFrame;
var craf = cancelAnimationFrame;
