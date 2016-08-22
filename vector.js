// --------------------------------------------------------------------
// class Vector
// --------------------------------------------------------------------
var Vector = function(x, y) { this.x = x; this.y = y;	};
Vector.prototype.clone = function() { return new Vector(this.x, this.y); };
Vector.prototype.equal = function(v) { return Boolean(this.x == v.x && this.y == v.y); };
Vector.prototype.add = function(v) { this.x += v.x; this.y += v.y; return this; };
Vector.prototype.get_difference_vector = function(v) { return new Vector(v.x - this.x, v.y - this.y); };
Vector.prototype.asString = function() { return "["+this.x+","+this.y+"]"; };	
Vector.prototype.rotate_quarter = function(q) {
	var x, lq = q % 3;
	if(q == 1) { x = this.x; this.x = this.y; this.y = -x; } 
	else if (q == 2) { this.x = -this.x; this.y = -this.y; } 
	else if (q == 3) { x = this.x; this.x = -this.y; this.y = x; }
}
Vector.prototype.translate = function(x, y) {	this.x += x; this.y += y; }
Vector.prototype.get_angle = function() {	
	if( this.x == 0) {
		if( this.y == 0) { return -1; } // invalid case
		else if( this.y > 0) {	return 2; } // 0,1
		else { return 6; } // 0, -1 
	} else if( this.x > 0 ) {
		if( this.y == 0) { return 0; } // 1,0
		else if( this.y > 0) { return 1; } // 1,1
		else { return 7; } // 1,-1
	} else { // x < 0
		if( this.y == 0) { return 4; } // -1,0
		else if( this.y > 0) { return 3; } // -1,1
		else { return 5; }// -1,-1			
	}
}
Vector.get_vector_for_angle = function(angle) {
	angle = angle % 8;
	if( angle == 0) return new Vector(2, 0);
	else if (angle == 1) return new Vector(1, 1);
	else if (angle == 2) return new Vector(0, 2);
	else if (angle == 3) return new Vector(-1, 1);
	else if (angle == 4) return new Vector(-2, 0);
	else if (angle == 5) return new Vector(-1, -1);
	else if (angle == 6) return new Vector(0, -2);
	else if (angle == 7) return new Vector(1, -1);
	else return null;
}