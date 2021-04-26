import {computed, reactive, toRef} from "vue";
import {loadedPages} from "./loaded";
import {daf, sentenceData, sentenceRange, sentenceRender} from "./types";
import {sentenceIndents} from "./user-data";
import {dafEquals, dafId, dafsBetween} from "../utils/daf";
import {loadPage} from "./actions";

//TODO: only expose get/set, set should have validation
export const currentDaf = reactive<daf>({
  tractate: "Berakhot",
  daf: "31"
});

export const currentDafData = computed(() => {
  const id = dafId(currentDaf);
  if (loadedPages[id]) {
    return loadedPages[id];
  } else {
    return false;
  }
});

/*Note: there should never be a case where we want to share only a portion of a single page, so
startDaf = endDaf should really only happen when startIndex = 0. Regardless, if startDaf = endDaf, endIndex will
be ignored.
 */
export const currentSentenceRange = reactive<sentenceRange>({
  startIndex: 20,
  startDaf: {tractate: "Berakhot", daf: "31"},
  endDaf: {tractate: "Berakhot", daf: "31b"},
  endIndex: 12
} as sentenceRange);


//TODO: refactor. there's a lot of duplicate code here
export const currentSentenceRenders = computed<Array<sentenceRender>>( () => {
  let {startDaf, endDaf, startIndex, endIndex} = currentSentenceRange;
  if (startDaf && endDaf) {
    const startDafId = dafId(startDaf);
    const endDafId = dafId(endDaf);
    const startDafData = loadedPages[startDafId];
    const endDafData = loadedPages[endDafId];
    if (!startDafData || !endDafData)
      return [];

    startIndex = startIndex || 0;
    const startDafSentences = startDafData.main.sentences.slice(startIndex);

    const startSentenceData: Array<sentenceData> = startDafSentences.map( (sentence, i) => Object.assign({}, sentence, {
      index: startIndex + i,
      daf: startDaf
    }));

    if (!sentenceIndents[startDafId]) {
      sentenceIndents[startDafId] = {};
    }


    let renderCount = 0;
    const sentenceRenders = (sentenceDataArray: Array<sentenceData>, dafId: string): Array<sentenceRender> => sentenceDataArray.map( (sentenceData) => {
      let indent = toRef(sentenceIndents[dafId], sentenceData.index);
      if (indent.value == undefined) {
        sentenceIndents[dafId][sentenceData.index] = 0;
        indent = toRef(sentenceIndents[dafId], sentenceData.index);
      }
      return {
        sentence: sentenceData,
        indent,
        renderIndex: renderCount++
      }
    })
    const startSentenceRenders = sentenceRenders(startSentenceData, startDafId);

    if (dafEquals(startDaf, endDaf)) {
      return startSentenceRenders;
    }

    const toReturn = [...startSentenceRenders];

    for (const daf of dafsBetween(startDaf, endDaf)) {
      const id = dafId(daf);
      const data = loadedPages[id]
      if (!data) {
        /*
          throw an exception? this shouldn't ever happen, as we already checked whether endDaf is loaded,
          so this would imply that there's a gap in the middle
         */
        break;
      }
      const sentences = data.main.sentences;
      const sentenceData = sentences.map( (sentence, index) => Object.assign({}, sentence, {
        index,
        daf
      }))

      if (!sentenceIndents[id]) {
        sentenceIndents[id] = {};
      }
      toReturn.push(...sentenceRenders(sentenceData, id))
    }

    const endDafSentences = endIndex == undefined ? endDafData.main.sentences : endDafData.main.sentences.slice(0, endIndex);

    const endSentenceData: Array<sentenceData> = endDafSentences.map( (sentence, i) => Object.assign({}, sentence, {
      index: i,
      daf: endDaf
    }));

    if (!sentenceIndents[endDafId]) {
      sentenceIndents[endDafId] = {};
    }

    const endSentenceRenders = sentenceRenders(endSentenceData, endDafId);
    toReturn.push(...endSentenceRenders);
    return toReturn;
  }
  return [];
})

// export const currentSentenceRenders = computed<Array<sentenceRender>>( () => {
//   const dataArr = currentSentencesData.value;
//   if (dataArr.length) {
//
//   }
// })