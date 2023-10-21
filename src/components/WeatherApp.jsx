import { useEffect } from "react";
import dateFormat from "dateformat";
import { defaultHourlyData, weatherCode } from "../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDateDetails, setCurrentLocation, setDegreeUnit, setForecastType, setMainLoading, setTimelines } from "../Store/reducers/weatherSlice";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import WeaklyWeatherCard from "./WeaklyWeatherCard";
import { getTemperature } from "../utility";
import SearchBar from "./SearchBar";
import Loader from "./Loader";

const WeatherApp = () => {
  const { currentDateDetails, currentLocation, timelines, degreeUnit, forecastType, mainLoading } = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentLocation.lat && currentLocation.lon) {
      dispatch(setMainLoading(true));
      axios("/weather/forecast", {
        method: "GET",
        baseURL: import.meta.env.VITE_WEATHER_API_URL,
        params: {
          location: `${currentLocation.lat},${currentLocation.lon}`,
          apikey: import.meta.env.VITE_WEATHER_API_KEY,
        },
      })
        .then(({ data }) => {
          dispatch(setTimelines(data?.timelines ?? {}));
          dispatch(setCurrentDateDetails(data?.timelines?.daily[0]));
        })
        .catch((error) => console.log(error))
        .finally(() => {
          dispatch(setMainLoading(false));
        });
    }
    dispatch(setCurrentDateDetails(timelines?.daily?.length > 0 ? timelines?.daily[0] : {}));
  }, [currentLocation]);

  const fetchReverseGeocode = (latitude, longitude) => {
    axios("geocode/reverse", {
      method: "GET",
      baseURL: import.meta.env.VITE_GEOCODING_API_URL,
      params: {
        lat: latitude,
        lon: longitude,
        apiKey: import.meta.env.VITE_GEOCODING_API_KEY,
        format: "json",
      },
    })
      .then(({ data }) => {
        if (data?.results?.length > 0) {
          dispatch(
            setCurrentLocation({
              lon: data?.results[0].lon,
              lat: data?.results[0].lat,
              formatted: data?.results[0].formatted,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (response) => {
        fetchReverseGeocode(response.coords.latitude, response.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full md:w-[28%] flex flex-col py-10 px-8 md:px-14">
        <div className="flex items-center justify-between">
          <SearchBar />
          <span className="w-[35px] h-[35px] p-2 bg-primary rounded-full" title="Get your current location" onClick={fetchUserLocation}>
            <img src="assets/icons/location-icon.png" className="w-full" />
          </span>
        </div>
        {currentDateDetails?.values?.weatherCodeMax ? (
          <img
            src={`assets/icons/large/${currentDateDetails?.values?.weatherCodeMax + "0"}_large@2x.png`}
            className="w-[55%] mt-8 mb-4"
            onError={(e) => {
              e.currentTarget.src = `assets/icons/large/${currentDateDetails?.values?.weatherCodeMax}_large@2x.png`;
            }}
          />
        ) : (
          <img
            src={`assets/icons/large/11000_large@2x.png`}
            className="w-[55%] mt-8 mb-4"
            onError={(e) => {
              e.currentTarget.src = `assets/icons/large/1100_large@2x.png`;
            }}
          />
        )}
        <h1 className="text-7xl font-pop">
          {mainLoading ? (
            <Loader className="w-12 h-12" />
          ) : (
            <>
              {currentDateDetails?.values?.temperatureApparentAvg ? getTemperature(currentDateDetails?.values?.temperatureApparentAvg, degreeUnit) : "__"}
              <sup className="text-4xl">°{degreeUnit}</sup>
            </>
          )}
        </h1>
        <p className="text-xl font-medium py-5 border-b-[1px] mb-5">
          {currentDateDetails?.time ? dateFormat(currentDateDetails?.time, "dddd") : "Day"}
          {dateFormat(currentDateDetails?.time, "dd/mm/yyyy") === dateFormat(new Date(), "dd/mm/yyyy") && (
            <>
              , <span className="font-medium text-tertiary">{currentDateDetails?.time ? dateFormat(new Date(), "HH:MM") : "00:00 mn"}</span>
            </>
          )}
        </p>
        <p className="flex items-center py-3 font-medium">
          {currentDateDetails?.values?.weatherCodeMax && (
            <img
              src={`assets/icons/small/${currentDateDetails?.values?.weatherCodeMax + "0"}_small.png`}
              onError={(e) => {
                e.currentTarget.src = `assets/icons/small/${currentDateDetails?.values?.weatherCodeMax}_small.png`;
              }}
              className="me-4"
            />
          )}
          {weatherCode[currentDateDetails?.values?.weatherCodeMax]}
        </p>
        <p className="flex items-center py-3 font-medium">
          <img src="assets/icons/small/42000_small.png" className="me-4" /> Rain - {currentDateDetails?.values?.precipitationProbabilityAvg ?? "__"}%
        </p>
        <div className="flex flex-col items-center justify-center mt-auto">
          <div className="flex w-full flex-col rounded-2xl overflow-hidden shadow-sm bg-city-bg bg-slate-50 py-8 px-5 items-center text-center">{mainLoading ? <Loader className="text-white" /> : <p className="font-semibold text-white">{currentLocation.formatted}</p>}</div>
        </div>
      </div>
      <div className="flex-1 bg-primary py-10 px-8 md:px-16 md:overflow-y-auto">
        <div className="flex justify-between">
          <div className="flex">
            <h5
              className={"text-md md:text-xl font-semibold mr-5 md:mr-7 cursor-pointer " + (forecastType === "daily" ? "underline underline-offset-8" : "text-[#C8C8C8]")}
              onClick={() => {
                dispatch(setForecastType("daily"));
                dispatch(setCurrentDateDetails(timelines?.daily?.length > 0 ? timelines.daily[0] : []));
              }}
            >
              Today
            </h5>
            <h5
              className={"text-md md:text-xl font-semibold cursor-pointer " + (forecastType === "weekly" ? "underline underline-offset-8" : "text-[#C8C8C8]")}
              onClick={() => {
                dispatch(setForecastType("weekly"));
              }}
            >
              Week
            </h5>
            {/* <h4 className={"text-xl font-semibold mr-6 underline underline-offset-8"}>Upcoming Days</h4> */}
          </div>
          <div className="flex">
            <span
              className={`w-[25px] md:w-[41px] h-[25px] md:h-[41px] text-xs md:text-base flex justify-center items-center rounded-full font-bold mr-3 md:mr-4 cursor-pointer transition-all duration-500 ${degreeUnit === "C" ? "text-white bg-black" : "bg-white"}`}
              onClick={() => {
                dispatch(setDegreeUnit("C"));
              }}
            >
              °C
            </span>
            <span
              className={`w-[25px] md:w-[41px] h-[25px] md:h-[41px] text-xs md:text-base flex justify-center items-center rounded-full font-bold mr-3 md:mr-4 cursor-pointer transition-all duration-500 ${degreeUnit === "F" ? "text-white bg-black" : "bg-white"}`}
              onClick={() => {
                dispatch(setDegreeUnit("F"));
              }}
            >
              °F
            </span>
          </div>
        </div>

        {forecastType === "weekly" && timelines?.daily?.length > 0 && (
          <ul className="flex gap-3 py-12 overflow-x-auto md:overflow-x-visible -mx-12 px-12">
            {timelines?.daily?.map((item, index) => {
              return <WeaklyWeatherCard item={item} key={"daily-stats-view" + index} />;
            })}
          </ul>
        )}
        {forecastType === "daily" && (
          <div className="flex w-full h-[250px] py-12">
            <ResponsiveContainer width="100%" className="">
              <AreaChart
                data={
                  timelines?.hourly?.length > 0
                    ? timelines?.hourly?.map((d) => ({
                        Temperature: d?.values?.temperature,
                        time: d?.time ? dateFormat(d?.time, "ddd, h tt") : "",
                      }))
                    : defaultHourlyData
                }
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6E837" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F4BE45" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip />
                <XAxis dataKey="time" fontSize={8} strokeWidth={0} />
                <Area type="monotone" dataKey="Temperature" stroke="#F4BE45" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4">Day&apos;s Highlight</h2>
        <div className="flex py-3 flex-wrap">
          <div className="w-1/2 md:w-1/3 pr-2 md:pr-4 pb-3 md:pb-3">
            <div className="bg-white h-full w-full rounded-2xl flex flex-col justify-between px-5 md:px-8 py-6">
              <h3 className="font-normal text-tertiary text-[0.9rem] md:text-[1.2rem] mb-4">Feels Like</h3>
              <div className="font-semibold text-xl mt-5 mb-8">
                <div className="font-semibold text-xl mt-3 md:mt-5 mb-5 md:mb-8">
                  <span className="font-medium text-1xl md:text-4xl">
                    {mainLoading ? (
                      <Loader className="w-12 h-12" />
                    ) : (
                      <>
                        {currentDateDetails?.values?.temperatureAvg ? getTemperature(currentDateDetails?.values?.temperatureAvg, degreeUnit) : "__"}
                        <sup className="text-md md:text-2xl">°{degreeUnit}</sup>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 pl-2 md:px-2 pb-3 md:pb-3">
            <div className="bg-white h-full w-full rounded-2xl flex flex-col justify-between px-5 md:px-8 py-6">
              <h3 className="font-normal text-tertiary text-[0.9rem] md:text-[1.2rem] mb-4">Wind Status</h3>
              <div className="font-semibold text-xs md:text-xl mt-0 md:mt-5 mb-0 md:mb-8">
                {mainLoading ? (
                  <Loader className="w-12 h-12" />
                ) : (
                  <>
                    <span className="font-medium text-1xl md:text-4xl">{currentDateDetails?.values?.windSpeedAvg ?? "__"}</span> km/h
                  </>
                )}
              </div>
              <p className="flex items-center">
                <span className="border-[3px] border-primary rounded-full flex justify-center items-center w-[25px] md:w-[40px] p-1 md:p-2 mr-2">
                  <img src="/assets/icons/location-icon.svg" className="rotate-45 w-100" />
                </span>
                <span className="font-medium text-xs md:text-xl">WSW</span>
              </p>
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 pr-2 md:pl-4 py-1 md:pb-3">
            <div className="bg-white h-full w-full rounded-2xl flex flex-col justify-between px-5 md:px-8 py-6">
              <h3 className="font-normal text-tertiary text-[0.9rem] md:text-[1.2rem] mb-4">Sunrise & Sunset</h3>
              <div className="flex flex-col">
                <div className="flex py-2 md:py-3 items-center">
                  <img src="/assets/icons/sunrise-light@2x.png" className="w-5 md:w-auto drop-shadow-lg mr-4" />
                  <div className="text-sm md:text-xl font-medium">{mainLoading ? <Loader className="ms-6" /> : currentDateDetails?.values?.sunriseTime ? dateFormat(currentDateDetails?.values?.sunriseTime, "h:MM TT") : "__:__"}</div>
                </div>
                <div className="flex py-2 md:py-3 items-center">
                  <img src="/assets/icons/sunset-light@2x.png" className="w-5 md:w-auto drop-shadow-lg mr-4" />
                  <div className="text-sm md:text-xl font-medium">{mainLoading ? <Loader className="ms-6" /> : currentDateDetails?.values?.sunsetTime ? dateFormat(currentDateDetails?.values?.sunsetTime, "h:MM TT") : "__:__"}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 pl-2 md:pr-4 py-1 md:pt-3">
            <div className="bg-white h-full w-full rounded-2xl flex flex-col justify-between px-5 md:px-8 py-6">
              <h3 className="font-normal text-tertiary text-[0.9rem] md:text-[1.2rem] mb-4">Humidity</h3>
              <div className="font-semibold text-xl mt-5 mb-8">
                <div className="font-medium text-1xl md:text-4xl">
                  {mainLoading ? (
                    <Loader className="w-12 h-12" />
                  ) : (
                    <>
                      {currentDateDetails?.values?.humidityAvg ?? "__"}
                      <sup className="text-base md:text-2xl">%</sup>
                    </>
                  )}
                </div>
              </div>
              {!mainLoading && currentDateDetails?.values?.humidityAvg && (
                <p className="flex items-center">
                  <span className="font-medium text-base md:text-xl">{currentDateDetails?.values?.humidityAvg <= 30 ? "Too Dry" : currentDateDetails?.values?.humidityAvg < 50 ? "Normal" : "Too Humid"}</span>
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 pr-2 md:px-2 pt-3 md:pt-3">
            <div className="bg-white h-full w-full rounded-2xl flex flex-col justify-between px-5 md:px-8 py-6">
              <h3 className="font-normal text-tertiary text-[0.9rem] md:text-[1.2rem] mb-4">Visibility</h3>
              <div className="font-semibold text-xl mt-5 mb-8">
                <div className="font-semibold text-xs md:text-xl mt-0 md:mt-5 mb-0 md:mb-8">
                  {mainLoading ? (
                    <Loader className="w-12 h-12" />
                  ) : (
                    <>
                      <span className="font-medium text-1xl md:text-4xl">{currentDateDetails?.values?.visibilityAvg ?? "__"}</span> km
                    </>
                  )}
                </div>
              </div>
              {!mainLoading && currentDateDetails?.values?.visibilityAvg && (
                <p className="flex items-center">
                  <span className="font-medium text-base md:text-xl">{currentDateDetails?.values?.visibilityAvg < 2.8 ? "Thin Fog" : currentDateDetails?.values?.visibilityAvg < 5.9 ? "Haze" : currentDateDetails?.values?.visibilityAvg < 12 ? "Light Haze" : currentDateDetails?.values?.visibilityAvg < 18 ? "Near Clear Sky" : "Clear"}</span>
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 pl-2 md:pl-4 pt-3 md:pt-3">
            <div className="bg-white h-full w-full rounded-2xl flex flex-col px-5 md:px-8 py-6">
              <h3 className="font-normal text-tertiary text-[0.9rem] md:text-[1.2rem] mb-4">Pressure</h3>
              <div className="font-semibold text-xl mt-5 mb-8">
                <div className="font-semibold text-xs md:text-xl mt-3 md:mt-5 mb-0 md:mb-8">
                  {mainLoading ? (
                    <Loader className="w-12 h-12" />
                  ) : (
                    <>
                      <span className="font-medium text-[28px] md:text-4xl">{currentDateDetails?.values?.pressureSurfaceLevelAvg ?? "__"}</span> Hg
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
