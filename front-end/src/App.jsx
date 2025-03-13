import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import HeaderLogin from "./components/HeaderLogin";
import Hero from "./pages/Hero";
import SearchIcon from "./assets/images/Search-i.png";

const App = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [postedWithin, setPostedWithin] = useState(30); // Default to 1 month (30 days)
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  
  // References for input width calculation
  const [inputWidth, setInputWidth] = useState("auto");
  const [locationInputWidth, setLocationInputWidth] = useState("auto");
  const searchPlaceholder = "Search by skills / designations / companies";
  const locationPlaceholder = "Location";
  const searchInputRef = useRef(null);
  const locationInputRef = useRef(null);
  
  // Date range mappings for different job sites
  const dateRangeMap = {
    1: { linkedin: "r86400", naukri: "1day", indeed: 1 }, // 1 Day
    7: { linkedin: "r604800", naukri: "7days", indeed: 7 }, // 7 Days
    15: { linkedin: "r1296000", naukri: "15days", indeed: 15 }, // 15 Days
    30: { linkedin: "r2592000", naukri: "30days", indeed: 30 }, // 1 Month
  };
  
  // Calculate widths for placeholder text
  useEffect(() => {
    const calculatePlaceholderWidth = (text, ref) => {
      if (!ref.current) return "auto";
      
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
  
  // Handle job search
  const handleSearch = async () => {
    if (!query || !location) {
      alert('Please enter both job title and location');
      return;
    }
    
    const dateRange = dateRangeMap[postedWithin];
    setLoading(true); // Set loading to true before starting fetch
    
    try {
      const response = await axios.get("http://localhost:3001/jobs", {
        params: {
          q: query,
          location: location,
          linkedinDateRange: dateRange.linkedin,
          naukriDateRange: dateRange.naukri,
          indeedDateRange: dateRange.indeed,
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching job data:", error);
      alert("Error fetching job data. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };
  
  return (
    <>
      <HeaderLogin />
      <Hero />
      <div className="app-container">
        {/* <h1>Job Search</h1> */}
        
        {/* Styled Search Bar from Search.jsx */}
        <div className="inline-flex justify-center items-center text-2xl bg-white p-4 rounded-full">
          <img src={SearchIcon} alt="search_icon" />
          <input
            className="ml-2 bg-transparent placeholder-gray-500 focus:outline-none"
            type="text"
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            style={{ width: inputWidth }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="ml-2 text-[#979EC6]">|</span>
          <input
            className="ml-2 bg-transparent placeholder-gray-500 focus:outline-none"
            type="text"
            ref={locationInputRef}
            placeholder={locationPlaceholder}
            style={{ width: locationInputWidth }}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          
          {/* Added date filter dropdown */}
          <select
            className="ml-4 bg-transparent border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
            value={postedWithin}
            onChange={(e) => setPostedWithin(parseInt(e.target.value))}
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={15}>15 Days</option>
            <option value={30}>1 Month</option>
          </select>
          
          <button 
            className="bg-[#2A176F] text-white rounded-full px-4 py-3 ml-4" 
            type="button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Results Container */}
      </div>
        <div className="results-container mt-8">
          {loading ? (
            <div className="loader">Loading...</div> // Display loader while fetching
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div key={index} className="job-card bg-white rounded-lg p-4 shadow-md mb-4">
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-gray-700">{job.company}</p>
                <p className="text-gray-600">{job.location}</p>
                <p className="text-gray-600">{job.salary}</p>
                <p className="text-gray-500">{job.date}</p>
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#2A176F] font-medium hover:underline"
                >
                  View Job
                </a>
                <p className="text-gray-500 text-sm mt-2">Source: {job.webSite}</p>
              </div>
            ))
          ) : (
            <p>No jobs found</p>
          )}
        </div>
    </>
  );
};

export default App;