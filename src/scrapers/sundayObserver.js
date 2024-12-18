const axios = require("axios");
const cheerio = require("cheerio");
const { isHealthRelated } = require("../ utils/keywordChecker");

async function scrapeSundayObserver() {
  try {
    const response = await axios.get("https://www.sundayobserver.lk/");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];

    $(".pcsl-item").each((i, element) => {
      const title = $(element).find(".pcsl-content .pcsl-title a").text().trim();
      const description = $(element).find(".pcsl-content .pcsl-desc").text().trim();
      const link = $(element).find(".pcsl-content .pcsl-title a").attr("href");
      const date = $(element).find(".entry-date").text().trim();

      if (isHealthRelated(title)) {
        healthNewsData.push({
          title,
          description,
          link: link,
          date,
          source: "Sunday Observer",
        });
      }
    });

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping Sunday Observer:", error.message);
    return [];
  }
}

module.exports = scrapeSundayObserver;
