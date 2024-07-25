const puppeteer = require('puppeteer');

async function scrapeNaukriJobs(query, location, maxPages = 5) {
    const browser = await puppeteer.launch({ headless: false }); // Run in non-headless mode for debugging
    const naukriPage = await browser.newPage();
    await naukriPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds

    const allJobs = [];

    for (let page = 1; page <= maxPages; page++) {
        let retries = 3; // Set the number of retries
        let success = false;

        while (retries > 0 && !success) {
            try {
                // Construct the Naukri job search URL with pagination and location
                const searchUrl = `https://www.naukri.com/${encodeURIComponent(query)}-jobs-in-${encodeURIComponent(location)}?page=${page}`;
                console.log(`Navigating to URL: ${searchUrl}`);
                await naukriPage.goto(searchUrl, { waitUntil: 'networkidle2' });

                // Wait for job cards to load
                await naukriPage.waitForSelector('.cust-job-tuple', { timeout: 90000 }); // Adjust the selector based on the actual DOM structure
                console.log('Job cards loaded');

                const jobs = await naukriPage.evaluate(() => {
                    const jobElements = Array.from(document.querySelectorAll('.cust-job-tuple'));
                    if (jobElements.length === 0) {
                        console.error('No job elements found.');
                        return [];
                    }

                    return jobElements.map(job => {
                        const titleElement = job.querySelector('a.title');
                        const companyElement = job.querySelector('a.comp-name');
                        const locationElement = job.querySelector('.locWdth');
                        const linkElement = job.querySelector('a.title');
                        const dateElement = job.querySelector('.job-post-day'); 

                        const title = titleElement ? titleElement.innerText.trim() : 'No title';
                        const company = companyElement ? companyElement.innerText.trim() : 'No company';
                        const location = locationElement ? locationElement.innerText.trim() : 'No location';
                        const link = linkElement ? linkElement.href : 'No URL';
                        const dateText = dateElement ? dateElement.innerText.trim() : 'No date';

                        return {
                            title,
                            company,
                            location,
                            link,
                            date: dateText
                        };
                    });
                });

                allJobs.push(...jobs);

                if (jobs.length === 0) {
                    console.error(`No jobs found on page ${page}.`);
                } else {
                    console.log(`Jobs found on page ${page}:`, jobs.length);
                }

                success = true; // If this point is reached, it means the data was successfully retrieved
            } catch (error) {
                console.error(`Error occurred on page ${page}, retrying... (${retries} retries left)`, error);
                retries--;
            }
        }
        
        if (!success) {
            console.error(`Failed to retrieve data for page ${page} after multiple retries.`);
        }
    }

    await browser.close();
    return allJobs;
}

// Example usage
scrapeNaukriJobs('full stack developer', 'india').then(jobs => console.log(jobs)).catch(console.error);

module.exports = scrapeNaukriJobs;
