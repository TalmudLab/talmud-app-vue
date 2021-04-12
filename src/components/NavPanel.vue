<template>
  <div class="w-1/3 h-screen overflow-scroll mr-2 ml-3">
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
    <NavListView v-if="list" :sentences="currentSentenceRenders" :selected-index="selectedIndex" @selected="onSelected" :english="english"></NavListView>
    <NavMapView v-else :sentences="currentSentenceRenders" :selected-index="selectedIndex" @selected="onSelected" :english="english"></NavMapView>
  </div>
</template>

<script lang="ts">
  import NavListView from "./NavListView.vue";
  import {defineComponent} from "vue";
  import NavMapView from "./NavMapView.vue";
  import {currentDaf, currentSentenceRenders, currentSentenceRange} from "../state/current";
  import {selectSentence} from "../state/actions";
  import {sentenceData, sentenceRender} from "../state/types";
  import {selectedSentence} from "../state/selections";
  import {dafEquals} from "../utils/daf";

  export default defineComponent({
    components: {NavListView, NavMapView},
    setup() {
      return { currentSentenceRenders, currentDaf, selectedSentence, currentSentenceRange }
    },
    data: () => ({
      english: true,
      list: true
    }),
    computed: {
      selectedIndex() {
        if (Array.isArray(this.currentSentenceRenders) && this.selectedSentence.daf) {
          return this.currentSentenceRenders.findIndex( (s: sentenceRender) => dafEquals(s.sentence.daf, this.selectedSentence.daf) && this.selectedSentence.index == s.sentence.index);
        }
        return -1;
      },
    },
    methods: {
      onSelected ({sentence}: {sentence: sentenceData}) {
        selectSentence(sentence.daf, sentence.index);
      }
    }
  })
</script>

<style scoped>

</style>