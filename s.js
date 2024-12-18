const port = 8000;
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

// Expanded list of keywords to filter health-related news
const healthKeywords = [
  "health", "medical", "medicine", "disease", "hospital",
  "treatment", "vaccination", "surgery", "virus",
  "nutrition", "covid", "pandemic", "therapy", "patient",
  "doctor", "nurse", "cancer", "diabetes",
  "pharmaceutical", "diagnosis", "epidemic", "physician", "clinic",
  "symptoms", "epilepsy", "obesity", "stroke", "cholesterol",
  "hypertension", "allergy", "cardiology", "dermatology", "orthopedic",
  "neurology", "oncology", "pediatrics", "psychiatry", "respiratory","surgery", "infection prevention", "vaccines",
  "public health", "dental", "diet", "weight loss", "healthcare", 
  "hepatitis", "arthritis", "HIV", "AIDS", "virus outbreak", "pandemic",
  "quarantine",  "biohazard", "laboratory", "ICU",
];

// Function to check if text contains any health-related keywords
function isHealthRelated(text) {
  return healthKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
}

// Unified endpoint to scrape all health news
app.get("/all-news", async (req, res) => {
  const sources = [
    scrapeDailyMirror,
    scrapeSundayObserver,
    scrapeNewsFirst,
    scrapeTimes,
    scrapeBBC
  ];

  try {
    const results = await Promise.all(sources.map(source => source()));
    const combinedResults = results.flat();
    res.json(combinedResults);
  } catch (error) {
    console.error("Error fetching combined news:", error.message);
    res.status(500).send("Error fetching combined health news");
  }
});

// Scrape health news from Daily Mirror
async function scrapeDailyMirror() {
  try {
    const response = await axios.get("https://www.dailymirror.lk/");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];

    $(".latest_news_boxs").each((i, element) => {
        const title = $(element).find("h4 a").text().trim();
        const description = $(element).find("p").first().text().trim(); // Fetch first <p> tag text
        const link = $(element).find("h4 a").attr("href");
        const date = $(element).find(".timesss h4").text().trim();
      
        if (isHealthRelated(title) || isHealthRelated(description)) {
          healthNewsData.push({
            title,
            description,
            link: `https://www.dailymirror.lk${link}`,
            date,
            source: "Daily Mirror"
          });
        }
      });
      

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping Daily Mirror:", error.message);
    return [];
  }
}

// Scrape health news from Sunday Observer
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
          link: `https://www.sundayobserver.lk${link}`,
          date,
          source: "Sunday Observer"
        });
      }
    });

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping Sunday Observer:", error.message);
    return [];
  }
}

// Scrape health news from News First
async function scrapeNewsFirst() {
  try {
    const response = await axios.get("https://english.newsfirst.lk/");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];
    $(".latest_news_main_div").each((i, element) => {
        const title = $(element).find("h4").text().trim();
        const description = $(element).find("p").first().text().trim(); // First <p> tag
        const link = $(element).find("a").attr("href");
        const date = $(element).find(".time_date").text().trim();
      
        if (isHealthRelated(title) || isHealthRelated(description)) {
          healthNewsData.push({
            title,
            description,
            link: `https://english.newsfirst.lk${link}`,
            date,
            source: "News First"
          });
        }
      });
      

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping News First:", error.message);
    return [];
  }
}


async function scrapeTimes() {
    try {
      const response = await axios.get("https://www.thetimes.com/");
      const html = response.data;
      const $ = cheerio.load(html);
      let healthNewsData = [];
  
      // Scrape articles based on the given HTML structure
      $(".Item").each((i, element) => {
        const title = $(element).find("h3.Item-headline").text().trim();
        let  description = $(element).find(".Strapline.Item-strapline").text().trim();
        const link = $(element).find("a").attr("href");
        const date = $(element).find(".timesss h4").text().trim(); // Assuming date is located here


        // Limit the description length (e.g., 50 characters) and add ellipsis if it exceeds that length
        const maxLength = 50;
        if (description.length > maxLength) {
          description = description.substring(0, maxLength) + '...';
        }
        // Check if the title or description contains any health-related keywords
        if (isHealthRelated(title) || isHealthRelated(description)) {
          healthNewsData.push({
            title,
            description,
            link: `https://www.thetimes.com${link}`,
            date,
            source: "The Times"
          });
        }
      });
  
      return healthNewsData;
    } catch (error) {
      console.error("Error scraping The Times:", error.message);
      return [];
    }
  }
  
  
// Scrape health news from BBC
async function scrapeBBC() {
  try {
    const response = await axios.get("https://www.bbc.com/news/topics/cywd23g0gxgt");
    const html = response.data;
    const $ = cheerio.load(html);
    let healthNewsData = [];

    $("a[data-testid='internal-link']").each((i, element) => {
      const title = $(element).find("h2").text().trim();
      const description = $(element).find("p").text().trim();
      const link = `https://www.bbc.com${$(element).attr("href")}`;
      const date = $(element).find("span[data-testid='card-metadata-lastupdated']").text().trim();

      if (isHealthRelated(title)) {
        healthNewsData.push({
          title,
          description,
          link,
          date,
          source: "BBC"
        });
      }
    });

    return healthNewsData;
  } catch (error) {
    console.error("Error scraping BBC:", error.message);
    return [];
  }
}

// Start the server
app.listen(port, () => {
  console.log("Server is running on port", port);
});
