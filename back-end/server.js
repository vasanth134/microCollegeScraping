const express = require('express');
const cors = require('cors');
const scrapeLinkedInJobs = require('./scrapeLinkedInJobs');
const scrapeIndeedJobs = require('./scrapeIndeedJobs');
const scrapeNaukriJobs = require('./scrapeNaukriJobs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

app.get('/test-linkedin', async (req, res) => {
    const query = req.query.q;
    const location = req.query.location;
    const page = parseInt(req.query.page) || 1;
    const dateRange = req.query.dateRange || 'r2592000'; // Default to one month

    if (!query || !location) {
        return res.status(400).json({ error: 'Query and location parameters are required' });
    }

    try {
        const jobs = await scrapeLinkedInJobs(query, location, page, dateRange);
        res.json(jobs);
    } catch (error) {
        console.error('Error in LinkedIn scraper:', error);
        res.status(500).json({ error: 'Failed to scrape LinkedIn' });
    }
});


app.get('/test-indeed', async (req, res) => {
    const query = req.query.q;
    const location = req.query.location;
    const page = parseInt(req.query.page) || 1;

    if (!query || !location) {
        return res.status(400).json({ error: 'Query and location parameters are required' });
    }

    try {
        const jobs = await scrapeIndeedJobs(query, location, page);
        res.json(jobs);
    } catch (error) {
        console.error('Error in Indeed scraper:', error);
        res.status(500).json({ error: 'Failed to scrape Indeed' });
    }
});

app.get('/test-naukri', async (req, res) => {
    const query = req.query.q;
    const location = req.query.location;
    const page = parseInt(req.query.page) || 1;

    if (!query || !location) {
        return res.status(400).json({ error: 'Query and location parameters are required' });
    }

    try {
        const jobs = await scrapeNaukriJobs(query, location, page);
        res.json(jobs);
    } catch (error) {
        console.error('Error in Naukri scraper:', error);
        res.status(500).json({ error: 'Failed to scrape Naukri' });
    }
});

app.get('/jobs', async (req, res) => {  
    const { q, location, linkedinDateRange, naukriDateRange, indeedDateRange } = req.query;  
    const linkedinJobs = await scrapeLinkedInJobs(q, location, 1, linkedinDateRange);  
    const naukriJobs = await scrapeNaukriJobs(q, location, 1, naukriDateRange);  
    const indeedJobs = await scrapeIndeedJobs(q, location, 1, indeedDateRange);  
    const jobs = [...linkedinJobs,...naukriJobs,...indeedJobs];  
    res.json(jobs);  
  });
  


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});







// const jobElements = Array.from(document.querySelectorAll('.cust-job-tuple'));
// if (jobElements.length === 0) {
//     console.error('No job elements found.');
// }
// const today = new Date();
// return jobElements.map(job => {
//     const titleElement = job.querySelector('a.title');
//     const companyElement = job.querySelector('a.comp-name');
//     const locationElement = job.querySelector('.locWdth');
//     const linkElement = job.querySelector('a.title');
//     const dateElement = job.querySelector('.job-post-day'); 
