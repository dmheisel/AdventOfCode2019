const fs = require("fs");

class AsteroidMap {
	constructor(file) {
		this._file = file;
		this.raw = this.file && this.processFile();
		this.points = this.raw && this.processCoordsMap();
	}
	processFile(file = this.file) {
		let data = fs.readFileSync(file, "utf8");
		let rawMap = data.split("\n").map(line => (line = line.split("")));
		return rawMap;
	}
	processCoordsMap(rawMap = this.raw) {
		let processedMap = rawMap
			.map((line, yIndex) =>
				line.map((position, xIndex) => {
					let asteroid = { x: xIndex, y: yIndex, asteroid: position === "#" };
					return asteroid;
				})
			)
			.flat();
		return processedMap;
	}
	findIdealLocation() {
		let stationList = this.points.map(position => {
			if (position.asteroid) {
				return new Station(this, position);
			}
		});
		let bestStation = stationList.sort(
			(a, b) => b.scanAsteroids().length - a.scanAsteroids().length
		)[0];
		return bestStation.coordinates;
	}

	get file() {
		return this._file;
	}
	set file(newFile) {
		this._file = newFile;
		this.map = this.processFile();
	}
}

class Station {
	constructor(map, coordinates) {
		if (!map instanceof AsteroidMap) {
			throw new Error(
				"Map provided to Station must be AsteroidMap object type"
			);
		}
		if (!coordinates.asteroid) {
			throw new Error("Station must be placed on an asteroid");
		}
		this._map = map;
		this._coordinates = coordinates;
        this.relativeMap = this.map && this.coordinates && this.relativizeMap();
	}

	relativizeMap() {
		let points = this.map.points;
		let coordinates = this.coordinates;
		let relativeMap = points
			.map(point => {
				return {
					x: point.x - coordinates.x,
					y: point.y - coordinates.y,
					asteroid: point.asteroid
				};
			})
			.filter(point => !(point.x === 0 && point.y === 0)); // remove own location

		return relativeMap;
	}

	scanAsteroids() {
		let scanned = [];
		for (let position of this.relativeMap) {
			if (position.asteroid) {
                
				let relativeAngle = 
					((Math.atan2(position.y, position.x) * 180) /
                        Math.PI)
                relativeAngle = (relativeAngle + 450) % 360; // get degrees in 360, add 90 so north/up is 0
				let relativeDistance = Math.abs(position.y) + Math.abs(position.x);

                if (
                    scanned.find(asteroid => (asteroid.relativeAngle === relativeAngle))
                ) {
					let asteroid = scanned.find(
						asteroid => (asteroid.relativeAngle === relativeAngle)
                    );
					if (relativeDistance < asteroid.relativeDistance) {
						scanned = scanned.filter(el => el.relativeAngle !== asteroid.relativeAngle)
						scanned.push({
								relativeAngle: relativeAngle,
								relativeDistance: relativeDistance,
								...position
							});
					}
				} else {
					scanned.push({
						relativeAngle: relativeAngle,
						relativeDistance: relativeDistance,
						...position
					});
				}
			}
		}
		return scanned.sort((a,b) => a.relativeAngle - b.relativeAngle);
	}

	get map() {
		return this._map;
	}
	get coordinates() {
		return this._coordinates;
	}
	set map(newMap) {
		this._map = newMap;
	}
	set coordinates(newCoordinates) {
		this._coordinates = newCoordinates;
	}
}

const asteroidMap = new AsteroidMap("Day10/input.txt");
let bestLocation = asteroidMap.findIdealLocation();
console.log(bestLocation)
const station = new Station(asteroidMap, bestLocation);
// console.log(bestLocation);

// console.log(station.relativeMap)
// console.log(station.scanAsteroids().length);
