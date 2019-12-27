const Intcode = require("./Intcode");

test("class instantiation retains data", () => {
	const computer = new Intcode("Day2/input.txt");
	expect(computer instanceof Intcode).toBe(true);
	expect(computer.file).toBe("Day2/input.txt");
});

test("Intcode class method for processing file returns data as array", () => {
	const computer = new Intcode("Day2/input.txt");
	expect(computer instanceof Intcode).toBe(true);
	expect(Array.isArray(computer.data)).toBe(true);
});
test("intcode returns output of opcode 2 properly", () => {
    let data = "2,3,0,3,99";
    let intcode = new Intcode()
    intcode.data = data;
    let opcode = intcode.parseOpcode()
    expect(opcode.name).toBe("02")
})

// test("intcode returns output of opcode 2 properly", () => {
//     let data = "2,3,0,3,99";
//     let intcode = new Intcode()
//     intcode.data = data;
//     intcode.run()
//     let opcode = intcode.parseOpcode()
//     expect(opcode.name).toBe("02")
// })

test("Intcode set data and reset data methods properly set data and re-set to original", () => {
	const computer = new Intcode("Day2/input.txt");
	const firstData = computer.data;
	const testData = [1, 2, 3, 4];
	expect(computer.data).toEqual(computer.processInputFile(computer.file));
	computer.data = testData;
	expect(computer.data).toEqual(testData);
	computer.resetData();
	expect(computer.data).toEqual(firstData);
});

test("Pointer starts at 0, moves 1 by default, and can be moved as desired.", () => {
	const computer = new Intcode();
	const initialState = computer.pointer;
	expect(initialState).toBe(0);
	computer.incrementPointer();
	expect(computer.pointer).toBe(1);
	computer.incrementPointer(1000000);
	expect(computer.pointer).toBe(1000001);
});

test("parseCode returns ADD opcode for 01", () => {
    const computer = new Intcode()
    const data1 = [2, 3, 4, 3]
	const pointer = 0
	computer.data = data1
    const result = computer.parseOpcode()
    expect(result.name).toBe('02')
})
