<template>
  <div id="daf-container" ref="dafContainer">
    <DafRenderer :style="transformStyles" :texts="texts" :amud="amud" @rendered="onRendered"
                 @resized="onResize"></DafRenderer>
    <span class="preload">preload</span>
  </div>
</template>

<script lang="ts">
import {defineComponent, watch, nextTick, ref} from "vue";
import DafRenderer from "./DafRenderer.vue";
import {
  selectedSentence, selectedCommentaries
} from "../state/selections";
import {apiPage, login} from "../fetch/realm";
import {loadPage, selectSentence, selectCommentary} from "../state/actions";
import {dafEquals} from "../utils/daf";
import {currentSentenceRange} from "../state/current";

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
  setup(props) {

    const propsDaf = () => ({tractate: props.tractate, daf: props.daf});
    const dafContainer = ref(null);

    const rendered = ref(false);

    window.addEventListener("resize", () => rendered.value = false)
    const checkSelectedSentence = () => {
      if (dafEquals(selectedSentence.daf, propsDaf())) {
        const main = document.querySelectorAll("." + sentenceClass.main);
        main.forEach(el => el.classList.remove('highlighted'));
        const selectedEl = main[selectedSentence.index];
        if (selectedEl) {
          selectedEl.classList.add('highlighted');


          const rect = selectedEl.getBoundingClientRect();
          const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
          if (rect.top < 0 || rect.bottom - viewHeight >= 0)
            selectedEl.scrollIntoView();
        }
      }
    }

    const checkSelectedCommentaries = () => {
      const wrappers = document.querySelectorAll(`.${sentenceClass.rashi}, .${sentenceClass.tosafot}`);
      wrappers.forEach(el => el.classList.remove('highlighted'));
      selectedCommentaries.forEach(commentary => {
        if (dafEquals(commentary.daf, propsDaf())) {
          if (commentary.index != null) {
            document.querySelector(`.${sentenceClass[commentary.text]}:nth-of-type(${commentary.index + 1})`).classList.add('highlighted');
          }
        }
      })
    }
    watch(selectedSentence, (sentence, prev) => checkSelectedSentence())

    watch(selectedCommentaries, (now, prev) => checkSelectedCommentaries())

    const onRendered = () => {
      console.log("got event")
      rendered.value = true;
      const main = document.querySelectorAll("." + sentenceClass.main);
      main.forEach((el, index) => el.addEventListener("click", () => {
        if (props.tractate && props.daf)
          selectSentence(propsDaf(), index);
      }))

      let count = 0;
      const setupWrapper = (header: Element, text: "tosafot" | "rashi") => {
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
        wrapper.addEventListener("click", () => selectCommentary({
          tractate: props.tractate,
          daf: props.daf
        }, index, text));
      }

      document.querySelectorAll(".rashi-header")
        .forEach((header, index) => setupWrapper(header, "rashi"));

      count = 0;
      document.querySelectorAll(".tosafot-header")
        .forEach((firstHeader, index) => setupWrapper(firstHeader, "tosafot"));
    }

    return {
      selectedSentence,
      dafContainer,
      onRendered,
      rendered,
      checkSelectedSentence,
      checkSelectedCommentaries,
    }
  },
  data: () => ({
    page: {} as apiPage,
    windowWidth: window.innerWidth,
    dafWidth: 600,
    dafOfWindow: 4.4 / 12,
  }),
  async mounted() {
    await login();
    this.loadPage();
    loadPage(currentSentenceRange.startDaf.tractate, currentSentenceRange.startDaf.daf);
    loadPage(currentSentenceRange.endDaf.tractate, currentSentenceRange.endDaf.daf);
  },
  computed: {
    texts() {
      if (this.page?.main) {
        const headerRegex = /\{([^\{\}]+)\}/g;
        const hadran = "הדרן עלך"
        const hadranRegex = new RegExp(`<br>[\\w\\s]*${hadran}[\\w\\s]*<br>`, 'g');

        const hadranDiv = (text: "rashi" | "tosafot" | "main", html: string): string =>
          `<div class="hadran"><span class="${sentenceClass[text]}">${html.replace("<br>", "")}</span></div>`

        const mainHTML: string = this.page.main.lines
          .join('<br>')
          .split('|')
          .map(sentenceHTML => {
            if (sentenceHTML.includes(hadran) && sentenceHTML.split(' ').length < 7) {
              return hadranDiv("main", sentenceHTML);
            }
            return `<span class="${sentenceClass.main}">${sentenceHTML}</span>`
          })
          .join(' ')
          .replaceAll(headerRegex, "<b class='main-header'>$1</b>")
        const rashiHTML: string = this.page.rashi
          .replaceAll(headerRegex, "<b class='rashi-header'>$1</b>")
          .split('<br>')
          .map(line => {
            if (line.slice(0, hadran.length) == hadran) {
              return hadranDiv("rashi", line);
            }
            return line;
          })
          .join('<br>')

        const tosafotHTML: string = this.page.tosafot
          .replaceAll("} {", "}{")
          .replaceAll(headerRegex, "<b class='tosafot-header'>$1</b>")
          .split('<br>')
          .map(line => {
            if (line.slice(0, hadran.length) == hadran) {
              return hadranDiv("tosafot", line);
            }
            return line;
          })
          .join('<br>')

        return [mainHTML, rashiHTML, tosafotHTML];
      }
    },
    transformStyles() {
      if (!this.scale || !this.rendered) return;
      const scale: number = (this.windowWidth * this.dafOfWindow) / (this.dafWidth);
      console.log(scale);
      return {
        transform: `scale(${scale})`,
        'transform-origin': 'top left'
      }
    },
    amud() {
      if (this.daf[this.daf.length - 1] == 'b') {
        return 'b';
      }
      return 'a';
    }
  },
  methods: {
    async loadPage() {
      const page = await loadPage(this.tractate, this.daf);
      if (page) {
        this.rendered = false;
        await nextTick();
        this.page = page;
      }
      await nextTick();
      if (selectedSentence.index >= 0) {
        this.checkSelectedSentence();
        this.checkSelectedCommentaries();
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth;
      this.rendered = true;
    },
  },
  watch: {
    tractate(newVal, oldVal) {
      this.loadPage();
    },
    daf(newVal, oldVal) {
      this.loadPage();
    },
  }
})
</script>

<style>
#daf-container div {
  text-align-last: justify !important;
}


div.hadran {
  display: flex;
  justify-content: center;
  font-size: 135%;
  font-family: Vilna;
  transform: translateY(50%);
}

.hadran span {
  display: inline-block;
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

.preload {
  font-family: Vilna;
  opacity: 0;
}

.tosafot-header {
  font-family: Vilna;
  font-size: 135%;
  vertical-align: bottom;
}

.tosafot-header:nth-of-type(odd) {
  font-size: 180%;
  vertical-align: bottom;
}
</style>