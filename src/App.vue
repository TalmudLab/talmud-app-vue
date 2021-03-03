<template>
  <div class="flex flex-row w-full h-full pt-2">
    <NavPanel></NavPanel>
    <TextPanel></TextPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import TextPanel from "./components/TextPanel.vue";
import {login, getPage, page} from "./realm";
import {currentDaf} from "./state/daf";
import { currentSentences } from "./state/sentences";
import NavPanel from "./components/NavPanel.vue";

export default defineComponent({
  name: 'App',
  components: {
    NavPanel,
    TextPanel
  },
})
</script>

<style>
  .right {
    margin-left: 700px;
  }
</style>