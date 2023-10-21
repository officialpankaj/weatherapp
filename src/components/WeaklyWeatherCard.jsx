import { useDispatch, useSelector } from "react-redux";
import { setCurrentDateDetails } from "../Store/reducers/weatherSlice";
import dateFormat from "dateformat";
import { weatherCode } from "../constants";
import { getTemperature } from "../utility";

const WeaklyWeatherCard = ({ item }) => {
  const dispatch = useDispatch();
  const { currentDateDetails, degreeUnit } = useSelector((state) => state.weather);
  return (
    <li
      onClick={() => {
        dispatch(setCurrentDateDetails(item));
      }}
      className={`flex-1 transition-all duration-500 cursor-pointer text-xs md:text-base bg-white flex flex-col justify-between items-center py-3 rounded-2xl px-7 ${dateFormat(currentDateDetails?.time, "dd-mm-yyyy") === dateFormat(item?.time, "dd-mm-yyyy") ? "shadow-2xl" : ""}`}
    >
      <h3 className="text-center font-medium w-max">{dateFormat(item?.time, "dd, ddd")}</h3>
      {item?.values?.weatherCodeMax && (
        <img
          src={`assets/icons/small/${item?.values?.weatherCodeMax + "0"}_small@2x.png`}
          onError={(e) => {
            e.currentTarget.src = `assets/icons/small/${item?.values?.weatherCodeMax}_small@2x.png`;
          }}
          className="w-10 md:w-14 my-4 "
          title={weatherCode[item?.values?.weatherCodeMax]}
        />
      )}
      <p className="font-medium text-center w-max">
        {item?.values?.temperatureApparentMax ? getTemperature(item?.values?.temperatureApparentMin, degreeUnit) + "°" : ""} <span className="font-medium text-tertiary pl-1">{item?.values?.temperatureApparentMin ? getTemperature(item?.values?.temperatureApparentMin, degreeUnit) + "°" : ""}</span>
      </p>
    </li>
  );
};

export default WeaklyWeatherCard;
