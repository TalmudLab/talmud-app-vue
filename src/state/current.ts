import {computed, reactive, toRef} from "vue";
import {dafId, loadedPages} from "./loaded";
import {daf, sentenceData, sentenceRange, sentenceRender} from "./types";
import {sentenceIndents} from "./user-data";

//TODO: only expose get/set, set should have validation
export const currentDaf = reactive<daf>({
  tractate: "Berakhot",
  daf: "31b"
});

export const currentDafData = computed(() => {
  const id = dafId(currentDaf.tractate, currentDaf.daf);
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
export const currentSentenceRange = reactive<sentenceRange>({});


export const currentSentenceRenders = computed<Array<sentenceRender>>( () => {
  let {startDaf, endDaf, startIndex, endIndex} = currentSentenceRange;
  if (startDaf && endDaf) {
    const startDafId = dafId(startDaf.tractate, startDaf.daf);
    const endDafId = dafId(endDaf.tractate, endDaf.daf);
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
      if (!indent) {
        sentenceIndents[startDafId][sentenceData.index] = 1;
        indent = toRef(sentenceIndents[dafId], sentenceData.index);
      }
      return {
        sentence: sentenceData,
        indent,
        renderIndex: renderCount++
      }
    })
    const startSentenceRenders = sentenceRenders(startSentenceData, startDafId);

    if (endDaf == startDaf) {
      return startSentenceRenders;
    }

    const endDafSentences = endIndex == undefined ? endDafData.main.sentences : endDafData.main.sentences.slice(0, endIndex);

    const endSentenceData: Array<sentenceData> = endDafSentences.map( (sentence, i) => ({
      he: sentence.he,
      en: sentence.en,
      onPage: sentence.onPage,
      index: i,
      daf: endDaf,
    }));

    if (!sentenceIndents[endDafId]) {
      sentenceIndents[endDafId] = {};
    }

    const endSentenceRenders = sentenceRenders(endSentenceData, endDafId);
    return startSentenceRenders.concat(endSentenceRenders);
  }
  return [];
})

// export const currentSentenceRenders = computed<Array<sentenceRender>>( () => {
//   const dataArr = currentSentencesData.value;
//   if (dataArr.length) {
//
//   }
// })