# Web-Scraping-Api-Project

How to run?

From the root folder:
-one terminal for frontend: cd frontend/vue-project && npm run dev
-another terminal for backend: cd backend && npm start

Endpoints:

1. Scraping Text from a Website
Endpoint: /scrape/text
HTTP Method: POST
Description: This endpoint extracts text content from a given website URL.
Request Parameters: data (string, required): The URL of the website to scrape.
Response: Success: 200 OK -> pageTitle (string): The title of the web page, content (array of strings): An array of text content extracted from the page.

2. Scraping Links from a Website
Endpoint: /scrape/links
HTTP Method: POST
Description: This endpoint extracts links (URLs) from a given website URL.
Request Parameters: data (string, required): The URL of the website to scrape.
Response: Success: 200 OK -> pageTitle (string): The title of the web page, content (array of strings): An array of links (URLs) extracted from the page.


3. Scraping Images from a Website
Endpoint: /scrape/images
HTTP Method: POST
Description: This endpoint extracts image URLs from a given website URL.
Request Parameters: data (string, required): The URL of the website to scrape.
Response: Success: 200 OK -> pageTitle (string): The title of the web page, content (array of strings): An array of image URLs extracted from the page.

4. Scraping Sentiments from a Website
Endpoint: /scrape/sentiments
HTTP Method: POST
Description: This endpoint analyzes the sentiment of text content extracted from a given website URL.
Request Parameters: data (string, required): The URL of the website to scrape for sentiment analysis.
Response: Success: 200 OK -> pageTitle (string): The title of the web page, content (object): An object containing sentiment analysis results, including positive, negative, and neutral sentiments, positive and negative words and overall sentiment score.


5. Scraping Word Count from Text
Endpoint: /scrape/blogWordCount
HTTP Method: POST
Description: This endpoint counts the number of words in text content extracted from a given website URL which contains a blog.
Request Parameters: data (string, required): The URL of the website to scrape for word count.
Response: Success: 200 OK -> pageTitle (string): The title of the web page, wordCount (number): The total number of words in the extracted text.