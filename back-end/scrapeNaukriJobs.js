const { executablePath } = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
require("dotenv").config();

puppeteer.use(StealthPlugin());

async function scrapeNaukriJobs(
  query,
  location,
  page = 1,
  dateRange = "30days"
) {
  const browser = await puppeteer.launch({
    args: ["--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const naukriPage = await browser.newPage();
  await naukriPage.setViewport({ width: 1280, height: 800 });
  await naukriPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds

  // Construct the Naukri job search URL with pagination and location
  const searchUrl = `https://www.naukri.com/${encodeURIComponent(
    query
  )}-jobs-in-${encodeURIComponent(location)}-${page}?date=${dateRange}`;
  await naukriPage.goto(searchUrl, { waitUntil: "networkidle2" });

  // Wait for job cards to load
  await naukriPage.waitForSelector(".cust-job-tuple", { timeout: 90000 });

  // Extract job details
  const jobs = await naukriPage.evaluate(() => {
    const jobElements = Array.from(
      document.querySelectorAll(".cust-job-tuple")
    );

    return jobElements
      .map((job) => {
        const titleElement = job.querySelector("a.title");
        const companyElement = job.querySelector("a.comp-name");
        const salaryElement = job.querySelector(
          ".sal-wrap > .ni-job-tuple-icon > span"
        );
        const locationElement = job.querySelector(".locWdth");
        const linkElement = job.querySelector("a.title");
        const dateElement = job.querySelector(".job-post-day");

        const webSite = "Naukri";
        const title = titleElement?.innerText.trim() || "No title";
        const company = companyElement?.innerText.trim() || "No company";
        const salary = salaryElement?.innerText.trim() || "Not Mentioned";
        const location = locationElement?.innerText.trim() || "No location";
        const link = linkElement?.href || "No URL";
        const dateText = dateElement?.innerText.trim() || "No date";

        return link !== "No URL"
          ? { webSite, title, company, salary, location, link, date: dateText }
          : null;
      })
      .filter(Boolean); // Filter out null entries
  });

  await browser.close();
  return jobs;
}

// Example usage
// scrapeNaukriJobs('full stack developer', 'india').then(jobs => console.log(jobs)).catch(console.error);

module.exports = scrapeNaukriJobs;
