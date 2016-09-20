// --------------------------------------------------------------------
// class Figure
// --------------------------------------------------------------------
var Figure = function () {
	this.path = [];
	// the path is a sequence of length of edges and inner angles
	// the length of the edge can be L for long edges and S for short edges
	// L=sqrt(2) * S
	// the angle can be any value 0-7 were 0=0°, 1=45°, 2=90°, ...
	// [ 'S', 1, 'L', 1, 'S', 2 ] would be tangram's small triangle
	this.hash = 0; // hash is calculated in normalize
	this.q3 = "";
};

Figure.CreateFromCode = function (code) {
	var f = new Figure();
	f.q3 = code;
	switch (code) {
	case "p":
		f.set_parallelogram();
		break;
	case "s":
		f.set_square();
		break;
	case "ts":
		f.set_triangle_small();
		break;
	case "tm":
		f.set_triangle_medium();
		break;
	case "tb":
		f.set_triangle_big();
		break;
	default:
		throw "invalid code " + code;
	}
	return f;
}

Figure.prototype.clone = function () {
	var clone = new Figure(this.id, this.color);
	clone.path = this.path.slice(0); // clone array
	clone.hash = this.hash;
	clone.q3 = this.q3;
	return clone;
};

Figure.prototype.next_path_index = function (i) {
	if (++i > this.path.lenght)
		i = 0;
	return i;
}

Figure.prototype.previous_path_index = function (i) {
	if (--i < 0)
		i = this.path.length - 1;
	return i;
}

Figure.prototype.asString = function () {
	var r = "";
	this.path.forEach(function (e) {
		r = r + e + " "
	})

	// Q3
	if (this.q3 == "")
		r = r + "   no Q3!";
	else
		r = r + "   Q3 = " + this.q3;

	// hash
	if (this.hash == 0)
		r = r + "   no hash!";
	else
		r = r + "   hash = " + this.hash;

	// consistency
	try {
		var consistent = this.isConsistent();
		r = r + "   (consistent)";
	}
	catch(err) {
		r = r + "   INCONSISTENT ("+err+")"
	};
	return r;
}

Figure.prototype.toShape = function () {
	// convert a figure (angle and edge length) to a shape (x,y) to draw it
	var shape = new Shape(1, "#202020");
	if (this.path.length == 0)
		return shape;
	var vangle = 0;
	if (this.path[0] == "S")
		vangle = 1;
	var v = new Vector(0, 0);
	for (var i = 1; i < this.path.length; i = i + 2) {
		vangle = (vangle + 12 - this.path[i]) % 8;
		v.add(Vector.get_vector_for_angle(vangle));
		shape.n.push(v.clone());
	}
	// resort nodes of shape
	var n = [],
	j = 0;
	for (var i = 0; i < shape.n.length; i++) {
		j = (i + shape.n.length - 1) % shape.n.length;
		n.push(shape.n[j]);
	}
	shape.n = n;
	return shape;
};

Figure.prototype.set_triangle_small = function () {
	this.path = ['L', 1, 'S', 2, 'S', 1];
	return this;
};

Figure.prototype.set_triangle_medium = function () {
	this.path = ['L', 1, 'S', 4, 'S', 1, 'L', 2];
	return this;
};

Figure.prototype.set_triangle_big = function () {
	this.path = ['L', 4, 'L', 1, 'S', 4, 'S', 2, 'S', 4, 'S', 1];
	return this;
};

Figure.prototype.set_square = function () {
	this.path = ['S', 2, 'S', 2, 'S', 2, 'S', 2];
	return this;
};

Figure.prototype.set_parallelogram = function () {
	this.path = ['L', 1, 'S', 3, 'L', 1, 'S', 3];
	return this;
};

Figure.prototype.set_test = function () {
	this.path = ['S', 4, 'S', 1, 'L', 3, 'S', 3, 'L', 1, 'S', 4, ];
	return this;
};

Figure.prototype.isConsistent = function () {
	// checks if to total of the inner angles fits to the number of edges and
	// if the starting point equals the end point
	if (this.path.length == 0)
		return true;
	var vangle = 0;
	var cangle = 0;
	var v = new Vector(0, 0);
	if (this.path[0] == "S")
		vangle = 1;
	for (var i = 1; i < this.path.length; i = i + 2) {
		cangle += this.path[i];
		vangle = (vangle + 12 - this.path[i]) % 8;
		v.add(Vector.get_vector_for_angle(vangle));
	}
	if (v.x != 0 || v.y != 0)
		throw "starting point not equal to endpoint";
	if (2 * this.path.length - 8 != cangle)
		throw "total of inner angels doesn't fit to number of nodes";

	// check the structure of path
	var edge = true;
	var angle = true;
	for (var i = 0; i < this.path.length; i++) {
		if (i % 2 == 0) {
			// check edges
			if (!((this.path[i] == "S") || (this.path[i] == "L")))
				throw "Invalid edge at index "+i;
		} else {
			// check angles
			if (this.path[i] < 1 || this.path[i] > 6)
				throw "Invalid angle of "+this.path[i]+" at index "+i;
		}
	}
	return true;
};

Figure.prototype.normalize = function () {
	// find smallest angle in path, collect indexes of smalest angle in minindex[]
	var min_angle = 8;
	var min_index_array = [];
	for (var i = 1; i < this.path.length; i = i + 2) {
		if (this.path[i] < min_angle) {
			min_angle = this.path[i];
			min_index_array = [];
		}
		if (this.path[i] == min_angle)
			min_index_array.push(i); // collect indexes of smalest angle
	}
	// calculate for each index a value from the subsequent angles
	// store minimun of those values in minv and the corresponding index in mindex
	if (min_index_array.length == 1)
		min_index = min_index_array[0];
	else {
		var value = 0;
		var min_index = -1;
		var mia_index = 0;
		var min_value = Math.pow(2, 30);
		for (var i = min_index_array[mia_index] + 2, c = 0; c++ < this.path.length / 2; i = (i + 2) % this.path.length) {
			if (i == min_index_array[(mia_index + 1) % min_index_array.length]) {
				if (value < min_value) {
					min_value = value;
					min_index = min_index_array[mia_index];
				}
				value = 0;
				mia_index = (mia_index + 1) % min_index_array.length;
			} else
				value = value / 10 + this.path[i];
		}
	} // minindex.length==1
	// bring path to normalized form an calculate hash
	var norm_path = [];
	this.hash = this.path[min_index - 1]; // add S (for short edge) or L to hash
	for (var i = min_index - 1, c = 0; c++ < this.path.length; i = (i + 1) % this.path.length) {
		norm_path.push(this.path[i]); // create normalized path
		if (i % 2 == 1)
			this.hash = this.hash + this.path[i]; // calculate hash
	}
	this.path = norm_path; // use normalized path
	return this;
};

// create combination of n figures using a description string in q3-syntax
// p+2.tb.8 mean combine a parallelogram on index 2 with a big triangle on index 8
Figure.combineq3 = function (q3) {
	var figure_combination = q3.split("+");
	var first_block = figure_combination[0].split("@");
	var figure = Figure.CreateFromCode(first_block[0]);
	var next_block;
	var figure_index;
	var next_figure;
	var next_index;
	for (var i = 1; i < figure_combination.length; i++) {
		next_block = figure_combination[i].split(".");
		figure_index = parseInt(next_block[0]);
		next_figure = Figure.CreateFromCode(next_block[1]);
		next_index = parseInt(next_block[2]);
		figure = figure.combine(figure_index, next_figure, next_index);
		figure.q3 = figure.q3 + "+" + figure_index + "." + next_figure.q3 + "." + next_index;
	}
	return figure;
}

Figure.prototype.combine_simple = function (motherindex, childpiece, childindex) {
	// combine_simple is the first working version of combine.
	// It is limited to combine figures that share exactly one edge:
	// combine is in development - without the limitation

	// combine parallelogram L 1 S 3 L 1 S 3 and small triangle L 1 S 2 S 1 with
	// motherindex 2: L 1 |S| 3 L 1 S 3 and childindex 2: L 1 |S| 2 S 1.
	// result shall be L 3 S 1 L 4 L 1 S 3.
	// iterate mother piece until link edge (motherindex), add angle and
	// continue with childpiece (modulo).
	// At the end of the child piece add angles and continue with rest of mother piece.

	// checks
	// combine parallelogram L 1 S 3 L 1 S 3 and small triangle L 1 S 2 S 1 with
	// motherindex 2: L 1 |S| 3 L 1 S 3 and childindex 2: L 1 |S| 2 S 1.
	// result shall be L 3 S 1 L 4 L 1 S 3.
	// iterate mother piece until link edge (motherindex), add angle and
	// continue with childpiece (modulo).
	// At the end of the child piece add angles and continue with rest of mother piece.

	// checks
	if (!(this.path[motherindex] == "S" || this.path[motherindex] == "L"))
		throw "index not for edge in mother";
	if (!(childpiece.path[childindex] == "S" || childpiece.path[childindex] == "L"))
		throw "index not for edge in child";
	if (this.path[motherindex] != childpiece.path[childindex])
		throw "incompatible edges";

	// acutal combination
	var combination = new Figure(this.id, this.color);
	combination.q3 = this.q3;
	var mimod = 0;
	// copy elements of mother to combination
	for (var mi = (motherindex + 2) % this.path.length, i = 0;
		i++ < this.path.length - 2;
		mi = (mi + 1) % this.path.length) {
		combination.path.push(this.path[mi]);
	}

	// add angle
	if (combination.path.length > 1) {
		var child_angle_index = childindex + 1;
		var child_angle = childpiece.path[child_angle_index];
		combination.path[combination.path.length - 1] += child_angle;
	} else
		mimod = 2;
	// iterate child-figure (modulo) beginning from link edge
	for (var ci = (childindex + 2) % childpiece.path.length, i = 0;
		i++ < childpiece.path.length - 2;
		ci = (ci + 1) % childpiece.path.length) {
		combination.path.push(childpiece.path[ci]);
	}
	// add angle
	combination.path[combination.path.length - 1] += this.path[motherindex + 1];
	if (mimod != 0)
		combination.path[combination.path.length - 1] += childpiece.path[childindex + 1];
	return combination.normalize();
};

Figure.prototype.combine = function (motherindex, childpiece, childindex) {
	// combine parallelogram L 1 S 3 L 1 S 3 and small triangle L 1 S 2 S 1 with
	// motherindex 2: L 1 |S| 3 L 1 S 3 and childindex 2: L 1 |S| 2 S 1.
	// result shall be L 3 S 1 L 4 L 1 S 3.
	// iterate mother piece until link edge (motherindex), add angle and
	// continue with childpiece (modulo).
	// At the end of the child piece add angles and continue with rest of mother piece.

	// checks
	if (!(this.path[motherindex] == "S" || this.path[motherindex] == "L"))
		throw "index not for edge in mother";
	if (!(childpiece.path[childindex] == "S" || childpiece.path[childindex] == "L"))
		throw "index not for edge in child";
	if (this.path[motherindex] != childpiece.path[childindex])
		throw "incompatible edges";

	// set start/end indexes
	var mis = (motherindex + 2) % this.path.length; // start index on mother piece (this), edge after link edge
	var mie = motherindex; // end index on mother piece
	var cis = (childindex + 2) % childpiece.path.length; // start index on child piece
	var cie = childindex; // end index on child piece

	/*
	// modify foreward ###
	var mlookahead = (mis + 1) % this.path.length;
	var clookahead = (cis + 1) % childpiece.path.length;
	while (this.path[mlookahead] == (8 - childpiece.path[clookahead])) {
		mis = (mis + 2) % this.path.length;
		cis = (cis + 2) % childpiece.path.length;
	    mlookahead = (mlookahead + 2) % this.path.length;
	    clookahead = (clookahead + 2) % childpiece.path.length;		
	}

	// modify backward ###
	mlookahead = (mie + 1) % this.path.length;
	clookahead = (cie + 1) % childpiece.path.length;
	while (this.path[mlookahead] == (8 - childpiece.path[clookahead])) {
		mie = (mie + this.path.length - 2) % this.path.length;
		cie = (cie + childpiece.path.length - 2) % childpiece.path.length;
	    mlookahead = (mlookahead + this.path.length - 2) % this.path.length;
	    clookahead = (clookahead + childpiece.path.length - 2) % childpiece.path.length;		
	}
	*/

	// acutal combination
	var combination = new Figure(this.id, this.color);
	combination.q3 = this.q3;
	var mimod = 0;

	// copy elements of mother to combination
	for (var i = mis; i != mie; i = (i + 1) % this.path.length) {
		combination.path.push(this.path[i]);
	}

	// calculate first link angle
	if (combination.path.length > 1) {
		combination.path[combination.path.length - 1] += childpiece.path[cie + 1];
	} else
		mimod = 2;

	// copy elements from child piece to combination
	for (var i = cis; i != cie; i = (i + 1) % childpiece.path.length) {
		combination.path.push(childpiece.path[i]);
	}

	// calculate second link angle
	combination.path[combination.path.length - 1] += this.path[mie + 1];
	if (mimod != 0)
		combination.path[combination.path.length - 1] += childpiece.path[cie + 1];

	// normalize
	return combination.normalize();
};
