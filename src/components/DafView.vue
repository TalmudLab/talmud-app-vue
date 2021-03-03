<template>
  <DafRenderer :texts="texts" :amud="'b'"></DafRenderer>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import {getPage, login, page} from "../realm";
  import DafRenderer from "./DafRenderer.vue";
  import {sentence, addSentences} from "../state/sentences";

  export default defineComponent({
    components: {DafRenderer},
    props: {
      tractate: String,
      daf: String
    },
    data: () => ({
      page: {} as page,
      loadedPages: [] as Array<page>,
    }),
    async mounted () {
      await login();
      this.loadPage();
    },
    computed: {
      texts () {
        if (this.page?.main) {
          const mainHTML: string = this.page.main.sentences
            .map(sentenceHTML => `<span class="sentence-main">${sentenceHTML}</span> `)
            .join('');
          const headerRegex = /\{([^\{\}]+)\}/g;
          const rashiHTML: string = this.page.rashi.replaceAll(headerRegex, "<b class='rashi-header'>$1</b>");
          const tosafotHTML: string = this.page.tosafot.replaceAll(headerRegex, "<b class='tosafot-header'>$1</b>");
          return [mainHTML, rashiHTML, tosafotHTML];
        }
      }
    },
    methods: {
      async loadPage(): Promise<void> {
        //TODO: Check validity of tractate/daf
        if (this.tractate && this.daf) {
          const alreadyLoaded = this.loadedPages.find(
            page => page.tractate == this.tractate && page.daf == this.daf)
          if (alreadyLoaded) {
            this.page = alreadyLoaded;
            return;
          }
          const newlyLoadedPage = await getPage(this.tractate, this.daf);
          if (newlyLoadedPage) {
            this.page = newlyLoadedPage;
            this.loadedPages.push(newlyLoadedPage);
            const heSentences = newlyLoadedPage?.main?.sentences;
            const enSentences = newlyLoadedPage?.main?.enSentences;
            if (heSentences && enSentences && heSentences.length == enSentences.length) {
              const sentences: Array<sentence> = heSentences.map( (hebrew, index) => ({
                english: enSentences[index],
                hebrew,
                index
              }));
              addSentences(this.tractate, this.daf, sentences);
            }
          }
        }
      }
    },
    watch: {
      tractate (newVal, oldVal) {
        this.loadPage();
      },
      daf (newVal, oldVal) {
        this.loadPage();
      }
    }
  })
</script>

<style>
  .tosafot-header {
    font-family: Vilna;
    font-size: 135%;
  }
  .tosafot-header:nth-of-type(odd) {
    font-size: 180%;
  }
</style>