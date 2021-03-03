<template>
  <div class="w-1/3">
    <NavListView :sentences="currentSentences" :selected-index="selectedIndex" @selected="onSelected"></NavListView>
  </div>
</template>

<script lang="ts">
  import { currentSentences, selectedSentence, selectSentence} from "../state/sentences";
  import { currentDaf } from "../state/daf";
  import NavListView from "./NavListView.vue";
  import {defineComponent} from "vue";

  export default defineComponent({
    components: {NavListView},
    setup() {
      return { currentSentences, selectedSentence, selectSentence, currentDaf }
    },
    computed: {
      selectedIndex() {
        if (selectedSentence && selectedSentence.tractate == currentDaf.tractate && selectedSentence.daf == currentDaf.daf) {
          return selectedSentence.index;
        }
        return -1;
      },
      onSelected ({index}) {
        console.log("GOT IT", index)
      }
    }
  })
</script>

<style scoped>

</style>