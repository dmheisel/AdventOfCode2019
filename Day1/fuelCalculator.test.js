const FuelCalculator = require("./fuelCalculator");
const massList = require("./modulesMassList");

test("initialized state of fuelCalculator", () => {
  const fuelCalculator = new FuelCalculator();
  expect(fuelCalculator instanceof FuelCalculator).toBe(true);
});

test("getSingleFuelCount method math works on a single mass provided", () => {
  const fuelCalculator = new FuelCalculator();
  expect(fuelCalculator.getSingleFuelCount(12)).toEqual(2);
  expect(fuelCalculator.getSingleFuelCount(14)).toEqual(2);
  expect(fuelCalculator.getSingleFuelCount(1969)).toEqual(654);
  expect(fuelCalculator.getSingleFuelCount(100756)).toEqual(33583);
});

test("getSingleFuelCount parses strings of numbers as numbers", () => {
  const fuelCalculator = new FuelCalculator();
  expect(fuelCalculator.getSingleFuelCount("12")).toEqual(2);
});

test("getModuleFuelCount gets total fuel for an array of masses", () => {
  const fuelCalculator = new FuelCalculator();
  const testMassArray = [12, 14, 1969];
  const expectedResult = 658;
  expect(fuelCalculator.getModuleFuelCount(testMassArray)).toEqual(
    expectedResult
  );
});

test("getModuleFuelCount gets total fuel for a string of masses separated by linebreaks", () => {
  const fuelCalculator = new FuelCalculator();
  const testMassString = `12
  14
  1969`;
  const expectedResult = 658;
  expect(fuelCalculator.getModuleFuelCount(testMassString)).toEqual(
    expectedResult
  );
});

test("calcAllFuel recursively adds fuel count", () => {
  const fuelCalculator = new FuelCalculator();
  expect(fuelCalculator.calcAllFuel(14)).toEqual(2);
  expect(fuelCalculator.calcAllFuel(100756)).toEqual(50346);
});
