import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/jobs`, {
                params: {
                    q: query,
                    location: location,
                }
            });
            setJobs(response.data);
        } catch (error) {
            console.error('There was an error fetching the jobs!', error);
        }
    };

    useEffect(() => {
        if (query && location) {
            fetchJobs();
        }
    }, [query, location]);

    return (
        <div className="App">
            <h1>Job Listings</h1>
            <div>
                <input
                    type="text"
                    placeholder="Job Title"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button onClick={fetchJobs}>Search</button>
            </div>
            <ul>
                {jobs.map((job, index) => (
                    <li key={index}>
                        <h2>{job.title}</h2>
                        <p>{job.company}</p>
                        <p>{job.location}</p>
                        <a href={job.link} target="_blank" rel="noopener noreferrer">Apply</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
