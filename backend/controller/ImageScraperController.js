const puppeteer = require("puppeteer");
const requestValidator = require("../validator/RequestValidator");

const extractImages = async (req, res) => {
  const url = req.body.data;
  const validatorResponse = requestValidator.validateUrl(url);
  if (validatorResponse.error) {
    return res.status(400).json(validatorResponse);
  }
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load" });

    await page.waitForTimeout(100);

    const imageUrls = await page.evaluate(() => {
      const imgElements = document.querySelectorAll("img");

      const imageUrlArray = [];
      imgElements.forEach((element) => {
        const src = element.getAttribute("src");
          if (src) {
          imageUrlArray.push(src);
        }
      });

      return imageUrlArray;
    });
    await browser.close();

    res.status(200).json({ imageUrls });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while scraping images." });
  }
};

module.exports = {
  extractImages,
};
