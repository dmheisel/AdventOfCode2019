module.exports = class FuelCalculator {
  constructor() {}

  calcFuel(mass) {
    return Math.floor(mass / 3) - 2;
  }

  calcAllFuel(mass) {
    let fuel = this.calcFuel(mass);
    if (fuel <= 0) {
      return 0;
    }
    return fuel + this.calcAllFuel(fuel);
  }
  parseList(massList) {
    if (typeof massList === "string") {
      massList = massList.split(/\r|\n/);
    }
    return massList;
  }

  getSingleFuelCount(mass) {
    return this.calcFuel(mass);
  }

  getModuleFuelCount(massList) {
    massList = this.parseList(massList);
    return massList.reduce(
      (acc, currVal) => (acc += this.getSingleFuelCount(currVal)),
      0
    );
  }

  getTotalFuelCount(massList) {
    massList = this.parseList(massList);
    return massList.reduce(
      (acc, currVal) => (acc += this.calcAllFuel(currVal)),
      0
    );
  }
};
