<template>
  <div class="flex flex-col w-5/12 h-screen space-y-1">
    <div class="
     flex flex-row items-center
     w-full px-2 h-9
     rounded-t-md">
      <a class="hover:text-blue-500" @click="prev">
        <i class="fas fa-arrow-alt-circle-left nav-button"></i>
        Prev
      </a>

      <h1 class="font-serif flex-grow text-center text-lg">{{headerText}}</h1>
      <a class="hover:text-blue-500" @click="next">
        Next
        <i class="fas fa-arrow-alt-circle-right nav-button"></i>
      </a>
    </div>
    <div class="h-5/6 w-full pt-1">
      <DafView :tractate="currentDaf.tractate" :daf="currentDaf.daf"></DafView>
    </div>
  </div>
</template>

<script lang="ts">

  import { defineComponent } from "vue"
  import DafView from "./DafView.vue";
  import {currentDaf, next, prev} from "../state/daf";
  import {currentSentences} from "../state/sentences";
  export default defineComponent({
    components: {DafView},
    setup() {
      return { currentDaf, next, prev, currentSentences }
    },
    computed: {
      headerText() {
        const { tractate, daf } = this.currentDaf;
        let header = `${tractate} ${daf}`;
        if (!daf.includes('b')) {
          header += 'a'
        }
        return header;
      }
    },
  })

</script>

<style scoped>
  .nav-button {
    @apply text-xl
  }

</style>