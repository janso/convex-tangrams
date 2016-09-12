// --------------------------------------------------------------------
// class Matrix
// --------------------------------------------------------------------
var Matrix = function () {
	this.m = null;
}

Matrix.get_translation = function (x, y) {
	var m = new Matrix();
	m.set_translation(x, y);
	return m;
};

Matrix.get_scale = function (x, y) {
	var m = new Matrix();
	m.set_scale(x, y);
	return m;
};

Matrix.get_rotate = function (r) {
	var m = new Matrix();
	m.set_rotate(r);
	return m;
};

Matrix.get_rotate_quarter = function (q) {
	var m = new Matrix();
	m.set_rotate_quarter(q);
	return m;
};

Matrix.prototype.set_translation = function (x, y) {
	this.m = [[1, 0, x], [0, 1, y], [0, 0, 1]];
	return this;
};

Matrix.prototype.set_scale = function (x, y) {
	this.m = [[x, 0, 0], [0, y, 0], [0, 0, 1]];
	return this;
};

Matrix.prototype.set_rotate = function (r) {
	this.m = [
		[Math.cos(r), -Math.sin(r), 0],
		[Math.sin(r), Math.cos(r), 0],
		[0, 0, 1]
	];
	return this;
};

Matrix.prototype.set_rotate_quarter = function (q) {
	var ql = q % 4;
	if (ql == 0) {
		this.m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
	} else if (ql == 1) {
		this.m = [[0, -1, 0], [1, 0, 0], [0, 0, 1]];
	} else if (ql == 2) {
		this.m = [[-1, 0, 0], [0, -1, 0], [0, 0, 1]];
	} else {
		this.m = [[0, 1, 0], [-1, 0, 0], [0, 0, 1]];
	}
	return this;
};

Matrix.prototype.multiply_matrix = function (m) {
	var m = [
		[
			this.m[0][0] * m.m[0][0] + this.m[0][1] * m.m[0][1] + this.m[0][2] * m.m[0][2],
			this.m[0][0] * m.m[1][0] + this.m[0][1] * m.m[1][1] + this.m[0][2] * m.m[1][2],
			this.m[0][0] * m.m[2][0] + this.m[0][1] * m.m[2][1] + this.m[0][2] * m.m[2][2]
		],
		[
			this.m[1][0] * m.m[0][0] + this.m[1][1] * m.m[0][1] + this.m[1][2] * m.m[0][2],
			this.m[1][0] * m.m[1][0] + this.m[1][1] * m.m[1][1] + this.m[1][2] * m.m[1][2],
			this.m[1][0] * m.m[2][0] + this.m[1][1] * m.m[2][1] + this.m[1][2] * m.m[2][2]
		],
		[
			this.m[2][0] * m.m[0][0] + this.m[2][1] * m.m[0][1] + this.m[2][2] * m.m[0][2],
			this.m[2][0] * m.m[1][0] + this.m[2][1] * m.m[1][1] + this.m[2][2] * m.m[1][2],
			this.m[2][0] * m.m[2][0] + this.m[2][1] * m.m[2][1] + this.m[2][2] * m.m[2][2]
		]
	];
	this.m = m;
	return this;
};

Matrix.prototype.add_matrix = function (m) {
	var m = [
		[this.m[0][0] + m.m[0][0], this.m[0][1] + m.m[0][1],  + this.m[0][2] + m.m[0][2]],
		[this.m[1][0] + m.m[1][0], this.m[1][1] + m.m[1][1],  + this.m[1][2] + m.m[1][2]],
		[this.m[2][0] + m.m[2][0], this.m[2][1] + m.m[2][1],  + this.m[2][2] + m.m[2][2]],
	];
	this.m = m;
	return this;
};

Matrix.prototype.transform_Vector = function (n) {
	var x = this.m[0][0] * n.x + this.m[0][1] * n.y + this.m[0][2];
	var y = this.m[1][0] * n.x + this.m[1][1] * n.y + this.m[1][2];
	n.x = x;
	n.y = y;
	return this;
};

Matrix.prototype.transform_shape = function (s) {
	for (var i = 0; i < s.n.length; i++) {
		this.transform_Vector(s.n[i])
	};
	return this;
};

Matrix.prototype.log = function () {
	var logline;
	this.m.forEach(function row(r) {
		logline = '';
		r.forEach(function component(c) {
			logline = logline + ' [' + c + '] ';
		});
		console.log(logline);
	});
};
