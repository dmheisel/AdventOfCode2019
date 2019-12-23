const fs = require("fs");
const ADD = "01"; // Add
const MUL = "02"; // Multiply
const INP = "03"; // Input
const OUT = "04"; // Output
const JIT = "05"; // Jump - if - true
const JIF = "06"; // Jump - if - false
const LES = "07"; // Less than
const EQL = "08"; // Equal
const STP = "99"; // Stop/End code

const POS_MODE = "0";
const IMM_MODE = "1";

class IntcodeComputer {
	constructor(fileIn = null, inputValue = null) {
		this._file = fileIn;
		this.inputValue = inputValue;
		this._originalData =
			this._file !== null && this.processInputFile(this._file);
		this.data = this._originalData && [...this._originalData];
		this.pointer = 0;
		this.opcodes = {
			[ADD]: {
				name: ADD,
				params: 3,
				fn: (a, b, c) =>
					(this.data[c.index] = this.parseMode(a) + this.parseMode(b)),
				write: true
			},
			[MUL]: {
				name: MUL,
				params: 3,
				fn: (a, b, c) =>
					(this.data[c.index] = this.parseMode(a) * this.parseMode(b)),
				write: true
			},
			[INP]: {
				name: INP,
				params: 1,
				fn: c => (this.data[c.index] = this.inputValue)
			},
			[OUT]: {
				name: OUT,
				params: 1,
				fn: c =>
					console.log("output opcode received, output is: ", this.parseMode(c))
			},
			[JIT]: {
				name: JIT,
				params: 2,
				fn: (a, b) => {
					if (this.parseMode(a) !== 0) {
						this.incrementPointer(this.parseMode(b), true)
						return true;
					} else {
						return false;
					}
				},
				jumper: true
			},
			[JIF]: {
				name: JIF,
				params: 2,
				fn: (a, b) => {
					if (this.parseMode(a) === 0) {
						this.incrementPointer(this.parseMode(b), true)
						return true;
					} else {
						return false;
					}
				},
				jumper: true
			},
			[LES]: {
				name: LES,
				params: 3,
				fn: (a, b, c) =>
					(this.data[c.index] = this.parseMode(a) < this.parseMode(b) ? 1 : 0),
				write: true
			},
			[EQL]: {
				name: EQL,
				params: 3,
				fn: (a, b, c) =>
					(this.data[c.index] = this.parseMode(a) === this.parseMode(b) ? 1 : 0),
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
		let code = this.data[this.pointer].toString().padStart(5, "0");
		let opcode = this.opcodes[code.substr(-2)];
		this.incrementPointer();
		return { ...opcode, code };
	}
	run() {
		this.pointer = 0; // reset pointer back to 0 at start of run program
		let opcode = this.parseOpcode();
		while (opcode.name !== STP) {
			this.runOpcode(opcode);
			opcode = this.parseOpcode();
		}
		return this.data;
		// console.log("Operation complete, new data is: ", this.data);
	}
	runOpcode(op) {
		let values = [];
		for (let i = 0; i < op.params; i++) {
			let changeIndex = this.data[this.pointer + i];
			let changeValue = this.data[changeIndex];
			let parameter = {
				index: changeIndex,
				value: changeValue,
				mode: op.code
					.substr(0, 3)
					.split("")
					.reverse()[i]
			};
			values.push(parameter);
		}
		// console.log(op);
		// console.log(...values);

		let result = op.fn(...values);
		if (!op.jumper || (op.jumper && !result)) {
			this.incrementPointer(op.params);
		}
	}
	parseMode(parameter) {
		return parameter.mode === "0" ? parameter.value : parameter.index;
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

	incrementPointer(step = 1, jump = false) {
		jump ? this.pointer = step : this.pointer += step
		// console.log("pointer moved to: ", this.pointer, "value at pointer is: ", this.data[this.pointer])
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

const computer = new IntcodeComputer("Day5/input.txt", 5);
console.log(computer.run());
// computer.traceInput(19690720);
