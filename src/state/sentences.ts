import { reactive, computed, readonly } from "vue";
import { currentDaf} from "./daf";

type sentence = {
  hebrew: string,
  english: string,
  index: number
}

const loadedSentences = reactive<{[daf: string]:  Array<sentence>}>({})
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
  loadedSentences[id] = sentences;
}

export { sentence, currentSentences, addSentences }
