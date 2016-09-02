// --------------------------------------------------------------------
// test function for figures 
// --------------------------------------------------------------------

// do unit tests before we really start
figure_unit_test();

function figure_unit_test() {
	// combine parallelogram and small triangle
	var f1=new Figure().set_parallelogram();
	var f2=new Figure().set_triangle_small();
	var f3=f1.combine(2, f2, 2).normalize();
	test("p@2+ts@2", f3.hash, "L13314");
	
	// combine parallelogram and medium triangle 4 on 0 (works)
	var f1=new Figure().set_parallelogram();
	var f2=new Figure().set_triangle_medium();
	var f3=f1.combine(4, f2, 0).normalize();
	test("p@4+tm@0", f3.hash, "S133144");

	// combine parallelogram and medium triangle, 0 on 0 (works)
	var f1=new Figure().set_parallelogram();
	var f2=new Figure().set_triangle_medium();
	var f3=f1.combine(0, f2, 0).normalize();
	test("p@0+tm@0", f3.hash, "S133144");
	
	// combine parallelogram and medium triangle, 0 on 6 (works)
	var f1=new Figure().set_parallelogram();
	var f2=new Figure().set_triangle_medium();
	var f3=f1.combine(0, f2, 6).normalize();
	test("p@0+tm@6", f3.hash, "L142315");
	
	console.log("unit tests passed");
}

function test(testcase, h1, h2) {
	if(h1!=h2) throw "testcase "+testcase+" failed!";
}