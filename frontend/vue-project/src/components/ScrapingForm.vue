<template>
  <div>
    <input v-model="inputText" type="text" placeholder="Enter text">
    <button @click="sendRequest">Send Request</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      inputText: '',
    };
  },
  methods: {
    async sendRequest() {
      try {
        const response = await axios.post('http://localhost:3000/scrape/text', {
          data: this.inputText,
        });
        console.log('Server response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
};
</script>
