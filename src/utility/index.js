

export const getTemperature = (temperature, degreeUnit) => {
  return parseFloat(temperature * (degreeUnit === "C" ? 1 : 9 / 5)).toFixed(1);
};
