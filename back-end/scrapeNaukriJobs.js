const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeNaukriJobs(query, location, page = 1) {
  const browser = await puppeteer.launch({ headless: true }); // Run in headless mode
  const naukriPage = await browser.newPage();
  await naukriPage.setViewport({ width: 1280, height: 800 });
  await naukriPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds

  // Construct the Naukri job search URL with pagination and location
  const searchUrl = `https://www.naukri.com/${encodeURIComponent(query)}-jobs-in-${encodeURIComponent(location)}-${page}`;
  await naukriPage.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Wait for job cards to load
  await naukriPage.waitForSelector('.cust-job-tuple', { timeout: 90000 }); // Adjust the selector based on the actual DOM structure

  const jobs = await naukriPage.evaluate(() => {
    const jobElements = Array.from(document.querySelectorAll('.cust-job-tuple'));

    return jobElements.map((job) => {
      const titleElement = job.querySelector('a.title');
      const companyElement = job.querySelector('a.comp-name');
      const salaryElement = job.querySelector('.sal-wrap > .ni-job-tuple-icon > span');
      const locationElement = job.querySelector('.locWdth');
      const linkElement = job.querySelector('a.title');
      const dateElement = job.querySelector('.job-post-day');

      const webSite = 'Naukri';
      const title = titleElement ? titleElement.innerText.trim() : 'No title';
      const company = companyElement ? companyElement.innerText.trim() : 'No company';
      const salary = salaryElement ? salaryElement.innerText.trim() : 'Not Mentioned';
      const location = locationElement ? locationElement.innerText.trim() : 'No location';
      const link = linkElement ? linkElement.href : 'No URL';
      const dateText = dateElement ? dateElement.innerText.trim() : 'No date';

      if (link !== '') {
        return { webSite, title, company, salary, location, link, date: dateText };
      }
    }).filter(Boolean); // Filter out undefined entries
  });

  await browser.close();
  return jobs;
}

// Example usage
// scrapeNaukriJobs('full stack developer', 'india').then(jobs => console.log(jobs)).catch(console.error);

module.exports = scrapeNaukriJobs;
