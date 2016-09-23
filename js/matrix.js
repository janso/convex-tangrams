// --------------------------------------------------------------------
// class Matrix
// --------------------------------------------------------------------
var Matrix = function () {
	this.m = null;
}

Matrix.getTranslation = function (x, y) {
	var m = new Matrix();
	m.setTranslation(x, y);
	return m;
};

Matrix.getScale = function (x, y) {
	var m = new Matrix();
	m.setScale(x, y);
	return m;
};

Matrix.getRotate = function (r) {
	var m = new Matrix();
	m.setRotate(r);
	return m;
};

Matrix.getRotateQuarter = function (q) {
	var m = new Matrix();
	m.setRotateQuarter(q);
	return m;
};

Matrix.prototype.setTranslation = function (x, y) {
	this.m = [[1, 0, x], [0, 1, y], [0, 0, 1]];
	return this;
};

Matrix.prototype.setScale = function (x, y) {
	this.m = [[x, 0, 0], [0, y, 0], [0, 0, 1]];
	return this;
};

Matrix.prototype.setRotate = function (r) {
	this.m = [
		[Math.cos(r), -Math.sin(r), 0],
		[Math.sin(r), Math.cos(r), 0],
		[0, 0, 1]
	];
	return this;
};

Matrix.prototype.setRotateQuarter = function (q) {
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

Matrix.prototype.multiplyMatrix = function (m) {
	var m = [
		[
			this.m[0][0] * m.m[0][0] + this.m[0][1] * m.m[1][0] + this.m[0][2] * m.m[2][0],
			this.m[0][0] * m.m[0][1] + this.m[0][1] * m.m[1][1] + this.m[0][2] * m.m[2][1],
			this.m[0][0] * m.m[0][2] + this.m[0][1] * m.m[1][2] + this.m[0][2] * m.m[2][2]
		],
		[
			this.m[1][0] * m.m[0][0] + this.m[1][1] * m.m[1][0] + this.m[1][2] * m.m[2][0],
			this.m[1][0] * m.m[0][1] + this.m[1][1] * m.m[1][1] + this.m[1][2] * m.m[2][1],
			this.m[1][0] * m.m[0][2] + this.m[1][1] * m.m[1][2] + this.m[1][2] * m.m[2][2]
		],
		[
			this.m[2][0] * m.m[0][0] + this.m[2][1] * m.m[0][0] + this.m[2][2] * m.m[2][0],
			this.m[2][0] * m.m[0][1] + this.m[2][1] * m.m[0][1] + this.m[2][2] * m.m[2][1],
			this.m[2][0] * m.m[0][2] + this.m[2][1] * m.m[0][2] + this.m[2][2] * m.m[2][2]
		]
	];
	this.m = m;
	return this;
};

Matrix.prototype.addMatrix = function (m) {
	var m = [
		[this.m[0][0] + m.m[0][0], this.m[0][1] + m.m[0][1],  + this.m[0][2] + m.m[0][2]],
		[this.m[1][0] + m.m[1][0], this.m[1][1] + m.m[1][1],  + this.m[1][2] + m.m[1][2]],
		[this.m[2][0] + m.m[2][0], this.m[2][1] + m.m[2][1],  + this.m[2][2] + m.m[2][2]],
	];
	this.m = m;
	return this;
};

Matrix.prototype.transformVector = function (n) {
	var x = this.m[0][0] * n.x + this.m[0][1] * n.y + this.m[0][2];
	var y = this.m[1][0] * n.x + this.m[1][1] * n.y + this.m[1][2];
	n.x = x;
	n.y = y;
	return this;
};

Matrix.prototype.transformShape = function (s) {
	for (var i = 0; i < s.n.length; i++) {
		this.transformVector(s.n[i])
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
