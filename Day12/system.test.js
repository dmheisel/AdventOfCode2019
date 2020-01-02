const System = require("./system");
const Moon = require("./moon");

const initialScan = [
	["Io", { x: 16, y: -8, z: 13 }],
	["Europa", { x: 4, y: 10, z: 10 }],
	["Ganymede", { x: 17, y: -5, z: 6 }],
	["Callisto", { x: 13, y: -3, z: 0 }]
];

describe("Class Instantiation", () => {
	const moons = initialScan;
	const jupiter = new System(moons);
	const saturn = new System();
	test("System class instantiates as class type System", () => {
		expect(jupiter instanceof System).toBe(true);
	});
	test("Initial time of system is set at 0", () => {
		expect(jupiter.currentTime).toBe(0);
	});
	describe("Moons are created correctly", () => {
		test("Given an array of names, creates a moon for each name.", () => {
			expect(
				Object.values(jupiter.moons).every(moon => moon instanceof Moon)
			).toBe(true);
		});
		test("Given no array of moons, creates an empty array", () => {
			expect(saturn.moons).toEqual({});
		});
		test("Moons have correct positions per input", () => {
			expect(jupiter.moons.Io.position).toEqual({ x: 16, y: -8, z: 13 });
			expect(jupiter.moons.Ganymede.position).toEqual({ x: 17, y: -5, z: 6 });
		});
	});
});

describe("Time Step functionality for System class", () => {
	const moons = [
		["Io", { x: -1, y: 0, z: 2 }],
		["Europa", { x: 2, y: -10, z: -7 }],
		["Ganymede", { x: 4, y: -8, z: 8 }],
		["Callisto", { x: 3, y: 5, z: -1 }]
	];
	const jupiter = new System(moons);
	jupiter.stepTime();
	test("TimeStep function increases system time by 1", () => {
		expect(jupiter.currentTime).toBe(1);
    });
	test("Correctly determines velocity changes", () => {
		expect(jupiter.moons.Io.velocity).toEqual({ x: 3, y: -1, z: -1 });
		expect(jupiter.moons.Ganymede.velocity).toEqual({ x: -3, y: 1, z: -3 });
    });
    test("Correctly updates moon's position", () => {
        expect(jupiter.moons.Io.position).toEqual({ x: 2, y: -1, z: 1 })
        expect(jupiter.moons.Callisto.position).toEqual({x: 2, y: 2, z: 0})
    })
    
    test("Updates work correctly after more steps,", () => {
        for (let i = 1; i < 10; i++) {
            jupiter.stepTime()
        };
        expect(jupiter.currentTime).toBe(10)
        expect(jupiter.moons.Io.position).toEqual({ x: 2, y: 1, z: -3 })
        expect(jupiter.moons.Io.velocity).toEqual({x: -3, y: -2, z: 1})
        expect(jupiter.moons.Europa.position).toEqual({ x: 1, y: -8, z: 0 })
        expect(jupiter.moons.Ganymede.velocity).toEqual({ x: 3, y: 2, z: -3 })
    })
    test("Simulate function correctly steps time for the number provided", () => {
        jupiter.simulate(4);
        expect(jupiter.currentTime).toBe(14)
    })
});
describe("System Energy Calculations", () => {
    const moons = [
		["Io", { x: -1, y: 0, z: 2 }],
		["Europa", { x: 2, y: -10, z: -7 }],
		["Ganymede", { x: 4, y: -8, z: 8 }],
		["Callisto", { x: 3, y: 5, z: -1 }]
	];
    const jupiter = new System(moons);;
    for (let i = 0; i < 10; i++) {
        jupiter.stepTime()
    }
    test("System energy calculations work properly", () => {
        expect(jupiter.calculateSystemEnergy()).toBe(179)
    })

})

