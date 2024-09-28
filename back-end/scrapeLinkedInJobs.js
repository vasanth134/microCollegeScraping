const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeLinkedInJobs(query, location, page = 1, dateRange = 'r2592000') {
  const browser = await puppeteer.launch({ headless: false});
  const linkedinPage = await browser.newPage();
  await linkedinPage.setViewport({ width: 1280, height: 800 });
  await linkedinPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds
  await linkedinPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  

  // Construct the LinkedIn job search URL with pagination, location, and date range
  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&f_TPR=${dateRange}&start=${(page - 1) * 50}`;
  await linkedinPage.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Wait for job cards to load
  await linkedinPage.waitForSelector('.jobs-search__results-list li', { timeout: 90000 });

  // Extract job details
  const jobs = await linkedinPage.evaluate(() => {
    return Array.from(document.querySelectorAll('.jobs-search__results-list li')).map(job => {
      const titleElement = job.querySelector('h3');
      const companyElement = job.querySelector('h4');
      const salaryElement = job.querySelector('#ember1702 > ul > li');
      const locationElement = job.querySelector('.job-search-card__location');
      const linkElement = job.querySelector('a');
      const dateElement = job.querySelector('time');

      const webSite = 'LinkedIn';
      const title = titleElement?.innerText.trim() || 'No title';
      const company = companyElement?.innerText.trim() || 'No company';
      const salary = salaryElement?.innerText.trim() || 'Not Mentioned';
      const location = locationElement?.innerText.trim() || 'No location';
      const link = linkElement ? linkElement.href : 'No URL';
      const date = dateElement?.innerText.trim() || 'No date';

      return link !== 'No URL' ? { webSite, title, company, salary, location, link, date } : null;
    }).filter(Boolean); // Filter out null entries
  });

  await browser.close();
  return jobs;
}

module.exports = scrapeLinkedInJobs;

// Example usage
// scrapeLinkedInJobs('full stack developer', 'india').then(jobs => console.log(jobs)).catch(console.error);
