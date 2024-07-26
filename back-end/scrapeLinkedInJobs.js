const puppeteer = require("puppeteer");

async function scrapeLinkedInJobs(query, location, page = 1) {
  const browser = await puppeteer.launch({ headless: true });
  const linkedinPage = await browser.newPage();
  await linkedinPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds

  // Construct the LinkedIn job search URL with pagination and location
  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    query
  )}&location=${encodeURIComponent(location)}&start=${(page - 1) * 50}`;
  await linkedinPage.goto(searchUrl, { waitUntil: "networkidle2" });

  // Wait for job cards to load
  await linkedinPage.waitForSelector(".jobs-search__results-list li", {
    timeout: 90000,
  });

  const jobs = await linkedinPage.evaluate(() => {
    const jobElements = Array.from(
      document.querySelectorAll(".jobs-search__results-list li")
    );
    return jobElements.map((job) => {
      const titleElement = job.querySelector("h3");
      const companyElement = job.querySelector("h4");
      const locationElement = job.querySelector(".job-search-card__location");
      const linkElement = job.querySelector("a");
      const dateElement = job.querySelector("time");

      const title = titleElement ? titleElement.innerText.trim() : "No title";
      const company = companyElement
        ? companyElement.innerText.trim()
        : "No company";
      const location = locationElement
        ? locationElement.innerText.trim()
        : "No location";
      const link = linkElement ? linkElement.href : "No URL";
 const date = dateElement ? dateElement.innerText.trim() : "No date";


      return { title, company, location, link, date };
    });
  });

  await browser.close();
  return jobs;
}

module.exports = scrapeLinkedInJobs;
