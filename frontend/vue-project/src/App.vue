<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="title">
      <h1 class="page-title">Web Scraper</h1>
    </div>
    <scraping-form></scraping-form>
  </div>
</template>

<script>
import ScrapingForm from '@/components/ScrapingForm.vue'

export default {
  components: {
    'scraping-form': ScrapingForm
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
