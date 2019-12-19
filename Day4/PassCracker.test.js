const PassCracker = require("./PassCracker");

test("Class Instantiated correctly with min and max", () => {
	const passCracker = new PassCracker(3, 104);
	expect(passCracker.min).toBe(3);
	expect(passCracker.max).toBe(104);
});

test("values returned by findPossiblePasswords are between min and max values", () => {
	const passCracker = new PassCracker(5, 10);
	const result = passCracker.findPossiblePasswords();
	expect(result.every(pass => pass >= passCracker.min));
	expect(result.every(pass => pass <= passCracker.max));
});

test("Passwords must contain a set of adjacent digits such as 122345", () => {
	const passCracker = new PassCracker(0, 100);
	const result = passCracker.findPossiblePasswords();
	expect(result.every(num => /(\d)\1+/g.test(num))).toBe(true);
});

test("Password digits must all be increasing", () => {
	const passCracker = new PassCracker(310, 350);
	const result = passCracker.findPossiblePasswords();
	expect(
		result.every(num =>
			num
				.toString()
				.split("")
				.every((el, i, arr) => el <= arr[i + 1] || el >= arr[i - 1])
		)
	).toBe(true);
});

test("Gets the correct number of total possible passwords", () => {
    const passCracker = new PassCracker(100,200)
    const result = passCracker.findPossiblePasswords()
    const length = passCracker.totalPossiblePasswordCount()
    expect(length).toBe(16)
})
