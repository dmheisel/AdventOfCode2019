const Moon = require("./moon");

test("Moon class instantiates correctly.", () => {
	const io = new Moon("Io");
	expect(io.name).toBe("Io");
	expect(io.position).toEqual({ x: 0, y: 0, z: 0 });
	expect(io.velocity).toEqual({ x: 0, y: 0, z: 0 });
});

test("Moon apply velocity increases position by adding values in its velocity to its position", () => {
	const io = new Moon("Io", null, { x: 1, y: 2, z: -1 });
	io.applyVelocity();
	expect(io.position).toEqual({ x: 1, y: 2, z: -1 });
});
test("Moon apply velocity does NOT change the intitial position values", () => {
    const io = new Moon("Io", null, { x: 1, y: 2, z: -1 });
	io.applyVelocity();
    expect(io.position).toEqual({ x: 1, y: 2, z: -1 });
    expect(io.initialPosition).toEqual({x: 0, y: 0, z: 0})
})

test("Moon update velocity function updates velocity by adding provided values", () => {
	const io = new Moon("Io", null, { x: 1, y: -1, z: 10 });
	io.updateVelocity({ x: 3, y: 0, z: -2 });
	expect(io.velocity).toEqual({ x: 4, y: -1, z: 8 });
});
describe("Moon total energy calculations work correctly.", () => {
	const io = new Moon("Io", { x: 2, y: 1, z: -3 }, { x: -3, y: -2, z: 1 });
	const ganymede = new Moon(
		"Ganymede",
		{ x: 3, y: -6, z: 1 },
		{ x: 3, y: 2, z: -3 }
	);

	test("Moon potential energy method provides total potential energy (sum of abs value of positions)", () => {
		expect(io.calculatePotentialEnergy()).toBe(6);
		expect(ganymede.calculatePotentialEnergy()).toBe(10);
	});
	test("Moon kinetic energy calculation provides total kinetic energy (sum of abs value of velocity)", () => {
		expect(io.calculateKineticEnergy()).toBe(6);
		expect(ganymede.calculateKineticEnergy()).toBe(8);
	});
	test("Moon total energy calculation provides potential energy * kinetic energy", () => {
		expect(io.calculateTotalEnergy()).toBe(36);
		expect(ganymede.calculateTotalEnergy()).toBe(80);
	});
});
