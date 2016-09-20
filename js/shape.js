// --------------------------------------------------------------------
// class Shape
// --------------------------------------------------------------------
var Shape = function (id, color) {
	this.id = id;
	this.color = color;
	this.n = [];
};

Shape.prototype.clone = function () {
	var s = new Shape(this.id, this.color);
	s.n = this.n.slice(0);
	return s;
};
Shape.prototype.draw = function (ctx) {
	// draw shape (as filled polygon)
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "#999999";
	ctx.moveTo(this.n[0].x, this.n[0].y);
	for (var i = 0; i < this.n.length; i++) {
		ctx.lineTo(this.n[i].x, this.n[i].y);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};
Shape.prototype.inscribeNode = function (ctx) {
	ctx.font = "11px Arial";
	ctx.fillStyle = "#00d000";
	var nodeText;
	for (var i = 0; i < this.n.length; i++) {
		nodeText = 2 * ((i + 1) % this.n.length) + 1;
		ctx.fillText("" + nodeText, this.n[i].x + 3, this.n[i].y + 4);
	}
};
Shape.prototype.rotate_quarter = function (q) {
	this.n.forEach(function node(n) {
		n.rotate_quarter(q);
	});
};
Shape.prototype.translate = function (v) {
	this.n.forEach(function node(n) {
		n.translate(v.x, v.y);
	});
};
Shape.prototype.asString = function () {
	var logline = "";
	this.n.forEach(function node(n) {
		logline = logline + n.asString() + "->";
	});
	return logline;
};
