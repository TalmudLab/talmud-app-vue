<template>
  <div class="flex flex-row w-full h-full pt-2">
    <NavPanel></NavPanel>
    <TextPanel></TextPanel>
    <ConnectionPanel v-if="selectedConnection.author" :connection="selectedConnection"></ConnectionPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import TextPanel from "./components/TextPanel.vue";
import NavPanel from "./components/NavPanel.vue";
import ConnectionPanel from "./components/ConnectionPanel.vue";
import {selectedConnection} from "./state/selections";

export default defineComponent({
  name: 'App',
  components: {
    ConnectionPanel,
    NavPanel,
    TextPanel
  },
  setup() {
    return {
      selectedConnection
    }
  }
})
</script>

<style>
  .right {
    margin-left: 700px;
  }
</style>