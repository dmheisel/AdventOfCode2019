const Intcode = require("./Intcode");

describe("class instantiation is functioning correctly", () => {
	const computer = new Intcode("Day2/input.txt");

	test("class instantiation retains data, pointers start at 0, reads feedbackmode, paused", () => {
		expect(computer instanceof Intcode).toBe(true);
		expect(computer.file).toBe("Day2/input.txt");
		expect(computer.pointer).toBe(0);
		expect(computer.relativeBase).toBe(0)
		expect(computer.paused).toBe(false)
		expect(computer.canPause).toBe(false)
	});

	test("Intcode class method for processing file returns data as array", () => {
		expect(Array.isArray(computer.data)).toBe(true);
	});
	test("Intcode set data and reset data methods properly set data and re-set to original", () => {
		const firstData = computer.data;
		const testData = [1, 2, 3, 4];
		expect(computer.data).toEqual(computer.processInputFile(computer.file));
		computer.data = testData;
		expect(computer.data).toEqual(testData);
		expect(computer._originalData).toEqual(firstData)
		computer.resetData();
		expect(computer.data).toEqual(firstData);
	});
})

describe("intcode pointer works as expected", () => {
	const intcode = new Intcode()
	test("Pointer starts at 0", () => {
		expect(intcode.pointer).toBe(0)
	})
	test("Increment pointer increases pointer by number provided", () => {
		intcode.incrementPointer(5);
		expect(intcode.pointer).toBe(5)
	})
	test("increment pointer optional parameter of jump moves pointer to specific position", () => {
		intcode.incrementPointer(3, true);
		expect(intcode.pointer).toBe(3)
	})
})

describe("opcode basic testing - opcode functions work as expected", () => {
	let intcode;
	beforeEach(() => {
		intcode = new Intcode();
	})
	test("ParseOpcode function works accurately.", () => {
		intcode.data = [1,2,3,0,99]
		const parsedOpcode = intcode.parseOpcode()
		expect(parsedOpcode.name).toBe('01')
		expect(parsedOpcode.code).toBe('00001')
		intcode.incrementPointer(3)
		const secondParsedOpcode = intcode.parseOpcode()
		expect(secondParsedOpcode.name).toBe('99')
	})
	test("ADD opcode", () => {
		intcode.data = [1, 2, 3, 0, 99]
		let expectedResult = [3, 2, 3, 0, 99]
		intcode.run()
		expect(intcode.data).toEqual(expectedResult)
	})
	test("MUL opcode", () => {
		intcode.data = [2, 0, 2, 0, 99]
		let expectedResult = [4, 0, 2, 0, 99]
		intcode.run()
		expect(intcode.data).toEqual(expectedResult)
	})
	test("INP opcode", () => {
		intcode.data = [3, 0, 99]
		intcode.addInput(101);
		let expectedResult = [101, 0, 99];
		intcode.run();
		expect(intcode.data).toEqual(expectedResult)
	})
	test("OUT opcode", () => {
		intcode.data = [4, 0, 99];
		let expectedResult = 4;
		intcode.run();
		expect(intcode.output.pop()).toBe(expectedResult)
	})
	test("JIT opcode", () => {
		intcode.data = [5, 1, 5, 6, 2, 99]
		let opcode = intcode.parseOpcode();
		intcode.runOpcode(opcode)
		expect(intcode.pointer).toBe(99)
	})
	test("JIF opcode", () => {
		intcode.data = [6, 1, 5, 6, 2, 99]
		let opcode = intcode.parseOpcode();
		intcode.runOpcode(opcode)
		expect(intcode.pointer).toBe(3)
	})
	test("LES opcode", () => {
		intcode.data = [7, 2, 1, 0, 99]
		let expectedResult = [1,2,1,0,99]
		intcode.run()
		expect(intcode.data).toEqual(expectedResult)
	})
	test("EQL opcode", () => {
		intcode.data = [8, 2, 1, 0, 99]
		let expectedResult = [0, 2, 1, 0, 99]
		intcode.run()
		expect(intcode.data).toEqual(expectedResult)
	})
	test("REL opcode", () => {
		intcode.data = [9, 0, 99]
		intcode.run()
		expect(intcode.relativeBase).toBe(9)
	})
	test("STP intcode", () => {
		intcode.data = [99]
		intcode.run()
		expect(intcode.paused).toBe(true)
	})
});

describe("Position, Immediate, and Relative Modes change data accessed", () => {
	let intcode
	beforeEach(() => {
		intcode = new Intcode()
	})
	test("Position mode gathers data from the position the parameter points to (parameter 3 should get data from index 3)", () => {
		intcode.data = [4, 3, 99, 315]
		intcode.run()
		expect(intcode.output.shift()).toBe(315)
	})
	test("Immediate mode gathers data from the position at the parameter (parameter 3 should get give data of 3)", () => {
		intcode.data = [104, 3, 99, 315]
		intcode.run()
		expect(intcode.output.shift()).toBe(3)
	})
	test("Relative Base mode gathers data from position at relative base + parameter", () => {
		intcode.data = [204, 1, 99, 315]
		intcode.relativeBase = 1
		let result = intcode.run()
		expect(result.shift()).toBe(99)
	})
	test("Immediate mode overwritten by op writing, should behave as position mode", () => {
		intcode.data = [10001, 4, 0, 0, 99]
		intcode.run()
		expect(intcode.data).toEqual([10100,4,0,0,99])
	})
})

describe("Intcode data accessing, manipulating", () => {
	let intcode
	beforeEach(() => {
		intcode = new Intcode()
	})
	test("Accessing Memory points beyond data set provided return 0's", () => {
		intcode.data = [99];
		expect(intcode.accessData(10)).toBe(0)
	})
});

describe("Feedback mode tests", () => {
	let intcode;
	beforeEach(() => {
		intcode = new Intcode(null,null,true)
	})
	test("Feedback mode sets 'canpause' to true", () => {
		expect(intcode.canPause).toBe(true);
	})
	test("Feedback mode pauses on giving output.", () => {
		const data = [1, 2, 6, 0, 4, 0, 2, 1, 2, 0,4,0, 99]
		//should hit the opcode "04" and output what's stored in 0 position (8), and pointer should stay at 6 for next run.
		intcode.data = data
		let result = intcode.run()
		expect(result.shift()).toBe(8)
		expect(intcode.pointer).toBe(6)
		intcode.run(); // second run should output 12 from second "04" output opcode, then pointer stops at 12.
		expect(result.shift()).toBe(12)
		expect(intcode.pointer).toBe(12)
	})
})
