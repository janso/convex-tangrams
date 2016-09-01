// --------------------------------------------------------------------
// class Figure
// --------------------------------------------------------------------	
var Figure=function(id, color) { 
	this.path=[];
	// the path is a sequence of length of edges and inner angles
	// the length of the edge can be L for long edges and S for short edges
	// L=sqrt(2) * S
	// the angle can be any value 0-7 were 0=0°, 1=45°, 2=90°, ...
	// [ 'S', 1, 'L', 1, 'S', 2 ] would be tangram's small triangle
	this.id=id; this.color=color 
};

Figure.prototype.clone=function() {
	return new Figure(this.id, this.color).path=this.path.slice(0); // clone array
};

Figure.prototype.normalize=function() {
	// find smallest angle in path, collect indexes of smalest angle in minindex[]
	var minangle=8; minindex=[];
	for(var i=1; i<this.path.length; i=i+2) {
		if(this.path[i]<minangle) {
			minangle=this.path[i]; 
			minindex=[];
		}
		if(this.path[i]==minangle) minindex.push(i); // collect indexes of smalest angle
	}
	// calculate for each index a value from the subsequent angles
	// store minimun of those values in minv and the corresponding index in mindex
	var value=0; mi=1; minv=Math.pow(2, 30); mindex=-1;
	if(minindex.length==1)
		mindex = minindex[0];
	else {
		for(var i=minindex[0]+2, c=0; 
			c++<this.path.length/2; 
			i=(i+2)%this.path.length) {
				
			if(i==minindex[mi]) {
				if(minv > value) { minv=value; mindex=mi; }
				mi=(mi++)%minindex.length; value=0;
			}
			else value=10*value+this.path[i];
		}
	} // minindex.length==1
	var newpath=[];
	for(var i=mindex-1, c=0; 
		c++<this.path.length; 
		i=(i+1)%this.path.length) {
		
		newpath.push(this.path[i]);
	}				
	this.path = newpath;
	return this;
};

Figure.prototype.asString=function() {
	var r="";
	this.path.forEach(function(e) {	r=r+e+" " })
	if(this.isConsistent()) r=r+" (consistent)"; else r=r+" INCONSISTENT!";
	return r;
}

Figure.prototype.set_triangle_small=function() {
	this.path=[ 'L', 1, 'S', 2, 'S', 1 ];
	return this;
};

Figure.prototype.set_triangle_medium=function() {
	this.path=[ 'L', 1, 'S', 4, 'S', 1, 'L', 2 ];
	return this;
};

Figure.prototype.set_triangle_big=function() {
	this.path=[ 'L', 4, 'L', 1, 'S', 4, 'S', 2, 'S', 4, 'S', 1 ];
	return this;
};

Figure.prototype.set_square=function() {
	this.path=[ 'S', 2, 'S', 2, 'S', 2, 'S', 2 ];
	return this;
};


Figure.prototype.set_parallelogram=function() {
	this.path=[ 'L', 1, 'S', 3, 'L', 1, 'S', 3 ];
	return this;
};

Figure.prototype.set_test=function() {
	this.path=[ 'S', 4, 'S', 1, 'L', 3, 'S', 3, 'L', 1, 'S', 4, ];
	return this;
};

Figure.prototype.combine=function(motherindex, childpiece, childindex) {
	// combine parallelogram L 1 S 3 L 1 S 3 and small triangle L 1 S 2 S 1 with
	// motherindex 2: L 1 |S| 3 L 1 S 3 and childindex 2: L 1 |S| 2 S 1.
	// result shall be L 3 S 1 L 4 L 1 S 3.
	// iterate mother piece until link edge (motherindex), add angle and 
	// continue with childpiece (modulo). 
	// At the end of the child piece add angles and continue with rest of mother piece.
	if(this.path[motherindex]!=childpiece.path[childindex]) throw "incompatible edges";
	var combination=new Figure(this.id, this.color);
	var mimod=0;
	// iterate mother-figure until link edge and copy path
	for(var mi=0; mi < motherindex; mi++) 
		combination.path.push(this.path[mi]);
	// add angle
	if(combination.path.length>1)
		combination.path[combination.path.length-1]+=childpiece.path[childindex+1]; 
	else
		mimod=2;
	// iterate child-figure (modulo) beginning from link edge
	for(var ci=(childindex+2)%childpiece.path.length, i=0; 
		i++<childpiece.path.length-2; 
		ci=(ci+1)%childpiece.path.length) {
			combination.path.push(childpiece.path[ci]);
	}
	// add angle
	combination.path[combination.path.length-1] += this.path[motherindex+1]; 
	// continue with rest of mother-figure
	for(var mi=(motherindex+2)%this.path.length, i=0; 
		i++<this.path.length-4+mimod; 
		mi=(mi+1)%this.path.length) {
			combination.path.push(this.path[mi]);				
	}
	if(mimod!=0) 
		combination.path[combination.path.length-1]+=childpiece.path[childindex+1]; 
	return combination;
};

Figure.prototype.isConsistent=function() {
	// checks if to total of the inner angles fits to the number of edges and
	// if the starting point equals the end point
	if(this.path.length==0) return true;
	var vangle=0; cangle=0; v=new Vector(0, 0);
	for(var i=1; i<this.path.length; i=i+2) {
		cangle+=this.path[i];
		vangle=(vangle+12-this.path[i])%8;
		v.add(Vector.get_vector_for_angle(vangle));
	}
	var r=(v.x==0&&v.y==0)&&(2*this.path.length-8==cangle);
	return r; 
};

Figure.prototype.toShape=function(id, color) {
	// convert a figure (angle and edge length) to a shape (x,y) to draw it
	var shape=new Shape(id, color);
	if(this.path.length==0) return shape;
	var vangle=0;
	if(this.path[0]=="S") angle = 1;
	var v=new Vector(0, 0);
	for(var i=1; i<this.path.length; i=i+2) {
		vangle=(vangle+12-this.path[i])%8;
		v.add(Vector.get_vector_for_angle(vangle));
		shape.n.push(v.clone()); 
		// console.log("i="+i+"  angle="+this.path[i]+"  cangle="+angle+"   v:"+v.asString());
	}
	return shape;
};