const axios = require("axios");
const cheerio = require("cheerio");
const { isHealthRelated } = require("../ utils/keywordChecker");

async function scrapeNewsFirst() {
  try {
    const response = await axios.get("https://english.newsfirst.lk/");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];

    $(".latest_news_main_div").each((i, element) => {
      const title = $(element).find("h4").text().trim();
      const description = $(element).find("p").first().text().trim();
      const link = $(element).find("a").attr("href");
      const date = $(element).find(".time_date").text().trim();

      if (isHealthRelated(title) || isHealthRelated(description)) {
        healthNewsData.push({
          title,
          description,
          link: link,
          date,
          source: "News First",
        });
      }
    });

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping News First:", error.message);
    return [];
  }
}

module.exports = scrapeNewsFirst;
