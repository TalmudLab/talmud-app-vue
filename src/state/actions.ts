import {getPage, page} from "../realm";
import {dafId, loadedPages} from "./loaded";
import {currentDaf, currentSentenceRange} from "./current";
import {commentary, daf} from "./types";
import {selectedCommentaries, selectedSentence} from "./selections";
import {fromCommentaryRef} from "../utils/refs";
import {dafEquals, surrounding} from "../utils/daf";

export async function loadPage(tractate: string | undefined, daf: string | undefined): Promise<page | undefined> {
    //TODO: Check validity of tractate/daf
    if (tractate && daf) {
        const id = dafId(tractate, daf);
        const alreadyLoaded = loadedPages[id];
        if (alreadyLoaded) {
            return alreadyLoaded;
        }
        const newlyLoadedPage = await getPage(tractate, daf);
        if (newlyLoadedPage) {
            loadedPages[id] = newlyLoadedPage;
            return newlyLoadedPage
        }
    }
}

export async function nextDaf() {
    const next = surrounding(currentDaf).next;
    currentDaf.daf = next.daf;
    currentDaf.tractate = next.tractate;
    currentSentenceRange.startDaf = currentDaf;
    currentSentenceRange.endDaf = currentDaf;
}

export async function prevDaf() {
    const prev = surrounding(currentDaf).prev;
    currentDaf.daf = prev.daf;
    currentDaf.tractate = prev.tractate;
    currentSentenceRange.startDaf = currentDaf;
    currentSentenceRange.endDaf = currentDaf;
}

export async function nextSentences() {
  debugger;
    const increaseBy = 5;
    const next = surrounding(currentSentenceRange.endDaf).next;
    if (currentSentenceRange.endDaf == currentSentenceRange.startDaf) {
        await loadPage(next.tractate, next.daf);
        currentSentenceRange.endDaf = next;
        currentSentenceRange.endIndex = increaseBy - 1;
        return;
    }
    const currEnd = loadedPages[dafId(currentSentenceRange.endDaf.tractate, currentSentenceRange.endDaf.daf)];
    if (currentSentenceRange.endIndex + increaseBy >= currEnd.main.sentences.length) {
        await loadPage(next.tractate, next.daf);
       currentSentenceRange.endDaf = next;
       currentSentenceRange.endIndex = currentSentenceRange.endIndex + increaseBy - currEnd.main.sentences.length;
       return;
    }
    currentSentenceRange.endIndex += increaseBy;
}


export async function prevSentences() {
    const decreaseBy = 5;
    const prev = surrounding(currentSentenceRange.startDaf).prev;
    const prevData = await loadPage(prev.tractate, prev.daf);
    if (currentSentenceRange.startIndex - decreaseBy < 0) {
        currentSentenceRange.startDaf = prev;
        currentSentenceRange.startIndex = prevData.main.sentences.length + (currentSentenceRange.startIndex - decreaseBy);
        return;
    }
    currentSentenceRange.startIndex -= decreaseBy;
}

export async function selectSentence(daf: daf, index: number) {
    selectedSentence.daf = daf;
    selectedSentence.index = index;
    const pageData = await loadPage(daf.tractate, daf.daf);
    if (!dafEquals(daf, currentDaf)) {
      currentDaf.daf = daf.daf;
      currentDaf.tractate = daf.tractate;
    }
    if (pageData) {
        const onPage = pageData.main.sentences[index]?.onPage;
        if (onPage) {
            //For now, just select the first connected rashi and tosafot
            const newlySelected = [];
            const textNames: Array<commentary> = ["rashi", "tosafot"];
            textNames.forEach(textName => {
                if (onPage[textName]?.length)
                    onPage[textName].forEach(comment => {
                        newlySelected.push({
                            daf,
                            text: textName,
                            index: comment.index,
                            ref: comment.ref
                        })
                    })
            })
            selectedCommentaries.splice(0, selectedCommentaries.length, ...newlySelected);
        }
    }
}
export function selectCommentary(daf: daf, index: number, text: commentary) {
    if (daf.tractate && daf.daf) {
        const ref = loadedPages[dafId(daf.tractate, daf.daf)][text + "Refs"][index];

        const refData = fromCommentaryRef(ref);

        //For now, only select the matching main sentence when it's on the page we're currently on.
        if (dafEquals(refData.daf, currentDaf)) {
            selectedSentence.index = refData.sentenceIndex;
            selectedSentence.daf = currentDaf;
        } else {
            selectedSentence.index = -1;
        }

        selectedCommentaries.splice(0, selectedCommentaries.length, {
            daf, text, index, ref
        });
    }

}
