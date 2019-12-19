const {Wire, WireGrid} = require('./wireTracker');

test("wire class instantiated correctly", () => {
	const wire = new Wire();
	expect(wire instanceof Wire).toBe(true)
})

test("WireGrid class instantiated correctly and created two wires from list of instructions", () => {
	const testFile = 'Day3/testExample1.txt'
	const testResult = [["R75","D30","R83","U83","L12","D49","R71","U7","L72"],
	["U62","R66","U55","R34","D71","R55","D58","R83"]]
	const wireGrid = new WireGrid(testFile)
	expect(wireGrid instanceof WireGrid).toBe(true)
	expect(wireGrid.instructions).toEqual(testResult);
	expect(wireGrid.wires.every(wire => wire instanceof Wire)).toBe(true)
})

test("Wire class parseStep method gives the intended result - R3 to [[1,0], [2,0], [3,0]]", () => {
	const testStep = "R3";
	const startingPoint = [0,0]
	const testResult = [[1, 0], [2, 0], [3, 0]]
	const wire = new Wire()
	const result = wire.parseStep(testStep, startingPoint)
	expect(result).toEqual(testResult);
})

test("Wire class parseSteps method parses multiple steps to bring to the correct end point.", () => {
	const testSteps = ["R3", "U2", "L2", "D3"]
	const testResult = [1, -1]
	const wire = new Wire()
	const result = wire.parseSteps(testSteps);
	expect(result[result.length -1]).toEqual(testResult)
})