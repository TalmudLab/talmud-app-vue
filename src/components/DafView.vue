<template>
  <div id="daf-container" :style="transformStyles">
    <DafRenderer :texts="texts" :amud="amud"></DafRenderer>
  </div>
</template>

<script lang="ts">
import {defineComponent, watch} from "vue";
  import {getPage, login, page} from "../realm";
  import DafRenderer from "./DafRenderer.vue";
  import {sentence, addSentences, selectedSentence} from "../state/sentences";

  export default defineComponent({
    components: {DafRenderer},
    props: {
      tractate: String,
      daf: String,
      scale: {
        type: Boolean,
        default: true
      }
    },
    setup (props) {
      watch(selectedSentence, (sentence, prev) => {
        if (sentence.tractate == props.tractate && sentence.daf == props.daf) {
          const main = document.querySelectorAll(".sentence-main");
          main.forEach(el => el.classList.remove('highlighted'));
          main[sentence.index].classList.add('highlighted');
        }
      })
      return {
        selectedSentence
      }
    },
    data: () => ({
      page: {} as page,
      loadedPages: [] as Array<page>,
      windowWidth: window.innerWidth,
      dafWidth: 600,
      dafOfWindow: 4.95/12,
    }),
    async mounted () {
      await login();
      this.loadPage();
      window.addEventListener('resize', this.onResize)
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
      },
      transformStyles () {
        if (!this.scale) return;
        const scale = (this.windowWidth * this.dafOfWindow) / (this.dafWidth);
        return {
          transform: `scale(${scale})`,
          'transform-origin': 'top left'
        }
      },
      amud () {
        if (this.daf[this.daf.length - 1] == 'b') {
          return 'b';
        }
        return 'a';
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
            let enSentences = newlyLoadedPage?.main?.enSentences;
            //TODO: fix this server-side
            if (enSentences?.length == 2 && Array.isArray(enSentences[0])) {
              enSentences = enSentences[0];
            }
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
      },
      onResize() {
        this.windowWidth = window.innerWidth;
      },
    },
    watch: {
      tractate (newVal, oldVal) {
        this.loadPage();
      },
      daf (newVal, oldVal) {
        this.loadPage();
      },
    }
  })
</script>

<style>
  #daf-container {
  }
  .highlighted {
    background-color: #BFDBFE;
  }
  .tosafot-header {
    font-family: Vilna;
    font-size: 135%;
  }
  .tosafot-header:nth-of-type(odd) {
    font-size: 180%;
  }
</style>