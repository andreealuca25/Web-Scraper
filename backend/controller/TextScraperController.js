
const puppeteer = require("puppeteer");
  
const extractText = async (req, res) => {

  console.log("url", req.body.data);
 //TODO add validation FE and BE
  const url = req.body.data;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  await page.waitForTimeout(100);

  const divtexts = await extractTextFromDivs(page);

  // console.log("text:");
  // console.log(divtexts);

  res.send(divtexts);
  await browser.close();
};

 const extractTextFromDivs = async (element) => {
   const divs = await element.$$("div:not(:has(div))");
   const textPromises = divs.map(async (topDiv) => {
     const text = await topDiv.evaluate((div) => div.textContent.trim());
     return text;
   });
   return Promise.all(textPromises);
 };

module.exports = {
  extractText
};
