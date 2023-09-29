const puppeteer = require("puppeteer");
const requestValidator = require("../validator/RequestValidator");
const Sentiment = require("sentiment");
const textScraperController = require("./TextScraperController");

const extractSentiments = async (req, res) => {
  const url = req.body.data;
  const validatorResponse = requestValidator.validateUrl(url);
  if (validatorResponse.error) {
    return res.status(400).json(validatorResponse);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  await page.waitForTimeout(100);

  const divTexts = await textScraperController.extractTextFromDivsAndLists(
    page
  );
  const filteredDivTexts = divTexts.filter(
    (text) => text && text.trim() !== ""
  );

  const pageTitle = await page.title();
  await browser.close();

  const textsAnalysis = analyzeSentimentsFromTextsArray(
    filteredDivTexts,
    pageTitle
  );

  res.json(textsAnalysis);
};

const analyzeSentimentsFromTextsArray = (texts, title) => {
  const sentiment = new Sentiment();
  let analysis;
  let totalScore = 0;
  let totalSentences = 0;
  let totalPositiveWords = [];
  let totalNegativeWords = [];

  for (let i = 0; i < texts.length; i++) {
    analysis = sentiment.analyze(texts[i]);
    totalScore += analysis.score;
    totalSentences++;

    totalPositiveWords = totalPositiveWords.concat(analysis.positive);
    totalNegativeWords = totalNegativeWords.concat(analysis.negative);
  }

  const overallSentiment = totalScore / totalSentences;

  let sentimentLabel;
  if (overallSentiment > 0) {
    sentimentLabel = "Positive";
  } else if (overallSentiment < 0) {
    sentimentLabel = "Negative";
  } else {
    sentimentLabel = "Neutral";
  }

  return {
    title: title,
    overallSentiment: sentimentLabel,
    overallSentimentScore: totalScore,
    overallPositiveWords: totalPositiveWords,
    overallNegativeWords: totalNegativeWords,
  };
};

module.exports = {
  extractSentiments,
};
