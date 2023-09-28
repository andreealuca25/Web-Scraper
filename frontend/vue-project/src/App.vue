<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>Hello World</div>
  <scraping-form></scraping-form>
</template>

<script>
import ScrapingForm from '@/components/ScrapingForm.vue'; // Import the component

export default {
  components: {
    'scraping-form': ScrapingForm // Register the component
  }
};
</script>

<style scoped>

</style>
