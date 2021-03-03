<template>
  <div class="flex flex-row w-full h-full pt-2">
    <div>
      <ol>
        <li v-for="sentence in currentSentences" v-html="sentence.english"></li>
      </ol>
    </div>
    <TextPanel></TextPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import TextPanel from "./components/TextPanel.vue";
import {login, getPage, page} from "./realm";
import {currentDaf} from "./state/daf";
import { currentSentences } from "./state/sentences";

export default defineComponent({
  name: 'App',
  components: {
    TextPanel
  },
})
</script>

<style>
  .right {
    margin-left: 700px;
  }
</style>