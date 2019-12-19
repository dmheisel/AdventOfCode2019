const fs = require("fs");
const ADD = "01"; // Add
const MUL = "02"; // Multiply
const STP = "99"; // Stop/End code

// const POSITION_MODE = "0";
// const IMMEDIATE_MODE = "1";

class IntcodeComputer {
	constructor(fileIn = null) {
		this._file = fileIn;
		this._originalData =
			this._file !== null && this.processInputFile(this._file);
		this.data = [...this._originalData];
		this.pointer = 0;
		this.opcodes = {
			[ADD]: {
				name: ADD,
				params: 3,
				fn: (a, b, c) => (this.data[c] = a + b),
				write: true
			},
			[MUL]: {
				name: MUL,
				params: 3,
				fn: (a, b, c) => (this.data[c] = a * b),
				write: true
			},
			[STP]: {
				name: STP,
				params: 1,
				fn: (...a) => console.log("END CODE RCVD", a)
			}
		};
	}

	parseOpcode() {
		let code = this.data[this.pointer].toString().padStart(2, "0");
		let opcode = this.opcodes[code];
		return opcode;
	}
	run() {
		this.pointer = 0;
		let opcode = this.parseOpcode();
		while (opcode.name !== STP) {
			this.runOpcode(opcode);
			opcode = this.parseOpcode();
		}
		return this.data;
		// console.log("Operation complete, new data is: ", this.data);
	}
	runOpcode(op) {
		this.incrementPointer();
		let values = [];
		for (let i = 0; i < op.params; i++) {
			let changeIndex = this.data[this.pointer + i];
			op.write && i === op.params - 1
				? values.push(changeIndex)
				: values.push(this.data[changeIndex]);
		}
		op.fn(...values);
		this.incrementPointer(op.params);
		// console.log(`completed opcode ${op.name} on ${values}, pointer moved to ${this.pointer},  data is now: `, this.data, )
	}
	traceInput(output) {
		let testData = [...this.data];
		const nums = Array(100)
			.fill(0)
			.map((v, i) => i);

		for (let noun of nums) {
			for (let verb of nums) {
				this.data = [...testData];
				this.data[1] = noun;
				this.data[2] = verb;
				let result = this.run();
				if (result[0] == output) {
					console.log("input found: ", 100 * noun + verb);
					return 100 * noun + verb;
				}
			}
		}
	}

	incrementPointer(step = 1) {
		this.pointer += step;
	}

	get file() {
		return this._file;
	}
	set file(newFile) {
		this._file = newFile;
	}
	resetData() {
		this.data = this._originalData;
	}
	processInputFile(file) {
		let data = fs.readFileSync(file, "utf8");
		return data.split(",").map(el => (el = Number(el)));
	}
}

module.exports = IntcodeComputer;

const computer = new IntcodeComputer("Day2/input.txt");

computer.traceInput(19690720);
