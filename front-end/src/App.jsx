import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [postedWithin, setPostedWithin] = useState(30); // Default to 1 month (30 days)
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const dateRangeMap = {
    1: { linkedin: "r86400", naukri: "1day", indeed: 1 }, // 1 Day
    7: { linkedin: "r604800", naukri: "7days", indeed: 7 }, // 7 Days
    15: { linkedin: "r1296000", naukri: "15days", indeed: 15 }, // 15 Days (approximately 15 days)
    30: { linkedin: "r2592000", naukri: "30days", indeed: 30 }, // 1 Month
  };

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
    <div className="app-container">
      <header>
        <h1>Job Search</h1>
      </header>
      <div className="search-container">
        <input
          type="text"
          placeholder="Job title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          value={postedWithin}
          onChange={(e) => setPostedWithin(parseInt(e.target.value))}
        >
          <option value={1}>1 Day</option>
          <option value={7}>7 Days</option>
          <option value={15}>15 Days</option>
          <option value={30}>1 Month</option>
        </select>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="results-container">
        {loading ? (
          <div className="loader">Loading...</div> // Display loader while fetching
        ) : jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <p>{job.salary}</p>
              <p>{job.date}</p>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                View Job
              </a>
              <p>Source: {job.webSite}</p>
            </div>
          ))
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
};

export default App;
