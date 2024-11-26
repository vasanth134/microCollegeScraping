import { useState, useEffect, useRef } from "react";
import SearchIcon from "../assets/images/Search-i.png";

export default function Search() {
  const [inputWidth, setInputWidth] = useState("auto");
  const [locationInputWidth, setLocationInputWidth] = useState("auto");
  const searchPlaceholder = "Search by skills / designations / companies";
  const locationPlaceholder = "Location";
  const searchInputRef = useRef(null);
  const locationInputRef = useRef(null);

  useEffect(() => {
    const calculatePlaceholderWidth = (text, ref) => {
      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.fontSize = window.getComputedStyle(ref.current).fontSize;
      span.style.fontFamily = window.getComputedStyle(ref.current).fontFamily;
      span.textContent = text;
      document.body.appendChild(span);

      const width = span.offsetWidth;
      document.body.removeChild(span);
      return width;
    };

    const searchWidth = calculatePlaceholderWidth(
      searchPlaceholder,
      searchInputRef
    );
    const locationWidth = calculatePlaceholderWidth(
      locationPlaceholder,
      locationInputRef
    );

    setInputWidth(searchWidth);
    setLocationInputWidth(locationWidth);
  }, [searchPlaceholder, locationPlaceholder]);

  return (
    <div className="inline-flex justify-center items-center text-2xl bg-white p-4 rounded-full">
      <img src={SearchIcon} alt="search_icon" />
      <input
        className="ml-2 bg-transparent placeholder-gray-500 focus:outline-none"
        type="text"
        ref={searchInputRef}
        placeholder={searchPlaceholder}
        style={{ width: inputWidth }}
      />
      <span className="ml-2 text-[#979EC6]">|</span>
      <input
        className="ml-2 bg-transparent placeholder-gray-500 focus:outline-none"
        type="text"
        ref={locationInputRef}
        placeholder={locationPlaceholder}
        style={{ width: locationInputWidth }}
      />
      <button className="bg-[#2A176F] text-white rounded-full px-4 py-3 ml-4" type="button">Search</button>
    </div>
  );
}
