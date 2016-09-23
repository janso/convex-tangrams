// --------------------------------------------------------------------
// class Shape
// --------------------------------------------------------------------
var Shape = function () {
	this.n = [];
};

Shape.prototype.clone = function () {
	var s = new Shape();
	s.n = this.n.slice(0);
	return s;
};

Shape.prototype.draw = function (ctx) {
	// draw shape (as polygon)
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "#999999";
	ctx.moveTo(this.n[0].x, this.n[0].y);
	for (var i = 0; i < this.n.length; i++) {
		ctx.lineTo(this.n[i].x, this.n[i].y);
	}
	ctx.closePath();
	ctx.stroke();
};

Shape.prototype.drawNodeIncription = function (ctx) {
	ctx.font = "11px Arial";
	ctx.fillStyle = "#00d000";
	var nodeText;
	for (var i = 0; i < this.n.length; i++) {
		nodeText = 2 * ((i + 1) % this.n.length) + 1;
		ctx.fillText("" + nodeText, this.n[i].x + 3, this.n[i].y + 4);
	}
};

Shape.prototype.rotateQuarter = function (q) {
	this.n.forEach(function node(n) {
		n.rotateQuarter(q);
	});
};

Shape.prototype.translate = function (translateVector) {
	this.n.forEach(function node(n) {
		n.add(translateVector);
	});
};

Shape.prototype.asString = function () {
	var logline = "";
	this.n.forEach(function node(n) {
		logline = logline + n.asString() + "->";
	});
	return logline;
};
