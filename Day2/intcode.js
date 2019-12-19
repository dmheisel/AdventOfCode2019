const fs = require('fs')

class Intcode {
	constructor(rawData) {
		this._rawData = rawData;
	}
	get rawData() {
		return this._rawData;
	}

	report() {
		return this.process(this.rawData);
	}

	set rawData(newData) {
		this._rawData = newData;
	}

	formatToString(dataArray) {
		return dataArray.join();
	}
	formatToArray(dataString) {
		return dataString.split(",").map(datum => Number(datum));
	}

	opcodeOne(data, index) {
		if (!Array.isArray(data)) {
			data = this.formatToArray(data);
		}
		let positionOne = data[index + 1];
		let positionTwo = data[index + 2];
		let modified = data[index + 3];
		data[modified] = data[positionOne] + data[positionTwo];
		return data;
	}

	opcodeTwo(data, index) {
		if (!Array.isArray(data)) {
			data = this.formatToArray(data);
		}
		let positionOne = data[index + 1];
		let positionTwo = data[index + 2];
		let modified = data[index + 3];
		data[modified] = data[positionOne] * data[positionTwo];
		return data;
	}

	process(data) {
		if (!Array.isArray(data)) {
			data = this.formatToArray(data);
		}

		for (let i = 0; i < data.length; i += 4) {
			if (data[i] === 1) {
				data = this.opcodeOne(data, i);
			} else if (data[i] === 2) {
				data = this.opcodeTwo(data, i);
			} else if (data[i] === 99) {
				break;
			}
		}
		return this.formatToString(data);
	}

	findInputs(output) {

		for (let n = 0; n <= 100; n++) {
			for (let v = 0; v <= 100; v++) {
				let data = this.formatToArray(this.rawData);
				data[1] = n;
				data[2] = v;
				let result = this.process(data).split(",")
				if (Number(result[0]) === output) {
					return 100 * n + v;
				}
			}

		}
	};
}

module.exports = Intcode;
const data = fs.readFileSync('Day2/input.txt', { encoding: 'utf8' });
const computer = new Intcode(data);

console.log(computer.report())
// console.log(computer.findInputs(19690720))