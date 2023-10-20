import { useEffect } from "react";
import dateFormat from "dateformat";
import { weatherCode } from "../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDateDetails, setCurrentLocation, setDegreeUnit, setForecastType } from "../Store/reducers/weatherSlice";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const WeatherApp = () => {
  const { currentDateDetails, currentLocation, timelines, degreeUnit, forecastType } = useSelector((state) => state.weather);
  const dispatch = useDispatch();
  const getTemperature = (temperature) => {
    return parseFloat(temperature * (degreeUnit === "C" ? 1 : 9 / 5)).toFixed(1);
  };

  console.log(currentDateDetails);
  console.log(timelines);

  useEffect(() => {
    console.log("check1");
    if (currentLocation.lat && currentLocation.lon) {
      console.log("check2");
      // axios("/weather/forecast1", {
      //   method: "GET",
      //   baseURL: import.meta.env.VITE_WEATHER_API_URL,
      //   params: {
      //     location: `${currentLocation.lat},${currentLocation.lon}`,
      //     apikey: import.meta.env.VITE_WEATHER_API_KEY,
      //   },
      // })
      //   .then(({ data }) => {
      //     console.log(data);
      //     setTimelines(data?.timelines ?? []);
      //     setCurrentDateDetails(data?.timelines?.daily[0]);
      //   })
      //   .catch((error) => console.log(error));
      // axios("weather1", {
      //   method: "GET",
      //   baseURL: import.meta.env.VITE_WEATHER_API_URL,
      //   params: {
      //     lat: currentLocation.lat,
      //     lon: currentLocation.lon,
      //     appid: import.meta.env.VITE_WEATHER_API_KEY,
      //   },
      // })
      //   .then(({ data }) => {
      //     console.log(data);
      //     setTimelines(data?.timelines ?? []);
      //     setCurrentDateDetails(timelines?.daily[0]);
      //   })
      //   .catch((error) => console.log(error));
    }
    dispatch(setCurrentDateDetails(timelines?.daily?.length > 0 ? timelines?.daily[0] : {}));
  }, [currentLocation]);

  const fetchReverseGeocode = (latitude, longitude) => {
    console.log("check3");
    axios(import.meta.env.VITE_GEOCODING_API_URL + "/geocode/reverse", {
      method: "GET",
      params: {
        lat: latitude,
        lon: longitude,
        apiKey: import.meta.env.VITE_GEOCODING_API_KEY,
        format: "json",
      },
    })
      .then(({ data }) => {
        console.log(data);
        if (data?.results?.length > 0) {
          dispatch(
            setCurrentLocation({
              lon: data?.results[0].lon,
              lat: data?.results[0].lat,
              formatted: data?.results[0].formatted,
            })
          );
          localStorage.setItem(
            "userLocation",
            JSON.stringify({
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
    console.log("check4");
    navigator.geolocation.getCurrentPosition(
      (response) => {
        console.log(response);
        fetchReverseGeocode(response.coords.latitude, response.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <div className="flex h-screen">
      <div className="w-[28%] flex flex-col py-10 px-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-primary rounded-full px-1 py-[0.4rem]">
            <img src="assets/icons/search-icon.png" className="w-auto h-[20px] mr-2" />
            <input type="text" placeholder="Search for places ..." className="placeholder:font-normal placeholder:text-sm text-sm placeholder:text-black focus-within:outline-none focus-within:placeholder:text-[#C8C8C8] bg-transparent" />
          </div>
          <span className="w-[35px] h-[35px] p-2 bg-primary rounded-full" onClick={fetchUserLocation}>
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
          {currentDateDetails?.values?.temperatureApparentAvg ? getTemperature(currentDateDetails?.values?.temperatureApparentAvg) : "__"}
          <sup className="text-4xl">°{degreeUnit}</sup>
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
          <div className="flex w-full flex-col rounded-2xl overflow-hidden shadow-sm bg-city-bg bg-slate-50">
            <p className="py-8 text-center font-semibold text-white">{currentLocation.formatted}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-primary py-10 px-16 overflow-y-auto">
        <div className="flex justify-between">
          <div className="flex">
            <h5
              className={"text-xl font-semibold mr-7 cursor-pointer " + (forecastType === "daily" ? "underline underline-offset-8" : "text-[#C8C8C8]")}
              onClick={() => {
                dispatch(setForecastType("daily"));
                dispatch(setCurrentDateDetails(timelines?.daily?.length > 0 ? timelines.daily[0] : []));
              }}
            >
              Today
            </h5>
            <h5
              className={"text-xl font-semibold mr-6 cursor-pointer " + (forecastType === "weekly" ? "underline underline-offset-8" : "text-[#C8C8C8]")}
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
              className={`w-[41px] h-[41px] flex justify-center items-center rounded-full font-bold mr-4 cursor-pointer transition-all duration-500 ${degreeUnit === "C" ? "text-white bg-black" : "bg-white"}`}
              onClick={() => {
                dispatch(setDegreeUnit("C"));
              }}
            >
              °C
            </span>
            <span
              className={`w-[41px] h-[41px] flex justify-center items-center rounded-full font-bold mr-4 cursor-pointer transition-all duration-500 ${degreeUnit === "F" ? "text-white bg-black" : "bg-white"}`}
              onClick={() => {
                dispatch(setDegreeUnit("F"));
              }}
            >
              °F
            </span>
          </div>
        </div>

        {forecastType === "weekly" && timelines?.daily?.length > 0 && (
          <ul className="flex gap-3 my-12">
            {timelines?.daily?.map((item, index) => {
              return (
                <li
                  key={"daily-stats-view" + index}
                  onClick={() => {
                    dispatch(setCurrentDateDetails(item));
                  }}
                  className={`flex-1 transition-all duration-500 cursor-pointer bg-white flex flex-col justify-between items-center py-3 rounded-2xl px-7 ${dateFormat(currentDateDetails?.time, "dd-mm-yyyy") === dateFormat(item?.time, "dd-mm-yyyy") ? "shadow-2xl" : ""}`}
                >
                  <h3 className="text-center font-medium">{dateFormat(item?.time, "dd, ddd")}</h3>
                  {item?.values?.weatherCodeMax && (
                    <img
                      src={`assets/icons/small/${item?.values?.weatherCodeMax + "0"}_small@2x.png`}
                      onError={(e) => {
                        e.currentTarget.src = `assets/icons/small/${item?.values?.weatherCodeMax}_small@2x.png`;
                      }}
                      className="w-14 my-4 "
                      title={weatherCode[item?.values?.weatherCodeMax]}
                    />
                  )}
                  <p className="font-medium text-center">
                    {item?.values?.temperatureApparentMax ? getTemperature(item?.values?.temperatureApparentMin) + "°" : ""} <span className="font-medium text-tertiary pl-1">{item?.values?.temperatureApparentMin ? getTemperature(item?.values?.temperatureApparentMin) + "°" : ""}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        {forecastType === "daily" && timelines?.hourly?.length > 0 && (
          <div className="flex w-full h-[250px] py-12">
            <ResponsiveContainer width="100%" className="">
              <AreaChart
                data={timelines?.hourly?.map((d) => ({
                  Temperature: d?.values?.temperature,
                  time: d?.time ? dateFormat(d?.time, "ddd, h tt") : "",
                }))}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6E837" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F4BE45" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip />
                <XAxis dataKey="time" fontSize={8} strokeWidth={0}/>
                <Area type="monotone" dataKey="Temperature" stroke="#F4BE45" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4">Day&apos;s Highlight</h2>
        <div className="flex gap-6 py-3">
          <div className="bg-white w-1/3 rounded-2xl flex flex-col justify-between px-8 py-6">
            <h3 className="font-normal text-tertiary text-[1.2rem] mb-4">Feels Like</h3>
            {/* <h3 className="font-normal text-tertiary text-[1.2rem] mb-4">UV Index</h3> */}
            {/* <ResponsiveContainer width="100%">
              <RadialBarChart
                width={250}
                height={150}
                innerRadius="100%"
                outerRadius="70%"
                data={[
                  {
                    name: currentDateDetails?.values?.uvIndexAvg,
                    uv: currentDateDetails?.values?.uvIndexAvg,
                    pv: 15,
                    fill: "#FFBF5E",
                  },
                ]}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar minAngle={15} label={{ fill: "#666", position: "insideStart" }} background clockWise={true} dataKey="uv" />
                <Legend iconSize={0} width={120} height={140} layout="vertical" verticalAlign="top" align="center" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer> */}
            <div className="font-semibold text-xl mt-5 mb-8">
              <div className="font-semibold text-xl mt-5 mb-8">
                <span className="font-medium text-4xl">
                  {" "}
                  {currentDateDetails?.values?.temperatureAvg ? getTemperature(currentDateDetails?.values?.temperatureAvg) : "__"}
                  <sup className="text-2xl">°{degreeUnit}</sup>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white w-1/3 rounded-2xl flex flex-col justify-between px-8 py-6">
            <h3 className="font-normal text-tertiary text-[1.2rem] mb-4">Wind Status</h3>
            <div className="font-semibold text-xl mt-5 mb-8">
              <span className="font-medium text-4xl">{currentDateDetails?.values?.windSpeedAvg ?? "__"}</span> km/h
            </div>
            <p className="flex items-center">
              <span className="border-[3px] border-primary rounded-full flex justify-center items-center w-[40px] p-2 mr-2">
                <img src="/assets/icons/location-icon.svg" className="rotate-45 w-100" />
              </span>
              <span className="font-medium text-xl">WSW</span>
            </p>
          </div>
          <div className="bg-white w-1/3 rounded-2xl flex flex-col justify-between px-8 py-6">
            <h3 className="font-normal text-tertiary text-[1.2rem] mb-4">Sunrise & Sunset</h3>
            <div className="flex flex-col">
              <div className="flex py-3 items-center">
                <img src="/assets/icons/sunrise-light@2x.png" className="drop-shadow-lg mr-4" />
                <div className="text-xl font-medium">{currentDateDetails?.values?.sunriseTime ? dateFormat(currentDateDetails?.values?.sunriseTime, "h:MM TT") : "__:__"}</div>
              </div>
              <div className="flex py-3 items-center">
                <img src="/assets/icons/sunset-light@2x.png" className="drop-shadow-lg mr-4" />
                <div className="text-xl font-medium">{currentDateDetails?.values?.sunsetTime ? dateFormat(currentDateDetails?.values?.sunsetTime, "h:MM TT") : "__:__"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-6 py-3">
          <div className="bg-white w-1/3 rounded-2xl flex flex-col justify-between px-8 py-6">
            <h3 className="font-normal text-tertiary text-[1.2rem] mb-4">Humidity</h3>
            <div className="font-semibold text-xl mt-5 mb-8">
              <span className="font-medium text-4xl">
                {currentDateDetails?.values?.humidityAvg ?? "__"}
                <sup className="text-2xl">%</sup>
              </span>
            </div>
            <p className="flex items-center">
              <span className="font-medium text-xl">{currentDateDetails?.values?.humidityAvg <= 30 ? "Too Dry" : currentDateDetails?.values?.humidityAvg < 50 ? "Normal" : "Too Humid"}</span>
            </p>
          </div>
          <div className="bg-white w-1/3 rounded-2xl flex flex-col justify-between px-8 py-6">
            <h3 className="font-normal text-tertiary text-[1.2rem] mb-4">Visibility</h3>
            <div className="font-semibold text-xl mt-5 mb-8">
              <div className="font-semibold text-xl mt-5 mb-8">
                <span className="font-medium text-4xl">{currentDateDetails?.values?.visibilityAvg ?? "__"}</span> km
              </div>
            </div>
            <p className="flex items-center">
              <span className="font-medium text-xl">{currentDateDetails?.values?.visibilityAvg < 2.8 ? "Thin Fog" : currentDateDetails?.values?.visibilityAvg < 5.9 ? "Haze" : currentDateDetails?.values?.visibilityAvg < 12 ? "Light Haze" : currentDateDetails?.values?.visibilityAvg < 18 ? "Near Clear Sky" : "Clear"}</span>
            </p>
          </div>
          <div className="bg-white w-1/3 rounded-2xl flex flex-col  px-8 py-6">
            <h3 className="font-normal text-tertiary text-[1.2rem] mb-4">Pressure</h3>
            <div className="font-semibold text-xl mt-5 mb-8">
              <div className="font-semibold text-xl mt-5 mb-8">
                <span className="font-medium text-4xl">{currentDateDetails?.values?.pressureSurfaceLevelAvg ?? "__"}</span> Hg
              </div>
            </div>
            <p className="flex items-center">
              <span className="font-medium text-xl"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
