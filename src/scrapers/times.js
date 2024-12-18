const axios = require("axios");
const cheerio = require("cheerio");
const { isHealthRelated } = require("../ utils/keywordChecker");

async function scrapeTimes() {
  try {
    const response = await axios.get("https://www.thetimes.com/");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];

    $(".Item").each((i, element) => {
      const title = $(element).find("h3.Item-headline").text().trim();
      let description = $(element).find(".Strapline.Item-strapline").text().trim();
      const link = $(element).find("a").attr("href");
      const date = $(element).find(".timesss h4").text().trim();

      // Shorten description for consistency
      const maxLength = 50;
      if (description.length > maxLength) {
        description = description.substring(0, maxLength) + "...";
      }

      if (isHealthRelated(title) || isHealthRelated(description)) {
        healthNewsData.push({
          title,
          description,
          link: `https://thetimes.com/uk${link}`,
          date,
          source: "The Times",
        });
      }
    });

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping The Times:", error.message);
    return [];
  }
}

module.exports = scrapeTimes;
