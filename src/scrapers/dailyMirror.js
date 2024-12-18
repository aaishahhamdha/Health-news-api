const axios = require("axios");
const cheerio = require("cheerio");
const { isHealthRelated } = require("../ utils/keywordChecker");

async function scrapeDailyMirror() {
  try {
    const response = await axios.get("https://www.dailymirror.lk/");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];

    $(".latest_news_boxs").each((i, element) => {
      const title = $(element).find("h4 a").text().trim();
      const description = $(element).find("p").first().text().trim();
      const link = $(element).find("h4 a").attr("href");
      const date = $(element).find(".timesss h4").text().trim();

      if (isHealthRelated(title) || isHealthRelated(description)) {
     
        if (title && description) {
          healthNewsData.push({
            title,
            description, 
            link: link,
            date,
            source: "Daily Mirror",
          });
        }
      }
    });


    const uniqueNewsData = healthNewsData.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (item) =>
            item.title === value.title && item.description === value.description
        )
    );

    return uniqueNewsData;
  } catch (error) {
    console.error("Error scraping Daily Mirror:", error.message);
    return [];
  }
}

module.exports = scrapeDailyMirror;
