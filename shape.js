// --------------------------------------------------------------------
// class Shape
// --------------------------------------------------------------------
var Shape = function(id, color) { this.id = id; this.color = color; this.n = []; };

Shape.prototype.clone = function() {
	var s = new Shape(this.id, this.color);
	s.n = this.clone_nodes();
	return s;
};
Shape.prototype.clone_nodes = function() {
	var nn = [ ];
	this.n.forEach(function(n) {
		nn.push(n.clone());
	});			
	return nn;
};
Shape.prototype.get_node_index_add = function(i, a) {
	var j = ( i + a ) % this.n.length;
	if(j < 0) j = this.n.length + j;
	return this.n[j];
}
Shape.prototype.set_triangle_big = function() {
	this.n = [
		new Vector(0, 0),
		new Vector(1, 1),
		new Vector(2, 2),
		new Vector(1, 3),
		new Vector(0, 4),
		new Vector(0, 2)
	];
};
Shape.prototype.set_triangle_medium = function() {
	this.n = [new Vector(0, 0), new Vector(2, 0), new Vector(2, 2), new Vector(1, 1)];
};		
Shape.prototype.set_triangle_small = function() {
	this.n = [new Vector(0, 0), new Vector(1, 1), new Vector(0, 2)];
};				
Shape.prototype.set_square = function() {
	this.n = [new Vector(0, 1), new Vector(1, 0), new Vector(2, 1), new Vector(1, 2)];
};		
Shape.prototype.set_parallelogram = function() {
	this.n = [new Vector(0, 0), new Vector(2, 0), new Vector(3, 1), new Vector(1, 1)];
};			
Shape.prototype.draw = function(ctx) {
	// draw shape (as filled polygon)
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.moveTo(this.n[0].x, this.n[0].y);
	for( var i = 0; i < this.n.length; i++) { ctx.lineTo(this.n[i].x, this.n[i].y); }
	ctx.closePath();
	ctx.fill();
	
	// draw nodes of shape (as circles)
	this.n.forEach(function(n) {
		ctx.beginPath();
		ctx.arc(n.x, n.y, 3, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.stroke();				
	});		

	// mark first node (green)
	ctx.fillStyle = "#00ee00";
	ctx.beginPath();
	ctx.arc(this.n[0].x, this.n[0].y, 3, 0, Math.PI*2, true);
	ctx.closePath(); ctx.fill();	

	// mark second node (yellow)
	ctx.fillStyle = "#eeee00";
	ctx.beginPath();
	ctx.arc(this.n[1].x, this.n[1].y, 3, 0, Math.PI*2, true);
	ctx.closePath(); ctx.fill();			
};
Shape.prototype.rotate_quarter = function(q) {
	this.n.forEach(function node(n) { n.rotate_quarter(q); });
};
Shape.prototype.translate = function(v) {
	this.n.forEach(function node(n) { n.translate(v.x, v.y); });
};		
Shape.prototype.asString = function() {
	var logline = "";
	this.n.forEach(function node(n) {
		logline = logline + n.asString() + "->";
	});
	return logline;
};
Shape.prototype.check_apply = function(local_node_index, foreign_shape, foreign_node_index) {
	// bring foreign shape's node on local shapes node's coordinates
	foreign_shape.translate(foreign_shape.n[foreign_node_index].get_difference_vector(this.n[local_node_index]));
	
	// check if foreign shape can be applied 
	// 1. do the edges have oposite directions
	// 1.a next edge of local node (and previous edge of foreign node)
	var ln = this.get_node_index_add(local_node_index, 1); // get next node of local shape
	var fn = foreign_shape.get_node_index_add(foreign_node_index, -1); // get previous node of foreign shape
	if(ln.equal(fn)) return true;
	// 1.b previous edge of local node (and next edge of foreign node)
	var ln = this.get_node_index_add(local_node_index, -1); // get next node of local shape
	var fn = foreign_shape.get_node_index_add(foreign_node_index, 1); // get previous node of foreign shape
	if(ln.equal(fn)) return true;	
	// ### more checks (avoid overlaps)
	return false;
};