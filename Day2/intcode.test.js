const Intcode = require("./intcode");

test("initialized state of Intcode class", () => {
	const intcode = new Intcode();
	expect(intcode instanceof Intcode).toBe(true);
});

test("initial state of Intcode program contains the raw data we passed it", () => {
	const data = "1,1,1,1";
	const intcode = new Intcode(data);
	expect(intcode.rawData).toEqual(data);
});

test("intcode returns output of opcode 1 properly on 4 numbers", () => {
    let data = '1,0,0,0';
    let intcode = new Intcode();
    let expectedResult = '2,0,0,0';
    expect(intcode.opcodeOne(data, 0).join()).toBe(expectedResult)
})

test("intcode returns output of opcode 2 properly on 4 numbers", () => {
    let data = "2,3,0,3,99";
    let intcode = new Intcode()
    let expectedResult = "2,3,0,6,99";
    expect(intcode.opcodeTwo(data, 0).join()).toBe(expectedResult)
})

test("intcode processes long string containing two opcodes", () => {
    let data = "1,0,0,0,2,5,6,0,99"
    let intcode = new Intcode()
    let expectedResult = "30,0,0,0,2,5,6,0,99"
    expect(intcode.process(data)).toBe(expectedResult);
    let dataTwo = "2,4,4,5,99,0";
    let expectedResultTwo = "2,4,4,5,99,9801";
    expect(intcode.process(dataTwo)).toBe(expectedResultTwo)
})

test("intcode class report works on raw data created with constructor", () => {
    let data = "1,0,0,0,2,5,6,0,99";
    let intcode = new Intcode(data)
    let expectedResult = "30,0,0,0,2,5,6,0,99";
    expect(intcode.report()).toBe(expectedResult)
    let dataTwo = "2,4,4,5,99,0";
    let expectedResultTwo = "2,4,4,5,99,9801";
    intcode.rawData = dataTwo
    expect(intcode.report()).toBe(expectedResultTwo)
})


