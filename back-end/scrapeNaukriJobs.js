const puppeteer = require('puppeteer');

async function scrapeNaukriJobs(query, location, page = 1) {
    const browser = await puppeteer.launch({ headless: true });
    const naukriPage = await browser.newPage();
    await naukriPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds

    // Construct the Naukri job search URL with pagination and location
    const searchUrl = `https://www.naukri.com/${encodeURIComponent(query)}-jobs-in-${encodeURIComponent(location)}-${page}`;
    await naukriPage.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Wait for job cards to load
    await naukriPage.waitForSelector('.jobTuple', { timeout: 90000 });

    const jobs = await naukriPage.evaluate(() => {
        const jobElements = Array.from(document.querySelectorAll('.jobTuple'));
        return jobElements.map(job => {
            const titleElement = job.querySelector('.title');
            const companyElement = job.querySelector('.subTitle');
            const locationElement = job.querySelector('.location');
            const linkElement = job.querySelector('a');

            const title = titleElement ? titleElement.innerText.trim() : 'No title';
            const company = companyElement ? companyElement.innerText.trim() : 'No company';
            const location = locationElement ? locationElement.innerText.trim() : 'No location';
            const link = linkElement ? linkElement.href : 'No URL';

            return { title, company, location, link };
        });
    });

    await browser.close();
    return jobs;
}

module.exports = scrapeNaukriJobs;
