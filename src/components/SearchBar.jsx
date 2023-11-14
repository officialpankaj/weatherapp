import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentLocation } from "../Store/reducers/weatherSlice";
import Loader from "./Loader";

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placesList, setPlacesList] = useState(null);

  const dispatch = useDispatch();

  const searchPlace = () => {
    if (isSearchFocused && searchText) {
      setIsLoading(true);
      axios("geocode/autocomplete", {
        method: "GET",
        baseURL: import.meta.env.VITE_GEOCODING_API_URL,
        params: {
          text: searchText,
          format: "json",
          apiKey: import.meta.env.VITE_GEOCODING_API_KEY,
        },
      })
        .then(({ data }) => {
          console.log(data);
          setPlacesList(data?.results);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(searchPlace, 1000);

    return () => clearInterval(delayDebounceFn);
  }, [searchText]);

  return (
    <div className="flex items-center bg-primary rounded-full px-1 py-[0.4rem] relative">
      <img src="assets/icons/search-icon.png" className="w-auto h-[20px] mr-2" />
      <input
        type="text"
        placeholder="Search for places ..."
        className="placeholder:font-normal placeholder:text-sm text-sm placeholder:text-black focus-within:outline-none focus-within:placeholder:text-[#C8C8C8] bg-transparent"
        onFocus={() => {
          setIsSearchFocused(true);
        }}
        onBlur={() => {
          setIsSearchFocused(false);
          setTimeout(() => {
            setPlacesList(null);
          }, 500);
        }}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.currentTarget.value);
        }}
      />

      {!isLoading && (
        <ul className="absolute bottom-0 left-[11%] translate-y-[100%] overflow-visible border border-primary drop-shadow-md bg-primary">
          {placesList?.map((item, index) => (
            <li
              key={"search-result-item" + index}
              className="text-base font-medium px-3 py-2 w-max cursor-pointer"
              onClick={() => {
                console.log();
                dispatch(setCurrentLocation({ lat: item?.lat, lon: item?.lon, formatted: item?.formatted }));
                setSearchText(item?.formatted);
              }}
            >
              {item?.formatted.substring(0, item?.formatted?.indexOf(","))} <span className="text-xs">{item?.formatted.substring(item?.formatted?.indexOf(",") + 1)}</span>
            </li>
          ))}
        </ul>
      )}

      {isSearchFocused && !isLoading && (
        <img
          src="assets/icons/cross-icon.png"
          className="w-auto h-[15px] mr-2 cursor-pointer"
          onClick={() => {
            setSearchText("");
          }}
        />
      )}
      {isLoading && <Loader className={"text-black"} />}
    </div>
  );
};

export default SearchBar;
