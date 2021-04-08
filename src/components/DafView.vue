<template>
  <div id="daf-container" :style="transformStyles">
    <DafRenderer :texts="texts" :amud="amud" @rendered="onRendered"></DafRenderer>
  </div>
</template>

<script lang="ts">
import {defineComponent, watch} from "vue";
  import DafRenderer from "./DafRenderer.vue";
import {
  selectedSentence, selectedCommentary
} from "../state/selections";
import {apiPage, login}  from "../realm";
import { loadPage, selectSentence, selectCommentary } from "../state/actions";

const sentenceClass = {
    main: "sentence-main",
    tosafot: "sentence-tosafot",
    rashi: "sentence-rashi"
  }
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
          const main = document.querySelectorAll("." + sentenceClass.main);
          main.forEach(el => el.classList.remove('highlighted'));
          main[sentence.index].classList.add('highlighted');
        }
      })

      watch(selectedCommentary, (commentary, prev) => {
        if (commentary.tractate == props.tractate && commentary.daf == props.daf) {
          const wrappers = document.querySelectorAll(`.${sentenceClass.rashi}, .${sentenceClass.tosafot}`);
          wrappers.forEach(el => el.classList.remove('highlighted'));
          if (commentary.index != null) {
            document.querySelector(`.${sentenceClass[commentary.text]}:nth-of-type(${commentary.index + 1})`).classList.add('highlighted');
          }
        }
      })

      const onRendered = () => {
        const main = document.querySelectorAll("." + sentenceClass.main);
        main.forEach( (el, index) => el.addEventListener("click", () => {
          if (props.tractate && props.daf)
            selectSentence({tractate: props.tractate, daf: props.daf}, index);
        }))

        let count = 0;
        const setupWrapper = (header: Element, text : "tosafot" | "rashi") => {
          if (!header || header.parentElement?.classList.contains(sentenceClass[text])) {
            return;
          }
          let curr = header.nextSibling;
          const betweenNodes = [];
          if (text == "tosafot") {
            if (!curr)
              throw new Error("Unexpected tosafot formatting")
            betweenNodes.push(curr); //Curr is second header element (or first text element, but there's guaranteed to be one)
            curr = curr.nextSibling;
          }
          while (curr && (curr.nodeType == 3 || curr.nodeName == "BR")) {
            betweenNodes.push(curr);
            curr = curr.nextSibling;
          }
          const wrapper = document.createElement("span");
          wrapper.classList.add(sentenceClass[text]);
          header.parentNode.insertBefore(wrapper, header);
          wrapper.append(header, ...betweenNodes);
          const index = count++;
          wrapper.addEventListener("click", () => selectCommentary({tractate: props.tractate, daf: props.daf}, index, text));
        }

        document.querySelectorAll(".rashi-header")
          .forEach( (header, index) => setupWrapper(header, "rashi"));

        count = 0;
        document.querySelectorAll(".tosafot-header")
          .forEach( (firstHeader, index) => setupWrapper(firstHeader, "tosafot"));
      }
      return {
        selectedSentence,
        onRendered,
      }
    },
    data: () => ({
      page: {} as apiPage,
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
            .map(mainSentence => mainSentence.he)
            .map(sentenceHTML => `<span class="${sentenceClass.main}">${sentenceHTML}</span> `)
            .join('');
          const headerRegex = /\{([^\{\}]+)\}/g;
          const rashiHTML: string = this.page.rashi.replaceAll(headerRegex, "<b class='rashi-header'>$1</b>");
          const tosafotHTML: string = this.page.tosafot.replaceAll(headerRegex, "<b class='tosafot-header'>$1</b>");
          return [mainHTML, rashiHTML, tosafotHTML];
        }
      },
      transformStyles () {
        if (!this.scale) return;
        const scale : number = (this.windowWidth * this.dafOfWindow) / (this.dafWidth);
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
      async loadPage() {
        const page = await loadPage(this.tractate, this.daf);
        if (page) this.page = page;
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
  .sentence-main.highlighted {
    background-color: #BFDBFE;
  }
  .sentence-rashi.highlighted {
    background-color: #FECACA;
  }

  .sentence-tosafot.highlighted {
    background-color: #FECACA;
  }

  .tosafot-header {
    font-family: Vilna;
    font-size: 135%;
  }
  .tosafot-header:nth-of-type(odd) {
    font-size: 180%;
  }
</style>