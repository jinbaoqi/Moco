

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vec3 = function () {
	function Vec3(x, y, z) {
		_classCallCheck(this, Vec3);

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	_createClass(Vec3, [{
		key: "distance",
		value: function distance() {
			var x = this.x;
			var y = this.y;
			var z = this.z;

			return Math.sqrt(x * x + y * y + z * z);
		}
	}, {
		key: "multi",
		value: function multi(k) {
			if (k instanceof Vec3) {
				var x = k.x;
				var _y = k.y;
				var _z = k.z;


				return this.x * x + this.y * _y + this.z * _z;
			} else {
				var _x = y = z = k;

				this.x *= _x;
				this.y *= y;
				this.z *= z;
			}

			return this;
		}
	}, {
		key: "divi",
		value: function divi(k) {
			if (k instanceof Vec3) {
				var x = k.x;
				var y = k.y;
				var z = k.z;


				return this.x / x + this.y / y + this.z / z;
			} else {
				var _x2 = y = z = k;

				this.x /= _x2;
				this.y /= y;
				this.z /= z;
			}

			return this;
		}
	}, {
		key: "add",
		value: function add(vec3) {
			this.x += vec3.x;
			this.y += vec3.y;
			this.z += vec3.z;
			return this;
		}
	}, {
		key: "sub",
		value: function sub(vec3) {
			var clone = Vec3.clone(vec3);
			clone.multi(-1);
			this.add(clone);
			return this;
		}
	}]);

	return Vec3;
}();

Vec3.zero = function () {
	return new Vec3(0, 0, 0);
};

Vec3.clone = function (vec3) {
	return new Vec3(vec3.x, vec3.y, vec3.z);
};

Vec3.angle = function (v1, v2) {
	var c1 = Vec3.clone(v1);
	var c2 = Vec3.clone(v2);
	var rad = c1.multi(c2) / (v1.distance() * v2.distance());
	return Math.acos(rad);
};

Vec3.proj = function (v1, v2) {
	var v = Vec3.clone(v2);
	var distance = v.distance();
	var vii = v.multi(Vec3.zero().add(v1).multi(v) / (distance * distance));
	return v1.sub(vii);
};

Vec3.norm = function (vec3) {
	var clone = Vec3.clone(vec3);
	var distance = clone.distance();
	if (distance) {
		return clone.multi(1 / distance);
	} else {
		throw new Exception("zero vec3 can't be norm");
	}
};

Moco.Vec3 = Vec3;
