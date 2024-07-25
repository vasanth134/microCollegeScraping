const puppeteer = require('puppeteer');

async function scrapeIndeedJobs(query, location, page = 1) {
    const browser = await puppeteer.launch({ headless: false });
    const indeedPage = await browser.newPage();
    await indeedPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds

    // Construct the Indeed job search URL with pagination and location
    const searchUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}&start=${(page - 1) * 10}`;
    await indeedPage.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Wait for job cards to load
    await indeedPage.waitForSelector('.job_seen_beacon', { timeout: 90000 });

    const jobs = await indeedPage.evaluate(() => {
        const jobElements = Array.from(document.querySelectorAll('.job_seen_beacon'));
        return jobElements.map(job => {
            const titleElement = job.querySelector('.jobTitle.jobTitle-c692a8a77bf7dae2');
            const companyElement = job.querySelector('.css-1qv0295.css-63koeb');
            const locationElement = job.querySelector('.css-1p0sjhy');
            const linkElement = job.querySelector('a#job_c692a8a77bf7dae2');

            const title = titleElement ? titleElement.innerText.trim() : 'No title';
            const company = companyElement ? companyElement.innerText.trim() : 'No company';
            const location = locationElement ? locationElement.innerText.trim() : 'No location';
            const link = linkElement ? `https://www.indeed.com${linkElement.getAttribute('href')}` : 'No URL';

            return { title, company, location, link };
        });
    });

    await browser.close();
    return jobs;
}

module.exports = scrapeIndeedJobs;
