<template>
  <div class="w-1/3">
    <NavListView :sentences="currentSentences"></NavListView>
  </div>
</template>

<script lang="ts">
  import { currentSentences} from "../state/sentences";
  import { currentDaf } from "../state/daf";
  import NavListView from "./NavListView.vue";
  import {defineComponent} from "vue";

  export default defineComponent({
    components: {NavListView},
    setup() {
      return { currentSentences, currentDaf }
    }
  })
</script>

<style scoped>

</style>