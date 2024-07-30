const express = require("express");
const cors = require("cors");
const scrapeLinkedInJobs = require("./scrapeLinkedInJobs");
const scrapeIndeedJobs = require("./scrapeIndeedJobs");
const scrapeNaukriJobs = require("./scrapeNaukriJobs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const validateQueryParams = (query) => {
  if (!query.q || !query.location) {
    throw new Error("Query and location parameters are required");
  }
};

app.get("/test-linkedin", async (req, res) => {
  try {
    validateQueryParams(req.query);
    const { q, location, page = 1, dateRange = "r2592000" } = req.query;
    const jobs = await scrapeLinkedInJobs(q, location, parseInt(page), dateRange);
    res.json(jobs);
  } catch (error) {
    console.error("Error in LinkedIn scraper:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/test-indeed", async (req, res) => {
  try {
    validateQueryParams(req.query);
    const { q, location, page = 1 } = req.query;
    const jobs = await scrapeIndeedJobs(q, location, parseInt(page));
    res.json(jobs);
  } catch (error) {
    console.error("Error in Indeed scraper:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/test-naukri", async (req, res) => {
  try {
    validateQueryParams(req.query);
    const { q, location, page = 1 } = req.query;
    const jobs = await scrapeNaukriJobs(q, location, parseInt(page));
    res.json(jobs);
  } catch (error) {
    console.error("Error in Naukri scraper:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    validateQueryParams(req.query);
    const { q, location, linkedinDateRange, naukriDateRange, indeedDateRange } = req.query;

    const [linkedinJobs, naukriJobs, indeedJobs] = await Promise.all([
      scrapeLinkedInJobs(q, location, 1, linkedinDateRange),
      scrapeNaukriJobs(q, location, 1, naukriDateRange),
      scrapeIndeedJobs(q, location, 1, indeedDateRange)
    ]);

    const jobs = [...linkedinJobs, ...naukriJobs, ...indeedJobs];
    res.json(jobs);
  } catch (error) {
    console.error("Error in combined job scraper:", error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
