const axios = require("axios");
const cheerio = require("cheerio");
const { isHealthRelated } = require("../ utils/keywordChecker");

async function scrapeBBC() {
  try {
    const response = await axios.get("https://www.bbc.com/news/topics/cywd23g0gxgt");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];

    $("a[data-testid='internal-link']").each((i, element) => {
      const title = $(element).find("h2").text().trim();
      const description = $(element).find("p").text().trim();
      const link = $(element).attr("href");
      const date = $(element).find("span[data-testid='card-metadata-lastupdated']").text().trim();

      if (isHealthRelated(title)) {
        healthNewsData.push({
          title,
          description,
          link,
          date,
          source: "BBC",
        });
      }
    });

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping BBC:", error.message);
    return [];
  }
}

module.exports = scrapeBBC;
