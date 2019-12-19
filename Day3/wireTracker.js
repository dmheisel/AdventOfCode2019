const fs = require("fs");

class WireGrid {
	constructor(file) {
		this.instructions = this.processInstructions(file);
		this.wires = this.wireTracks(this.instructions);
	}

	processInstructions(file) {
		const data = fs.readFileSync(file, "utf8");
		const instructions = data.split("\n").map(wire => wire.split(","));
		return instructions;
	}

	wireTracks(instructions) {
		return instructions.map(wire => new Wire(wire));
	}

	findClosestIntersection(wires) {
		let intersections = wires[0].wireTrack.filter(pointA =>
			wires[1].wireTrack.some(
				pointB => pointA[0] === pointB[0] && pointA[1] === pointB[1]
			)
		);
		return Math.min(...intersections.map(point => Number(Math.abs(point[0] + Math.abs(point[1])))));
	}
}

class Wire {
	constructor(steps) {
		steps && ((this.steps = steps), (this.wireTrack = this.parseSteps(steps)));
	}

	parseStep(step, startingPoint) {
		let direction = step[0];
		let length = Number(step.slice(1));
		let segment = [];
		//index sets to move either x or y coordinate
		let changeIndex = direction === "R" || direction === "L" ? 0 : 1;
		//value sets it to increase or decrease x/y coordinate
		let changeValue = direction === "R" || direction === "U" ? 1 : -1;

		while (length > 0) {
			// use the starting point as the stepping off point for the first step,
			// then use each new step for following steps
			let newEntry = [...(segment[segment.length - 1] || startingPoint)];
			// console.log(newEntry)
			newEntry[changeIndex] += changeValue;
			segment.push(newEntry);
			// console.log(segment);
			length--;
		}
		return segment;
	}
	parseSteps(steps) {
		let startingPoint = [0, 0];
		let wire = [];
		for (let step of steps) {
			if (wire.length > 0) {
				startingPoint = wire[wire.length - 1];
			}
			let newSegment = this.parseStep(step, startingPoint);
			wire = wire.concat(newSegment);
		}

		return wire;
	}
}

module.exports = { Wire, WireGrid };

// const file = "Day3/input.txt";
// const wireGrid = new WireGrid(file);
// const length = wireGrid.findClosestIntersection(wireGrid.wires);
// console.log(length);
// const wire = new Wire(["D3", "R2", "U7"]);p
// console.log(wire.wireTrack)
// console.log('final answer: ', wire.parseSteps(wire.steps))

// console.log(wire.parseStep("D7", [1, 8]));
