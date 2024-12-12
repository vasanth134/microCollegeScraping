const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
const { executablePath} = require('puppeteer');

async function scrapeIndeedJobs(query, location, page = 1, dateRange = 30) {
  const browser = await puppeteer.launch({headless : false , executablePath : executablePath() });
  const indeedPage = await browser.newPage();
  await indeedPage.setViewport({ width: 1280, height: 800 });
  await indeedPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds







  // Construct the Indeed job search URL with pagination and location
  const searchUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}&fromage=${dateRange}&start=${(page - 1) * 10}`;
  await indeedPage.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Wait for job cards to load
  await indeedPage.waitForSelector('.job_seen_beacon', { timeout: 90000 });

  // Extract job details
  const jobs = await indeedPage.evaluate(() => {
    const jobElements = Array.from(document.querySelectorAll('.job_seen_beacon'));

    return jobElements.map(job => {
      const titleElement = job.querySelector('a.jcs-JobTitle span[id^="jobTitle"]');
      const companyElement = job.querySelector('.css-63koeb');
      const salaryElement = job.querySelector('div.metadata.salary-snippet-container > div');
      const locationElement = job.querySelector('.css-1p0sjhy');
      const linkElement = job.querySelector('a');
      const dateElement = job.querySelector('[data-testid="myJobsStateDate"]');
      
      // Clean dateElement if needed
      if (dateElement) {
        const postedSpan = dateElement.querySelector('span.css-10pe3me');
        postedSpan?.remove(); // Use optional chaining and nullish coalescing
      }

      const webSite = 'Indeed';
      const title = titleElement?.innerText.trim() || 'No title';
      const company = companyElement?.innerText.trim() || 'No company';
      const salary = salaryElement?.innerText.trim() || 'Not Mentioned';
      const location = locationElement?.innerText.trim() || 'No location';
      const link = linkElement ? `https://www.indeed.com${linkElement.getAttribute('href')}` : 'No URL';
      const date = dateElement?.innerText.trim() || 'No date';

      return link !== 'No URL' ? { webSite, title, company, salary, location, link, date } : null;
    }).filter(Boolean); // Filter out null entries
  });

  await browser.close();
  return jobs;
}

// Example usage
// scrapeIndeedJobs('full stack developer', 'india').then(jobs => console.log(jobs)).catch(console.error);

module.exports = scrapeIndeedJobs;
