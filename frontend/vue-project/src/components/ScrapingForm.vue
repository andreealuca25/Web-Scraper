<template>
  <div class="content">
    <div class="left-section">
      <div class="website-field">
        <label for="website-input">Website URL: </label>
        <input
          id="website-input"
          type="text"
          v-model="website"
          @input="validateWebsite"
          placeholder="Enter the website that you want to use."
          required
        />
        <p v-if="validationError" class="error">{{ validationError }}</p>
      </div>

      <div class="buttons">
        <button @click="scrape('http://localhost:3000/scrape/text')" :disabled="isInputDisabled">
          Get text
        </button>
        <button @click="scrapeLinks" :disabled="isInputDisabled">
          Get links
        </button>
        <button
          @click="scrape('http://localhost:3000/scrape/sentiments')"
          :disabled="isInputDisabled"
        >
          Get Sentiment
        </button>
        <button @click="scrapeImages" :disabled="isInputDisabled">Get images</button>
        <button @click="scrapeBlog" :disabled="isInputDisabled">Get Blog Word Count</button>
      </div>
    </div>
    <div class="right-section">
      <div class="result-buttons">
        <button @click="downloadJson" :disabled="!hasValidJsonToDownload">Download JSON</button>
        <button @click="clearAll" :disabled="isInputDisabled">Clear</button>
      </div>
      <div class="result">
        <div
          v-if="imageUrls.length === 0 && resultFromScraping === '' && errorResult === ''"
          class="no-results-message"
        >
          No results found.
        </div>
        <JSONTable :jsonData="resultFromScraping" v-if="resultFromScraping" />
        <div v-for="imageUrl in imageUrls" :key="imageUrl">
          <div class="image-wrapper">
            <img class="scraped-img" :src="baseUrl + imageUrl" alt="Scraped Image" />
            <a :href="baseUrl + imageUrl" target="_blank" download class="view-button">View</a>
          </div>
        </div>
        <p class="error" v-if="errorResult">{{ errorResult }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '../assets/ScrapingForm.css'
import JSONTable from './JSONTable.vue'

export default {
  data() {
    return {
      website: '',
      validationError: '',
      resultFromScraping: '',
      errorResult: '',
      hasValidJsonToDownload: false,
      imageUrls: [],
      baseUrl: ''
    }
  },
  computed: {
    isInputDisabled() {
      return !!this.validationError || this.website == ''
    }
  },
  methods: {
    async scrapeImages() {
      this.clearResult()
      const urlObject = new URL(this.website)
      this.baseUrl = urlObject.origin
      try {
        const response = await axios.post('http://localhost:3000/scrape/images', {
          data: this.website
        })
        this.imageUrls = response.data.imageUrls
        this.errorResult = ''
      } catch (error) {
        console.log('error while scraping: ', error)
        this.hasValidJsonToDownload = false
        this.errorResult = 'Internal error occurred while scraping images.'
      }
    },
    async scrape(url) {
      this.clearResult()
      try {
        const response = await axios.post(url, {
          data: this.website
        })
        this.resultFromScraping = response.data
        this.hasValidJsonToDownload = true
        this.errorResult = ''
      } catch (error) {
        console.log('error while scraping: ', error)
        this.hasValidJsonToDownload = false
        this.errorResult = 'Internal error occurred while scraping.'
      }
    },
       async scrapeLinks() {
      this.clearResult()
      try {
        const response = await axios.post('http://localhost:3000/scrape/links', {
          data: this.website
        })
        const responseData = response.data;
        responseData.content = this.transformRelativeLinks(responseData.content)

        this.resultFromScraping = response.data
        this.hasValidJsonToDownload = true
        this.errorResult = ''
      } catch (error) {
        console.log('error while scraping: ', error)
        this.hasValidJsonToDownload = false
        this.errorResult = 'Internal error occurred while scraping.'
      }
    },
    transformRelativeLinks(relativeLinks) {
      return relativeLinks.map((relativeLink) => `${this.website}${relativeLink}`);
    },
    async scrapeBlog() {
      this.clearResult()
      if (this.website.includes('blog')) {
        try {
          const response = await axios.post('http://localhost:3000/scrape/blogWordCount', {
            data: this.website
          })
          this.resultFromScraping = response.data
          this.hasValidJsonToDownload = true
          this.errorResult = ''
        } catch (error) {
          console.log('error while scraping: ', error)
          this.errorResult = 'Internal error occurred while scraping Blog.'
        }
      } else {
        this.errorResult = 'Website URL is not valid, because it is not a blog.'
      }
    },
    validateWebsite() {
      const urlPattern =
        /^(https?:\/\/)?([a-z0-9-]+\.)?[a-z0-9-]+\.[a-z]{2,6}([-a-z0-9._~:/?#[\]@!$&'()*+,;=]+)?$/i

      if (!urlPattern.test(this.website)) {
        this.validationError = 'Please enter a valid website URL.'
      } else if (urlPattern === '') {
        this.validationError = ''
      } else {
        this.validationError = ''
      }
    },
    downloadJson() {
      const blob = new Blob([JSON.stringify(this.resultFromScraping, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'data.json'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    },
    clearAll() {
      this.resultFromScraping = ''
      this.errorResult = ''
      this.website = ''
      this.hasValidJsonToDownload = false
      this.imageUrls = []
    },
    clearResult() {
      this.resultFromScraping = ''
      this.errorResult = ''
      this.imageUrls = []
      this.hasValidJsonToDownload = false
    }
  },
  components: {
    JSONTable
  }
}
</script>

<style scoped></style>
