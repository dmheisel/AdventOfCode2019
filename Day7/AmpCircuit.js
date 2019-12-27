const IntcodeComputer = require("../Day5/IntcodeComputer");
const C = require("js-combinatorics");

class AmpCircuit {
	constructor(file, numOfAmps = 5, feedbackMode = false) {
		this.file = file;
		this.numOfAmps = numOfAmps;
        this.amps = [];
		for (let i = 0; i < numOfAmps; i++) {
			let amp = new IntcodeComputer(this.file);
            this.amps.push(amp);
		}
		this.currentAmp = 0;
	}

	runCircuit(settings) {
		let output = 0;
		this.amps.forEach((amp, index) => {
			amp.inputs = [settings[index], output];
			amp.run();
			output = Number(amp.output.shift());

		});
		return output;
	}
    recalibrateAmp(amp) {
        amp.pointer = 0;
        amp.resetData()
        amp.paused = false
    }
    runFeedbackCircuit(settings) {
        // console.log(settings)
        settings.forEach((setting, index) => {
            this.recalibrateAmp(this.amps[index])
            this.amps[index].inputs = [setting]
            if (index === 0) {
                this.amps[index].inputs.push(0)
            }
        })
        this.currentAmp = 0;
        let amp = this.amps[this.currentAmp];
		let output, lastOutput;

        while (!amp.paused) {
            let newOutput = amp.run();
			if (amp.paused) {
				break;
			}
            output = newOutput;
            // console.log(output)
			let nextAmp = this.jumpAmp();
			lastOutput = output.shift();
			nextAmp.inputs.push(lastOutput);
			amp = nextAmp;
        }
        // console.log("Final output of settings is: ", lastOutput)
		return lastOutput;
	}

	jumpAmp() {
		this.currentAmp++;
        this.currentAmp %= this.numOfAmps;
        // console.log("current amp is index: ", this.currentAmp)
		return this.amps[this.currentAmp];
	}
	calcFeedbackPhaseSettings(numOfAmps = this.numOfAmps) {
		let possiblePhases = Array(numOfAmps)
			.fill("")
            .map((_, i) => i + numOfAmps);

        const permutations = C.permutation(possiblePhases).toArray();

		let optimalSettings = permutations.sort(
			(a, b) => this.runFeedbackCircuit(b) - this.runFeedbackCircuit(a)
		)[0];
        console.log("Optimal Settings set at: ", optimalSettings)
		return optimalSettings;
	}

	calcOptimalPhase(numOfAmps = this.numOfAmps) {
		let possiblePhases = Array(numOfAmps)
			.fill("")
			.map((_, i) => i);
		const permutations = C.permutation(possiblePhases).toArray();
		let optimalSettings = permutations.sort(
			(a, b) => this.runCircuit(b) - this.runCircuit(a)
		)[0];

		return optimalSettings;
	}
}

const circuit = new AmpCircuit("Day7/input.txt", 5, true);
// const output = circuit.runCircuit([4,3,2,1,0]);
// console.log(output)
// let settings = circuit.calcOptimalPhase();
// console.log(settings)
// let output  = circuit.runCircuit(settings)
// console.log(output)
let feedbackSettings = circuit.calcFeedbackPhaseSettings();
// console.log(feedbackSettings);
let output = circuit.runFeedbackCircuit(feedbackSettings)
console.log(output)
