const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

// Use stealth and recaptcha plugins
puppeteer.use(StealthPlugin());
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "YOUR_2CAPTCHA_API_KEY", // Replace with your actual API key
    },
    visualFeedback: true, // Optional, shows visual feedback when solving
  })
);

const { executablePath } = require("puppeteer");

async function scrapeIndeedJobs(query, location, page = 1, dateRange = 30) {
  const browser = await puppeteer.launch({
    headless: false, // Run in non-headless mode for debugging
    executablePath: executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const indeedPage = await browser.newPage();
    await indeedPage.setViewport({ width: 1280, height: 800 });
    await indeedPage.setDefaultTimeout(90000); // Increase timeout to 90 seconds

    // Set user agent and headers
    await indeedPage.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );
    await indeedPage.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    // Construct the Indeed job search URL
    const searchUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(
      query
    )}&l=${encodeURIComponent(location)}&fromage=${dateRange}&start=${
      (page - 1) * 10
    }`;
    await indeedPage.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // Wait for potential Cloudflare challenges
    await indeedPage.waitForTimeout(5000);

    // Detect and solve CAPTCHA if present
    const recaptchaDetected = await indeedPage.$(".g-recaptcha");
    if (recaptchaDetected) {
      console.log("CAPTCHA detected. Solving...");
      const result = await indeedPage.solveRecaptchas();
      if (result.solved.length > 0) {
        console.log("CAPTCHA solved!");
        await indeedPage.click("#verify"); // Adjust selector for your use case
        await indeedPage.waitForNavigation({ waitUntil: "networkidle2" });
      } else {
        console.error("Failed to solve CAPTCHA.");
        return [];
      }
    }

    // Wait for job cards to load
    await indeedPage.waitForSelector(".job_seen_beacon", { timeout: 90000 });

    // Extract job details
    const jobs = await indeedPage.evaluate(() => {
      const jobElements = Array.from(
        document.querySelectorAll(".job_seen_beacon")
      );

      return jobElements
        .map((job) => {
          const titleElement = job.querySelector(
            'a.jcs-JobTitle span[id^="jobTitle"]'
          );
          const companyElement = job.querySelector(".css-63koeb");
          const salaryElement = job.querySelector(
            "div.metadata.salary-snippet-container > div"
          );
          const locationElement = job.querySelector(".css-1p0sjhy");
          const linkElement = job.querySelector("a");
          const dateElement = job.querySelector(
            '[data-testid="myJobsStateDate"]'
          );

          if (dateElement) {
            const postedSpan = dateElement.querySelector("span.css-10pe3me");
            postedSpan?.remove();
          }

          const webSite = "Indeed";
          const title = titleElement?.innerText.trim() || "No title";
          const company = companyElement?.innerText.trim() || "No company";
          const salary = salaryElement?.innerText.trim() || "Not Mentioned";
          const location = locationElement?.innerText.trim() || "No location";
          const link = linkElement
            ? `https://www.indeed.com${linkElement.getAttribute("href")}`
            : "No URL";
          const date = dateElement?.innerText.trim() || "No date";

          return link !== "No URL"
            ? { webSite, title, company, salary, location, link, date }
            : null;
        })
        .filter(Boolean); // Filter out null entries
    });

    console.log("Jobs extracted:", jobs);
    return jobs;
  } catch (error) {
    console.error("Error during scraping:", error);
    return [];
  } finally {
    await browser.close();
  }
}

// Example usage
scrapeIndeedJobs("full stack developer", "india")
  .then((jobs) => console.log(jobs))
  .catch((error) => console.error(error));

module.exports = scrapeIndeedJobs;
