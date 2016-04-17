let Util = {
	isType: (target, type) => {
		return Object.prototype.toString.call(target) == "[object " + type + "]";
	},
	each: (arr, callback) => {
		if (arr && arrProto.forEach) {
			arrProto.forEach.call(arr, callback);
		} else if (this.isType("Array", arr)) {
			for (var i = 0, len = arr.length; i < len; i++) {
				callback(arr[i], i, arr);
			}
		}
	},
	deg2rad: (deg) => {
		return deg * Math.PI / 180;
	},
	keys: (obj) => {
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
}