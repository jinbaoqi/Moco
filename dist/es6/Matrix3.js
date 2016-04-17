

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Matrix3 = function () {
	function Matrix3(m) {
		_classCallCheck(this, Matrix3);

		this._matrix = m || [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
	}

	_createClass(Matrix3, [{
		key: "setMatrix",
		value: function setMatrix(matrix) {
			this._matrix = matrix;
			return this;
		}
	}, {
		key: "getMatrix",
		value: function getMatrix() {
			return this._matrix;
		}
	}, {
		key: "add",
		value: function add(matrix3) {
			var matrix = matrix3._matrix;

			this._matrix[0] += matrix[0];
			this._matrix[1] += matrix[1];
			this._matrix[2] += matrix[2];

			this._matrix[3] += matrix[3];
			this._matrix[4] += matrix[4];
			this._matrix[5] += matrix[5];

			this._matrix[6] += matrix[6];
			this._matrix[7] += matrix[7];
			this._matrix[8] += matrix[8];

			return this;
		}
	}, {
		key: "sub",
		value: function sub(matrix3) {
			var matrix = matrix3._matrix;

			this._matrix[0] -= matrix[0];
			this._matrix[1] -= matrix[1];
			this._matrix[2] -= matrix[2];

			this._matrix[3] -= matrix[3];
			this._matrix[4] -= matrix[4];
			this._matrix[5] -= matrix[5];

			this._matrix[6] -= matrix[6];
			this._matrix[7] -= matrix[7];
			this._matrix[8] -= matrix[8];

			return this;
		}
	}, {
		key: "multi",
		value: function multi(matrix3) {
			var matrix = matrix3._matrix;

			var b00 = matrix[0];
			var b10 = matrix[1];
			var b20 = matrix[2];

			var b01 = matrix[3];
			var b11 = matrix[4];
			var b21 = matrix[5];

			var b02 = matrix[6];
			var b12 = matrix[7];
			var b22 = matrix[8];

			matrix = this._matrix;

			var a00 = matrix[0];
			var a10 = matrix[1];
			var a20 = matrix[2];

			var a01 = matrix[3];
			var a11 = matrix[4];
			var a21 = matrix[5];

			var a02 = matrix[6];
			var a12 = matrix[7];
			var a22 = matrix[8];

			matrix[0] = a00 * b00 + a01 * b10 + a02 * b20;
			matrix[1] = a10 * b00 + a11 * b10 + a12 * b20;
			matrix[2] = a20 * b00 + a21 * b10 + a22 * b20;

			matrix[3] = a00 * b01 + a01 * b11 + a02 * b21;
			matrix[4] = a10 * b01 + a11 * b11 + a12 * b21;
			matrix[5] = a20 * b01 + a21 * b11 + a22 * b21;

			matrix[6] = a00 * b02 + a01 * b12 + a02 * b22;
			matrix[7] = a10 * b02 + a11 * b12 + a12 * b22;
			matrix[8] = a20 * b02 + a21 * b12 + a22 * b22;

			return this;
		}
	}]);

	return Matrix3;
}();

Matrix3.clone = function (m) {
	var matrix = m.getMatrix();
	var tmp = [];

	for (var i = 0, len = matrix.length; i < len; i++) {
		tmp[i] = matrix[i];
	}

	return new Matrix3(tmp);
};

Matrix3.copy = function (m1, m2) {
	var clone = Matrix3.clone(m2);
	m1.setMatrix(clone.getMatrix());
};

Matrix3.zero = function () {
	return new Matrix3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
};

Matrix3.identity = function (m) {
	return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
};

Matrix3.translation = function (x, y) {
	return new Matrix3([1, 0, 0, 0, 1, 0, x, y, 1]);
};

Matrix3.rotation = function (angle) {
	var cosa = Math.cos(angle * Math.PI / 180);
	var sina = Math.sin(angle * Math.PI / 180);
	return new Matrix3([cosa, sina, 0, -sina, cosa, 0, 0, 0, 1]);
};

Matrix3.scaling = function (scaleX, scaleY) {
	return new Matrix3([scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1]);
};

Matrix3.transpose = function (m) {
	var matrix = m.getMatrix();
	var tmp = null;

	temp = matrix[1];
	matrix[1] = matrix[3];
	matrix[3] = temp;

	temp = matrix[2];
	matrix[2] = matrix[6];
	matrix[6] = temp;

	temp = matrix[5];
	matrix[5] = matrix[7];
	matrix[7] = temp;

	m.setMatrix(matrix);
};

Matrix3.inverse = function (m) {
	var matrix = m.getMatrix();

	var a00 = matrix[0];
	var a01 = matrix[1];
	var a02 = matrix[2];

	var a10 = matrix[3];
	var a11 = matrix[4];
	var a12 = matrix[5];

	var a20 = matrix[6];
	var a21 = matrix[7];
	var a22 = matrix[8];

	var deter = a00 * a11 * a22 + a01 * a12 * a20 - a02 * a10 * a20 - a01 * a10 * a22 - a00 * a12 * a21;

	var c00 = (a11 * a22 - a21 * a12) / deter;
	var c01 = -(a10 * a22 - a20 * a12) / deter;
	var c02 = (a10 * a21 - a20 * a11) / deter;

	var c10 = -(a01 * a22 - a21 * a02) / deter;
	var c11 = (a00 * a22 - a20 * a02) / deter;
	var c12 = -(a00 * a21 - a20 * a01) / deter;

	var c20 = (a01 * a12 - a11 * a02) / deter;
	var c21 = -(a00 * a12 - a10 * a02) / deter;
	var c22 = (a00 * a11 - a10 * a01) / deter;

	return new Matrix3([c00, c01, c02, c10, c11, c12, c20, c21, c22]);
};

Moco.Matrix3 = Matrix3;
