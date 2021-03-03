<template>
  <DafView :tractate="currentDaf.tractate" :daf="currentDaf.daf"></DafView>
  <div class="right">
    <input v-model="currentDaf.daf">
    <ol>
      <li v-for="sentence in currentSentences" v-html="sentence.english"></li>
    </ol>
  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import DafView from "./components/DafView.vue";
import {login, getPage, page} from "./realm";
import {currentDaf} from "./state/daf";
import { currentSentences } from "./state/sentences";

export default defineComponent({
  name: 'App',
  components: {
    DafView
  },
  setup() {
    return { currentDaf, currentSentences }
  }
})
</script>

<style>
  .right {
    margin-left: 700px;
  }
</style>