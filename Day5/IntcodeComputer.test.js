const IntcodeComputer = require("./IntcodeComputer");

test("class instantiation retains data", () => {
	const computer = new IntcodeComputer("Day2/input.txt");
	expect(computer instanceof IntcodeComputer).toBe(true);
	expect(computer.file).toBe("Day2/input.txt");
});

test("IntcodeComputer class method for processing file returns data as array", () => {
	const computer = new IntcodeComputer("Day2/input.txt");
	expect(computer instanceof IntcodeComputer).toBe(true);
	expect(Array.isArray(computer.data)).toBe(true);
});

test("IntcodeComputer set data and reset data methods properly set data and re-set to original", () => {
	const computer = new IntcodeComputer("Day2/input.txt");
	const firstData = computer.data;
	const testData = [1, 2, 3, 4];
	expect(computer.data).toEqual(computer.processInputFile(computer.file));
	computer.data = testData;
	expect(computer.data).toEqual(testData);
	computer.resetData();
	expect(computer.data).toEqual(firstData);
});

test("Pointer starts at 0, moves 1 by default, and can be moved as desired.", () => {
	const computer = new IntcodeComputer();
	const initialState = computer.pointer;
	expect(initialState).toBe(0);
	computer.movePointer();
	expect(computer.pointer).toBe(1);
	computer.movePointer(1000000);
	expect(computer.pointer).toBe(1000001);
});

test("parseCode returns ADD opcode for 01", () => {
    const computer = new IntcodeComputer
    const data1 = [2, 3, 4, 3]
    const data2 = [1,4,2,3]
    const pointer = 0
    const result1 = computer.parseOpcode(data1, pointer)
    const result2 = computer.parseOpcode(data2, pointer)
    expect(result1.name).toBe('02')
    expect(result2.name).toBe('01')
})
