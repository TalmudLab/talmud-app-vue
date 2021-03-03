<template>
  <NavListView></NavListView>
</template>

<script lang="ts">
  import { currentSentences} from "../state/sentences";
  import { currentDaf } from "../state/daf";
  import NavListView from "./NavListView.vue";
  import {defineComponent} from "vue";

  export default defineComponent({
    setup() {
      return { currentSentences, currentDaf }
    }
  })
</script>

<style scoped>

</style>