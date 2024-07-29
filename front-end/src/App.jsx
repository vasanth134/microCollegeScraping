import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [postedWithin, setPostedWithin] = useState(30); // Default to 1 month (30 days)
  const [jobs, setJobs] = useState([]);

  const handleSearch = async () => {
    if (!query || !location) {
      alert('Please enter both job title and location');
      return;
    }

    // Map the postedWithin value to the corresponding LinkedIn date range
    const dateRangeMap = {
      1: 'r864008',     // 1 Day
      7: 'r6044800',    // 7 Days
      15: 'r1296000',   // 15 Days (approximately 15 days)
      30: 'r2592000'    // 1 Month
    };

    const dateRange = dateRangeMap[postedWithin] || 'r2592000';

    try {
      const response = await axios.get('http://localhost:3001/jobs', {
        params: { q: query, location: location, dateRange }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching job data:', error);
      alert('Error fetching job data. Please try again later.');
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
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="results-container">
        {jobs.length > 0 ? (
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
