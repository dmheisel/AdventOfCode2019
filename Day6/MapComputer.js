const fs = require("fs");
const {intersection} = require('lodash')

class Planet {
	constructor(name) {
		this._name = name;
		this._orbits;
	}
	get name() {
		return this._name;
	}
	get orbits() {
		return this._orbits;
	}
	set orbits(planet) {
		this._orbits = planet;
	}

	countOrbits() {
		return this.orbits ? 1 + this.orbits.countOrbits() : 0;
    }
    
    listOrbit() {
        let orbitList = []
        return this.orbits ? orbitList = [this.orbits.name, ...this.orbits.listOrbit()] : orbitList
	}
}

class OrbitMap {
	constructor(file = null) {
		this._file = file;
		this.data = this._file !== null && this.processInputFile(file);
		this.map = this.data && this.buildMap(this.data);
	}

	processInputFile(file) {
		const data = fs.readFileSync(file, "utf8");
		return data.split("\n").map(el => el.split(")"));
	}

	buildMap(data) {
		const map = {};

		data.forEach(([p1, p2]) => {
			if (!map[p1]) {
				map[p1] = new Planet(p1);
			}
			if (!map[p2]) {
				map[p2] = new Planet(p2);
			}
        });
        
		data.forEach(([p1, p2]) => {
			map[p2].orbits = map[p1];
		});
		return map;
    }
    
    checkSum(map = this.map) {
        let sum = Object.values(map).reduce((a, b) => a + b.countOrbits(), 0)
        console.log("Sum of total orbits: ", sum)
	}
	
	calculateDistance(planet1, planet2) {
		let commonOrbit = intersection(this.map[planet1].listOrbit(), this.map[planet2].listOrbit())[0]
		let planet1Distance = this.map[planet1].listOrbit().indexOf(commonOrbit)
		let planet2Distance = this.map[planet2].listOrbit().indexOf(commonOrbit)
		return planet1Distance + planet2Distance
	}
}

const orbitMap = new OrbitMap("Day6/input.txt");

orbitMap.checkSum()

let distanceToSanta = orbitMap.calculateDistance("YOU", "SAN")
console.log(distanceToSanta)