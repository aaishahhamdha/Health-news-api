const scrapeDailyMirror = require("./dailyMirror");
const scrapeSundayObserver = require("./sundayObserver");
const scrapeNewsFirst = require("./newsFirst");
const scrapeTimes = require("./times");
const scrapeBBC = require("./bbc");

const scrapers = {
  dailymirror: scrapeDailyMirror,
  sundayobserver: scrapeSundayObserver,
  newsfirst: scrapeNewsFirst,
  times: scrapeTimes,
  bbc: scrapeBBC,
};

const getAllNews = async (newspaper = null) => {
  const selectedScrapers = newspaper
    ? [scrapers[newspaper.toLowerCase()]]
    : Object.values(scrapers);

  const results = await Promise.all(selectedScrapers.map((scraper) => scraper()));
  return results.flat();
};

module.exports = { getAllNews };
