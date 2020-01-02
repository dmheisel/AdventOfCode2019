let mathJs = require("mathjs");
let vectors = ["x", "y", "z"];

class Moon {
	constructor(name, position = null, velocity = null) {
		this._name = name;
		this._position = position || { x: 0, y: 0, z: 0 };
		this._initialPosition = {};
		vectors.forEach(vector => {
			this._initialPosition[vector] = position[vector] || 0
		})
		this._velocity = velocity || { x: 0, y: 0, z: 0 };
	}
	//apply the moons velocity to update its current position - done on each time tick in system.
	applyVelocity() {
		vectors.forEach(vector => {
			this.position[vector] += this.velocity[vector];
		});
	}
	//updates velocity with new values -- given from gravity calculations.
	updateVelocity(newVelocity, numOfSteps) {
		vectors.forEach(vector => {
			this.velocity[vector] += newVelocity[vector];
		});
	}

	//energy calculations - could combine into one? left separate in case pot or kin energy is every needed
	calculatePotentialEnergy() {
		return Object.values(this.position).reduce(
			(a, b) => Math.abs(a) + Math.abs(b),
			0
		);
	}
	calculateKineticEnergy() {
		return Object.values(this.velocity).reduce(
			(a, b) => Math.abs(a) + Math.abs(b),
			0
		);
	}
	calculateTotalEnergy() {
		return this.calculatePotentialEnergy() * this.calculateKineticEnergy();
	}

	//getters and setters
	get name() {
		return this._name;
	}
	get initialPosition() {
		return this._initialPosition;
	}
	get position() {
		return this._position;
	}
	get velocity() {
		return this._velocity;
	}
	get axisPeriods() {
		return this._axisPeriods;
	}
	get period() {
		return this._period;
	}
	set position(newPosition) {
		this._position = newPosition;
	}
	set velocity(newVelocity) {
		this._velocity = newVelocity;
	}
	set axisPeriods(newPeriods) {
		this._axisPeriods = newPeriods;
	}
	set period(newPeriod) {
		this._period = newPeriod;
	}
}

module.exports = Moon;
