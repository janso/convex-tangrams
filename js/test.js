// --------------------------------------------------------------------
// test function for figures
// --------------------------------------------------------------------

// do unit tests before we really start
figure_unit_test();

function figure_unit_test() {
	// combine parallelogram and small triangle
	testq2("p@2+ts@2", "L13314");
	testq2("p@2+ts@4", "L13215");
	testq2("p@0+ts@0", "L14223");

	// combine parallelogram and square
	testq2("p@2+s@0", "L133225");

	// combine parallelogram and medium triangle
	testq2("p@4+tm@0", "S133144");
	testq2("p@0+tm@0", "S133144");
	testq2("p@0+tm@6", "L142315");

	// combine parallelogram and big triangle
	testq2("p@2+tb@4", "L13524144");
	testq2("p@2+tb@6", "S14171334");

	console.log("unit tests passed");
}

function testq2(testcase, hash) {
	var figure = Figure.combineq2(testcase);
	if (figure.hash != hash)
		throw "testcase " + testcase + " failed! figure hash " + figure.hash + " != " + hash;
	return figure;
}
