const FuelCalculator = require("./fuelCalculator");
const massList = require("./modulesMassList");

class FuelReport {
  constructor(massList) {
    this.massList = massList;
    this.fuelCalculator = new FuelCalculator();
  }
  printFullReport() {
    console.log(this.fuelCalculator.getTotalFuelCount(this.massList));
  }
}

const rocketFuelReport = new FuelReport(massList);

rocketFuelReport.printFullReport();
