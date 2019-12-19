class PassCracker {
	constructor(min, max) {
		this._min = min;
		this._max = max;
	}
	get min() {
		return this._min;
	}

	get max() {
		return this._max;
	}

	findPossiblePasswords() {
		let response = Array.from(
			{ length: this.max - this.min + 1 },
			(_, i) => this.min + i
		)
			.filter(
				num =>
					/(\d)\1+/g.test(num) &&
					num
						.toString()
						.match(/(\d)\1+/g)
						.some(el => el.length === 2)

				// && num.toString().match(/(\d)\1+/g).length === 2
			)
			.filter(num =>
				num
					.toString()
					.split("")
					.every(
						(el, i, arr) =>
							(i < arr.length - 1 && el <= arr[i + 1]) ||
							(i === arr.length - 1 && el >= arr[i - 1])
					)
			);
		return response;
	}

	totalPossiblePasswordCount() {
		return this.findPossiblePasswords(this.min, this.max).length;
	}
}

module.exports = PassCracker;

const passCracker = new PassCracker(254032, 789860);
// console.log(passCracker.totalPossiblePasswordCount());
