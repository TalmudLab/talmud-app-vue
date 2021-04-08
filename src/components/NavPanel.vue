<template>
  <div class="w-1/3 mr-2">
    <div class="
     flex flex-row items-center
     w-full px-2 h-9
     bg-blue-200 rounded-t-md">
      <div class="text-sm">
        <a class="hover:font-bold cursor-pointer" :class="{'font-bold': english}" @click="english = true">
          English
        </a>
        /
        <a class="hover:font-bold cursor-pointer" :class="{'font-bold': !english}" @click="english = false">
          Hebrew
        </a>
      </div>

      <h1 class="font-serif flex-grow text-center text-lg">Navigation</h1>

      <div class="text-sm">
        <a class="hover:font-bold cursor-pointer" :class="{'font-bold': list}" @click="list = true">
          List
        </a>
        /
        <a class="hover:font-bold cursor-pointer" :class="{'font-bold': !list}" @click="list = false">
          Map
        </a>
      </div>
    </div>
    <NavListView v-if="list" :sentences="currentSentences" :selected-index="selectedIndex" @selected="onSelected" :english="english"></NavListView>
    <NavMapView v-else :sentences="currentSentences" :selected-index="selectedIndex" @selected="onSelected" :english="english"></NavMapView>
  </div>
</template>

<script lang="ts">
  import NavListView from "./NavListView.vue";
  import {defineComponent} from "vue";
  import NavMapView from "./NavMapView.vue";
  import {currentDaf} from "../state/current";
  import {selectSentence} from "../state/actions";

  export default defineComponent({
    components: {NavListView, NavMapView},
    setup() {
      return { currentSentences, selectedSentence, selectSentence, currentDaf }
    },
    data: () => ({
      english: true,
      list: true
    }),
    computed: {
      selectedIndex() {
        if (selectedSentence && selectedSentence.tractate == currentDaf.tractate && selectedSentence.daf == currentDaf.daf) {
          return selectedSentence.index;
        }
        return -1;
      },
    },
    methods: {
      onSelected ({index}: {index: number}) {
        if (index != selectedSentence?.index) {
          selectSentence({ , index);
          console.log("reselect")
        }
      }
    }
  })
</script>

<style scoped>

</style>