"use strict";

var Util = {
	isType: function isType(target, type) {
		return Object.prototype.toString.call(target) == "[object " + type + "]";
	},
	each: function each(arr, callback) {
		if (arr && arrProto.forEach) {
			arrProto.forEach.call(arr, callback);
		} else if (undefined.isType("Array", arr)) {
			for (var i = 0, len = arr.length; i < len; i++) {
				callback(arr[i], i, arr);
			}
		}
	}
};
