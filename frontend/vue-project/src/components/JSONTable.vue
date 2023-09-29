<template>
  <div>
    <table class="json-table">
      <thead>
        <tr>
          <th class="key-header">Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in jsonData" :key="key">
          <td class="key-cell">{{ key }}</td>
          <td>
            <template v-if="Array.isArray(value)">
              <ul class="array-list">
                <li v-for="(item, index) in value" :key="index">
                  <a v-if="isLink(item)" :href="item" target="_blank">{{ item }}</a>
                  <span v-else>{{ item }}</span>
                </li>
              </ul>
            </template>
            <template v-else>
              {{ value }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import "../assets/JSONTable.css"
export default {
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  },
  computed: {
    },
  methods: {
    isLink(value) {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return urlPattern.test(value);
    },
  },
}
</script>

<style scoped>
</style>