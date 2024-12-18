const express = require("express");
const { getAllNews } = require("./src/scrapers");

const app = express();

app.get("/api/srilanka/health/news", async (req, res) => {
  try {
    const { newspaper, page = 1, limit = 10 } = req.query;

    const allNews = await getAllNews(newspaper);

    const startIndex = (page - 1) * limit;
    const paginatedNews = allNews.slice(startIndex, startIndex + parseInt(limit));

    res.json(paginatedNews);
  } catch (error) {
    console.error("Error fetching health news:", error.message);
    res.status(500).send("Error fetching health news");
  }
});

module.exports = app;
