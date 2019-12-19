const fs = require("fs");
const Wire = require("./Wire");
const mathjs = require("mathjs");

class Grid {
	constructor(file) {
		this.instructions = this.processInstructions(file);
		this.wires = this.instructions.map(steps => new Wire(steps));
	}

	processInstructions(file) {
		const data = fs.readFileSync(file, "utf8");
		const instructions = data.split("\n").map(wire => wire.split(","));
		return instructions;
	}

    calculateIntersections = wires => {
        let result = []
		wires[0].segments.forEach((segmentA, indexA) => {
			wires[1].segments.forEach((segmentB, indexB) => {
				let response = mathjs.intersect(
					segmentA[0],
					segmentA[1],
					segmentB[0],
					segmentB[1]
				);
                if (response !== null) {
                    //remove starting point of [0,0]
                    if (response[0] === response[1] && response[0] === 0) {
                        return;
                    }
					let rX = response[0];
					let rY = response[1];
					if (
						//don't return anything outside of line segments (only want along wires)
						//X outside of range
						rX < Math.min(segmentA[0][0], segmentA[1][0]) ||
						rX < Math.min(segmentB[0][0], segmentB[1][0]) ||
						rX > Math.max(segmentA[0][0], segmentA[1][0]) ||
						rX > Math.max(segmentB[0][0], segmentB[1][0]) ||
						//Y outside of range
						rY < Math.min(segmentA[0][1], segmentA[1][1]) ||
						rY < Math.min(segmentB[0][1], segmentB[1][1]) ||
						rY > Math.max(segmentA[0][1], segmentA[1][1]) ||
						rY > Math.max(segmentB[0][1], segmentB[1][1])
					) {
						return;
					} else {
                        console.log('Found intersection at: ', response, "index A: ", indexA, ", index B: ", indexB)
                        result.push(response)
					}
				}
			});
        });
        return result
    };
    
    findClosestByManhattan = (intersections) => {
        return Math.min(...intersections.map(coordinate => Math.abs(coordinate[0]) + Math.abs(coordinate[1])))
    }
    

}

const file = "Day3/testExample2.txt";
const wires = [
	["R3", "D2", "L6"],
	["L1", "D4", "L2", "D3"]
];
const grid = new Grid(file);
// console.log(grid.instructions)
// grid.wires = wires.map(steps => new Wire(steps));
const intersections = grid.calculateIntersections(grid.wires)
const closest = grid.findClosestByManhattan(intersections)
// console.log(grid.wires[1].steps.length)
// console.log(grid.wires[1].segments.length)
console.log(closest)

