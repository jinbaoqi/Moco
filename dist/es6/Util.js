"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
	function Util() {
		_classCallCheck(this, Util);
	}

	_createClass(Util, null, [{
		key: "isType",
		value: function isType(target, type) {
			return Object.prototype.toString.call(target) == "[object " + type + "]";
		}
	}, {
		key: "each",
		value: function each(arr, callback) {
			if (arr && arrProto.forEach) {
				arrProto.forEach.call(arr, callback);
			} else if (this.isType("Array", arr)) {
				for (var i = 0, len = arr.length; i < len; i++) {
					callback(arr[i], i, arr);
				}
			}
		}
	}, {
		key: "deg2rad",
		value: function deg2rad(deg) {
			return deg * Math.PI / 180;
		}
	}, {
		key: "keys",
		value: function keys(obj) {
			var keys = [];

			if (obj) {
				if (Object.keys) {
					return Object.keys(obj);
				} else {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							keys.push(key);
						}
					}
				}
			}

			return keys;
		}
	}, {
		key: "inArray",
		value: function inArray(item, arr, fn) {
			if (Array.prototype.inArray) {
				return Array.prototype.inArray.call(arr, item);
			} else {
				for (var i = 0, len = arr.length; i < len; i++) {
					if (typeof fn == "function") {
						if (fn.call(item, item, arr[i], i, arr)) {
							return i;
						}
					} else if (arr[i] == item) {
						return i;
					}
				}

				return -1;
			}
		}
	}, {
		key: "clone",
		value: function clone(obj) {
			var _me = this;

			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object") {
				return obj;
			}

			return _me.isType(obj, "Array") ? Array.prototype.slice.call(obj) : _me.extends({}, obj);
		}
	}]);

	return Util;
}();

Moco.Util = Util;
