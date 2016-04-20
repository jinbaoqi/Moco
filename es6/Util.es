class Util {
	static isType(target, type) {
		return Object.prototype.toString.call(target) == "[object " + type + "]";
	}

	static each(arr, callback) {
		if (arr && Array.prototype.forEach) {
			Array.prototype.forEach.call(arr, callback);
		} else if (this.isType("Array", arr)) {
			for (var i = 0, len = arr.length; i < len; i++) {
				callback(arr[i], i, arr);
			}
		}
	}

	static filter(arr, callback) {
		let _me = this;

		if (arr && Array.prototype.filter) {
			return Array.prototype.filter.call(arr, callback);
		} else {
			let tmp = [];
			_me.each(arr, function(item, index, arr) {
				if (callback.call(arr, item, index, arr) == true) {
					tmp.push(item);
				}
			});
			return tmp;
		}
	}

	static deg2rad(deg) {
		return deg * Math.PI / 180;
	}

	static keys(obj) {
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

	static inArray(item, arr, fn) {
		for (let i = 0, len = arr.length; i < len; i++) {
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

	static extends(obj) {
		var _me = this;

		if (!_me.isType(obj, "Object")) {
			return obj;
		}

		for (let i = 1, length = arguments.length; i < length; i++) {
			let source = arguments[i];
			for (let prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}

		return obj;
	}

	static clone(obj) {
		let _me = this;

		if (typeof obj != "object") {
			return obj;
		}

		return _me.isType(obj, "Array") ? Array.prototype.slice.call(obj) : _me.extends({}, obj);
	}
}

Moco.Util = Util;