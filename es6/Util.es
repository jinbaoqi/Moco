class Util {
	static isType(target, type) {
		return Object.prototype.toString.call(target) == "[object " + type + "]";
	}

	static each(arr, callback) {
		if (arr && arrProto.forEach) {
			arrProto.forEach.call(arr, callback);
		} else if (this.isType("Array", arr)) {
			for (var i = 0, len = arr.length; i < len; i++) {
				callback(arr[i], i, arr);
			}
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
		if (Array.prototype.inArray) {
			return Array.prototype.inArray.call(arr, item);
		} else {
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