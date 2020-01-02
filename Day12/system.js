let mathJs = require("mathjs");
const Moon = require("./moon");
const input = require("./input");
let vectors = ["x", "y", "z"];

class System {
	constructor(moons) {
		this._moons = {};
		moons && moons.forEach(moon => (this._moons[moon[0]] = new Moon(...moon)));
        this.currentTime = 0;
        this.axisPeriods = {x: null, y: null, z: null}
	}

	//simulation methods
	simulate(steps) {
		for (let i = 0; i < steps; i++) {
			this.stepTime();
		}
	}

	stepTime() {
        this.applyGravity();
        this.currentTime++;
        this.checkPeriod()
    }
    
    findPeriod() {
        let period;
        while (!period) {
            this.applyGravity();
            this.currentTime++;
            period = this.checkPeriod()
            // this.currentTime++
        }
		period *= 2
		return period
    }
    
	//calculation /update methods
	applyGravity() {
		let moons = Object.values(this.moons);
		moons.forEach((moon, moonIndex) => {
			let gravityShift = { x: 0, y: 0, z: 0 };
			moons.forEach((compareMoon, compareIndex) => {
				if (moonIndex !== compareIndex) {
					for (let vector of Object.keys(moon.position)) {
						if (moon.position[vector] > compareMoon.position[vector]) {
							gravityShift[vector] -= 1;
						} else if (moon.position[vector] < compareMoon.position[vector]) {
							gravityShift[vector] += 1;
						}
					}
				}
			});
			moon.updateVelocity(gravityShift, this.currentTime + 1);
		});
		moons.forEach(moon => {
			moon.applyVelocity();
		});
    }
    checkPeriod() {
        let systemPeriod
        for (let vector of vectors) {
            if (this.axisPeriods[vector] === null && Object.values(this.moons).every(moon => moon.velocity[vector] === 0)) { 
                let period = this.currentTime
                this.axisPeriods[vector] = period
            }
        }
        if (Object.values(this.axisPeriods).every(val => val !== null)) {            
            systemPeriod = mathJs.lcm(...Object.values(this.axisPeriods))
        }
        return systemPeriod
    }

	calculateSystemEnergy() {
		let sum = 0;
		for (let moon of Object.values(this.moons)) {
			sum += moon.calculateTotalEnergy();
		}
		return sum;
	}

	//getters, setters
	get moons() {
		return this._moons;
	}
	addMoon(moon) {
		this.moons[moon[0]] = new Moon(...moon);
	}
}

module.exports = System;

