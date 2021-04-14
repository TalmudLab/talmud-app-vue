<template>
  <div class="flex flex-col w-5/12 h-screen overflow-y-auto overflow-x-visible space-y-1">
    <div class="
     flex flex-row items-center
     w-full px-2 h-9
     rounded-t-md">
      <a class="hover:text-blue-500" @click="prevDaf">
        <i class="fas fa-arrow-alt-circle-left nav-button"></i>
        Prev
      </a>

      <h1 class="font-serif flex-grow text-center text-lg">{{headerText}}</h1>
      <a class="hover:text-blue-500 mr-2" @click="nextDaf">
        Next
        <i class="fas fa-arrow-alt-circle-right nav-button"></i>
      </a>
    </div>
    <div class="w-full pt-1">
      <DafView :tractate="currentDaf.tractate" :daf="currentDaf.daf"></DafView>
    </div>
  </div>
</template>

<script lang="ts">

  import { defineComponent } from "vue"
  import DafView from "./DafView.vue";
  import {nextDaf, prevDaf} from "../state/actions";
  import {currentDaf} from "../state/current";
  export default defineComponent({
    components: {DafView},
    setup() {
      return { currentDaf, nextDaf, prevDaf }
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

  .w-daf {
    width: 660px;
  }

</style>