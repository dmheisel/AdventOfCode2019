const fs = require("fs");
const ADD = "01"; // Add
const MUL = "02"; // Multiply
const STP = '99'; // Stop/End code

// const POSITION_MODE = "0";
// const IMMEDIATE_MODE = "1";

class IntcodeComputer {
	constructor(fileIn = null) {
		this._file = fileIn;
		this._originalData = this.file !== null && this.processInputFile(this.file);
		this.data = this._originalData;
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
                params: 0,
                fn: (...a) => console.log("END CODE RCVD", a)
            }
		};
    }
    
    parseOpcode() {
        let code = this.data[this.pointer].toString().padStart(2, '0');
        let opcode = this.opcodes[code]
        return opcode
    }
    run() {
        let opcode = this.parseOpcode();
        while (opcode.name !== STP) {
            this.runOpcode(opcode)
            opcode = this.parseOpcode()
        }
        console.log("Operation complete, new data is: ", this.data)
    }
    runOpcode(op) {
        this.incrementPointer()
        let values = []
        for (let i = 0; i < op.params; i++) {
            values.push(this.data[this.data[this.pointer]]);
            this.incrementPointer()
        }
        op.fn(...values)
        // console.log(`completed opcode ${op.name} on ${values}, pointer moved to ${this.pointer},  data is now: `, this.data, )
    }
    
    incrementPointer(step = 1) {
        this.pointer += step
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
// console.log(computer.opcodes);
// console.log(computer.parseOpcode())
// console.log(computer.run(computer.data))
// computer.traceInput(19690720, computer.data);
console.log(computer.data)
computer.run()
console.log(computer.data)