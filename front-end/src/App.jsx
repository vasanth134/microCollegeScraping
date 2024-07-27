import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:3001/jobs', {
                params: { q: query, location: location }
            });
            setJobs(response.data);
            setError(null);
        } catch (err) {
            console.error('There was an error fetching the jobs!', err);
            setError('There was an error fetching the jobs!');
        }
    };

    return (
        <div>
            <h1>Job Search</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title"
            />
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
            />
            <button onClick={fetchJobs}>Search</button>
            {error && <p>{error}</p>}
            <ul>
                {jobs.map((job, index) => (
                    <li key={index}>
                        <a href={job.link} target="_blank" rel="noopener noreferrer">
                            <h2>{job.webSite}</h2>
                            <h3>{job.title}</h3>
                            <p>{job.company}</p>
                            <p>{job.salary}</p>
                            <p>{job.location}</p>
                            <p>{job.date}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
