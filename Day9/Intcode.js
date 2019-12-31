const fs = require("fs");
const ADD = "01"; // Add
const MUL = "02"; // Multiply
const INP = "03"; // Input
const OUT = "04"; // Output
const JIT = "05"; // Jump - if - true
const JIF = "06"; // Jump - if - false
const LES = "07"; // Less than
const EQL = "08"; // Equal
const REL = "09"; // Adjust Relative Base
const STP = "99"; // Stop/End code

const POS_MODE = "0"; // Position Mode -- use value this position points to
const IMM_MODE = "1"; // Immediate Mode - use value AT this position
const REL_MODE = "2"; // Relative Mode -- use value at relative base

class Intcode {
	constructor(fileIn = null, inputs = null, infeedbackMode = false) {
		this._file = fileIn;
		this._inputs = Array.isArray(inputs) ? inputs : [inputs];
		this._originalData =
			this._file !== null && this.processInputFile(this._file);
		this.data = this._originalData && [...this._originalData];

		this.pointer = 0;
		this.relativeBase = 0;

		this.output = [];
		this.canPause = infeedbackMode
		this.paused = false;

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
			[INP]: {
				name: INP,
				params: 1,
				fn: c => {
					this.data[c] = this.inputs.shift();
				},
				write: true
			},
			[OUT]: {
				name: OUT,
				params: 1,
				fn: c => {
					this.output.push(c);
				}
			},
			[JIT]: {
				name: JIT,
				params: 2,
				fn: (a, b) => {
					if (a !== 0) {
						this.incrementPointer(b, true);
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
					if (a === 0) {
						this.incrementPointer(b, true);
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
				fn: (a, b, c) => (this.data[c] = a < b ? 1 : 0),
				write: true
			},
			[EQL]: {
				name: EQL,
				params: 3,
				fn: (a, b, c) => (this.data[c] = a === b ? 1 : 0),
				write: true
			},
			[REL]: {
				name: REL,
				params: 1,
				fn: a => this.incrementRelativeBase(a)
			},
			[STP]: {
				name: STP,
				params: 0,
				fn: () => {
					// console.log("END CODE RCVD");
					this.paused = true;
				}
			}
		};
	}

	parseOpcode() {
		let code = this.data[this.pointer].toString().padStart(5, "0");
		let opcode = this.opcodes[code.substr(-2)];
		this.incrementPointer();
		return { ...opcode, code };
	}
	accessData(position) {
		if (this.data.length < position) {
			this.data = this.data.concat(
				Array(position - this.data.length + 1).fill(0)
			);
		}
		return this.data[position]
	}
	parseParameters(op) {
		let values = [];
		let parameters = Array(op.params).fill(0);
		parameters.forEach((_, i) => {
			let mode = op.code
				.substr(0, 3)
				.split("")
				.reverse()[i]; // gets mode of current position
			let value;
			let tempPointer = this.accessData(this.pointer + i);
			if (mode == IMM_MODE) {
				value = tempPointer
			} else if (mode == POS_MODE) {
				if (op.write && i === op.params - 1) {
					value = tempPointer
				} else {
					value = this.accessData(tempPointer)
				}
			} else if (mode == REL_MODE) {
				if (op.write && i === op.params - 1) {
					value = this.relativeBase + tempPointer
				} else {
					value = this.accessData(this.relativeBase + tempPointer)
				}
			}
			values.push(Number(value));
		});

		return values;
	}
	run() {
		let opcode = this.parseOpcode();
		while (!this.paused) {
			this.runOpcode(opcode);
			if ((this.canPause && opcode.name === OUT) || this.paused === true) {
				// console.log("pausing run on opcode: ", opcode)
					break;
			}			
			opcode = this.parseOpcode();
		}
		// console.log("Run command complete - output is: ", this.output.length > 1 ? this.output : this.output[0])
		return this.output;
	}
	runOpcode(op) {
		let values = this.parseParameters(op);
		let result = op.fn(...values);
		if (!op.jumper || (op.jumper && !result)) {
			this.incrementPointer(op.params);
		}
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
		jump ? (this.pointer = step) : (this.pointer += step); // if jump mode, move pointer to position, otherwise increment by step
		//ensure that the program memory has enough positions for the pointer, fills extras with 0.
		if (this.data.length < this.pointer) {
			this.data = this.data.concat(
				Array(this.pointer - this.data.length).fill("0")
			);
		}
	}
	incrementRelativeBase(step = 1) {
		this.relativeBase += step;
		if (this.data.length < this.relativeBase) {
			this.data = this.data.concat(
				Array(this.relativeBase - this.data.length).fill("0")
			);
		}
	}

	get file() {
		return this._file;
	}
	set file(newFile) {
		this._file = newFile;
	}
	get inputs() {
		return this._inputs;
	}
	set inputs(newinputs) {
		this._inputs = newinputs;
	}
	resetData() {
		this.data = this._originalData.slice();
	}
	processInputFile(file) {
		let data = fs.readFileSync(file, "utf8");
		return data.split(",").map(el => (el = Number(el)));
	}
}

module.exports = Intcode;

// const computer = new Intcode("Day9/input.txt", 2);
// computer.run()

