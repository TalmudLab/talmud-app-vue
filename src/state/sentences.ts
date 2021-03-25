import { reactive, computed, readonly } from "vue";
import { currentDaf} from "./daf";
import {comment} from "postcss";

export type sentence = {
  hebrew: string,
  english: string,
  index: number
}

export type sentenceRender = {
  sentence: sentence,
  renderIndex: number,
  indent: number
}

export type commentary = "rashi" | "tosafot";

type commentaryMap = {
  [commentaryIndex: number]: number
}

const loadedSentences = reactive<{[daf: string]: Array<sentenceRender>}>({});

const rashiMaps = reactive<{[daf: string]: commentaryMap}>({});
const tosafotMaps = reactive<{[daf: string]: commentaryMap}>({});
const commentaryMaps = {
  rashi: rashiMaps,
  tosafot: tosafotMaps
}

function dafId(tractate: string, daf: string) : string {
  return tractate + daf;
}

export let selectedSentence = reactive<{ daf: string, tractate: string, index: number } >({});
const currentDafString = computed(() => currentDaf.tractate + currentDaf.daf)
export const selectedCommentary = reactive<{
  daf: string,
  tractate: string,
  text: commentary,
  index: number,
  mainSentenceIndex: number,
}>({});

export const currentSentences = computed(() => {
  if (currentDafString.value && loadedSentences[currentDafString.value]) {
    return loadedSentences[currentDafString.value];
  }
})

export function selectSentence(tractate: string, daf: string, index: number) {
  selectedSentence.tractate = tractate;
  selectedSentence.daf = daf;
  selectedSentence.index = index;
  console.log(selectedSentence.index);
}

export function selectCommentary(tractate: string | undefined, daf: string | undefined, index: number, text: commentary) {
  if (tractate && daf) {
    selectedCommentary.tractate = tractate;
    selectedCommentary.daf = daf;
    selectedCommentary.text = text;
    selectedCommentary.index = index;
    const mainSentenceIndex = commentaryMaps[text]?.[dafId(tractate,daf)]?.[index];
    if (mainSentenceIndex != null) {
      selectedCommentary.mainSentenceIndex = mainSentenceIndex;
      selectSentence(tractate, daf, mainSentenceIndex);
    }
  }

}

export function addSentences(tractate: string, daf: string, sentences: Array<sentence>) {
  const id = dafId(tractate, daf);
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

export function addCommentaryMaps(tractate: string, daf: string, sefariaRashi: Array<Array<String>>, sefariaTosafot: Array<Array<String>>) {
  const id = dafId(tractate, daf);

  const setMap = (mapObj, arr: Array<Array<String>>) => {
    mapObj[id] = {};
    let commentIndex = 0;
    arr.forEach( (comments: Array<String>, mainIndex) => comments.forEach( () => {
      mapObj[id][commentIndex++] = mainIndex;
    }))
  }
  if (sefariaRashi) {
    setMap(rashiMaps, sefariaRashi)
  }
  if (sefariaTosafot) {
    setMap(tosafotMaps, sefariaTosafot)
  }
}


