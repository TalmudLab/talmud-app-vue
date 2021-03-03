import { reactive, computed, readonly } from "vue";
import { currentDaf} from "./daf";

type sentence = {
  hebrew: string,
  english: string,
  index: number
}

type sentenceRender = {
  sentence: sentence,
  renderIndex: number,
  indent: number
}

const loadedSentences = reactive<{[daf: string]: Array<sentenceRender>}>({})
let selectedSentence: { dafId: string, index: number };
const currentDafString = computed(() => currentDaf.tractate + currentDaf.daf)

const currentSentences = computed(() => {
  if (currentDafString.value && loadedSentences[currentDafString.value]) {
    return loadedSentences[currentDafString.value];
  }
})



function addSentences(tractate: string, daf: string, sentences: Array<sentence>) {
  const id = tractate + daf;
  if (loadedSentences[id]) {
    console.error("Tried to add sentences for a daf that was already loaded");
    return false;
  }
  loadedSentences[id] = sentences.map ( (curr: sentence, index) => ({
    sentence: {
      english: curr.english,
      hebrew: curr.hebrew.replaceAll("<br>", " "),
      index
    },
    renderIndex: index,
    indent: 0
  }));
}

export { sentence, sentenceRender, currentSentences, addSentences }
