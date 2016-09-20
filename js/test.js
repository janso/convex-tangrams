// --------------------------------------------------------------------
// test function for figures
// --------------------------------------------------------------------

// do unit tests before we really start
figure_unit_test();

function figure_unit_test() {
	// combine parallelogram and small triangle
	testq3("p+2.ts.2", "L13314");
	testq3("p+2.ts.4", "L13215");
	testq3("p+0.ts.0", "L14223");

	// combine parallelogram and square
	testq3("p+2.s.0", "L133225");

	// combine parallelogram and medium triangle
	testq3("p+4.tm.0", "S133144");
	testq3("p+0.tm.0", "S133144");
	testq3("p+0.tm.6", "L142315");

	// combine parallelogram and big triangle
	testq3("p+0.tb.0", "L14242317");
	testq3("p+0.tb.2", "S15314424");
	testq3("p+2.tb.4", "L13524144");
	testq3("p+2.tb.6", "S14171334");

	// combination with two overlapping edges
	testq3("tm+2.tm.4", "L2222");
	testq3("tb+6.tb.4", "S14341434");
	testq3("tb+0.tb.2", "S24242424");
	testq3("tb+2.tb.0", "S24242424");
	
	// combination with three overlapping edges
	testq3("p+2.tb.8+10.ts.0+12.tb.4+8.s.0", "S14164414335");
	testq3("p+2.tb.8+10.ts.0+12.tb.4+8.s.2", "S14164414335");
	testq3("p+2.tb.8+10.ts.0+12.tb.4+8.s.4", "S14164414335");
	testq3("p+2.tb.8+10.ts.0+12.tb.4+8.s.6", "S14164414335");
}

function testq3(testcase, hash) {
	var figure = Figure.combineQ3(testcase);
	if (figure.hash != hash)
		throw "testcase " + testcase + " failed! figure hash " + figure.hash + " != " + hash;
	return figure;
}
