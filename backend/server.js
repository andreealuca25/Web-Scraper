const express = require("express");
const app = express();
const port = 3000;

const scraperRouter = require("./routes/scraper");
app.use("/scrape", scraperRouter);

app.get("/", (req, res) => {
  res.send("OK")
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});