const puppeteer = require("puppeteer");
const requestValidator = require("../validator/RequestValidator");

const extractText = async (req, res) => {
  const url = req.body.data;
  const validatorResponse = requestValidator.validateUrl(url);
  if (validatorResponse.error) {
    return res.status(400).json(validatorResponse);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  await page.waitForTimeout(100);

  const texts = await extractTextFromDivsAndLists(page);
  const filteredTexts = texts.filter((text) => text && text.trim() !== "");

  const pageTitle = await page.title();
  await browser.close();

  const scrapedContent = { title: pageTitle, content: [...filteredTexts] };
  res.send(JSON.stringify(scrapedContent, null, 2));
};

const extractLinks = async (req, res) => {
  const url = req.body.data;
  const validatorResponse = requestValidator.validateUrl(url);
  if (validatorResponse.error) {
    return res.status(400).json(validatorResponse);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  await page.waitForTimeout(100);

  const scrappedLinks = await page.evaluate(() => {
    const anchorElements = document.querySelectorAll("a");

    const linkSet = new Set();
    anchorElements.forEach((element) => {
      const href = element.getAttribute("href");
      if (href) {
        linkSet.add(href);
      }
    });

    return Array.from(linkSet);
  });

  const pageTitle = await page.title();
  await browser.close();

  const scrapedContent = { title: pageTitle, content: [...scrappedLinks] };
  res.send(JSON.stringify(scrapedContent, null, 2));
};

const extractBlogWordCount = async (req, res) => {
  const url = req.body.data;
  const validatorResponse = requestValidator.validateUrl(url);
  if (validatorResponse.error) {
    return res.status(400).json(validatorResponse);
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  await page.waitForTimeout(100);

  await page.waitForSelector("body");

  const textContent = await page.evaluate(() => {
    const text = document.body.textContent;
    return text;
  });

  const pageTitle = await page.title();
  await browser.close();

  const words = textContent.split(/\s+/);
  const wordCount = words.length;

  const scrapedContent = { title: pageTitle, wordCount: wordCount };
  res.send(JSON.stringify(scrapedContent, null, 2));
};

const extractTextFromElements = async (element, selector) => {
  const elements = await element.$$(selector);
  const textPromises = elements.map(async (el) => {
    const text = await el.evaluate((element) => element.textContent.trim());
    return text;
  });
  return Promise.all(textPromises);
};

const extractTextFromDivsAndLists = async (element) => {
  const divTexts = await extractTextFromElements(element, "div:not(:has(div))");
  const listTexts = await extractTextFromElements(element, "ul li");
  return divTexts.concat(listTexts);
};

module.exports = {
  extractText,
  extractLinks,
  extractTextFromDivsAndLists,
  extractBlogWordCount,
};
