import { createSlice } from "@reduxjs/toolkit";

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    mainLoading: true,
    degreeUnit: "C",
    forecastType: "daily",
    currentDateDetails: {},
    currentLocation: localStorage.getItem("userLocation") ? JSON.parse(localStorage.getItem("userLocation")) : { lat: 22.732498, long: 75.868962, formatted: "Indore, MP, 452016" },
    timelines: {},
  },
  reducers: {
    setDegreeUnit: (state, action) => {
      state.degreeUnit = action.payload;
    },
    setForecastType: (state, action) => {
      state.forecastType = action.payload;
    },
    setCurrentDateDetails: (state, action) => {
      state.currentDateDetails = action.payload;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      localStorage.setItem(
        "userLocation",
        JSON.stringify({
          lon: action.payload.lon,
          lat: action.payload.lat,
          formatted: action.payload.formatted,
        })
      );
    },
    setTimelines: (state, action) => {
      state.timelines = action.payload;
    },
    setMainLoading: (state, action) => {
      state.mainLoading = action.payload;
    },
  },
});

export const { setDegreeUnit, setCurrentDateDetails, setCurrentLocation, setTimelines, setForecastType, setMainLoading } = weatherSlice.actions;

export default weatherSlice.reducer;
