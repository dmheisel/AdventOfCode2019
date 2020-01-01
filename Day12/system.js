const Moon = require('./moon')
const input = require('./input')

class System {
    constructor(moons) {
        this._moons = {};
        moons && moons.forEach(moon => this._moons[moon[0]] = new Moon(...moon))
        this.currentTime = 0; 
    }
    simulate(steps) {
        for (let i = 0; i < steps; i++) {
            this.stepTime();
        }
    }
    stepTime() {
        this.applyGravity();
        this.currentTime++;
    }
    applyGravity() {
        let moons = Object.values(this.moons)
        moons.forEach((moon, index) => {
            let gravityShift = { x: 0, y: 0, z: 0 };
            moons.forEach((compareMoon, compareIndex) => {
                if (index !== compareIndex) {
                    for (let vector of Object.keys(moon.position)) {
                        if (moon.position[vector] > compareMoon.position[vector]) {
                            gravityShift[vector] -= 1
                        } else if (moon.position[vector] < compareMoon.position[vector]) {
                            gravityShift[vector] += 1
                        }
                    }
                    
                }
            })
            moon.updateVelocity(gravityShift);
        })
        moons.forEach(moon => {
            moon.applyVelocity()
        })
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
        return this._moons
    }
    addMoon(moon) {
        this.moons[moon[0]] = new Moon(...moon)
    }
    
}

module.exports = System;

const jupiter = new System(input);

