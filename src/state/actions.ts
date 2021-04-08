import {getPage, page} from "../realm";
import {dafId, loadedPages} from "./loaded";
import {currentDaf, currentSentenceRange} from "./current";
import {commentary, daf} from "./types";
import {selectedCommentary, selectedSentence} from "./selections";
import {fromCommentaryRef} from "../utils/refs";
import {dafEquals} from "../utils/compare";

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
    if (currentDaf.daf.includes('b')) {
        currentDaf.daf = "" + (Number(currentDaf.daf.substring(0, currentDaf.daf.length - 1)) + 1);
    } else {
        currentDaf.daf += "b";
    }
    currentSentenceRange.startDaf = currentDaf;
    currentSentenceRange.endDaf = currentDaf;
}

export async function prevDaf() {
    if (currentDaf.daf.includes('b')) {
        currentDaf.daf = currentDaf.daf.substring(0, currentDaf.daf.length - 1);
    } else {
        currentDaf.daf = "" + (Number(currentDaf.daf) - 1) + "b";
    }
    currentSentenceRange.startDaf = currentDaf;
    currentSentenceRange.endDaf = currentDaf;
}

export function selectSentence(daf: daf, index: number) {
    selectedSentence.daf = daf;
    selectedSentence.index = index;
    const pageData = loadedPages[dafId(daf.tractate, daf.daf)];
    if (pageData) {
        const onPage = pageData.main.sentences[index]?.onPage;
        if (onPage) {
            //For now, just select the first connected rashi and tosafot
            if (onPage.rashi?.length) {
                const first = onPage.rashi[0];
                selectedCommentary.text = "rashi";
                selectedCommentary.daf = daf;
                selectedCommentary.index = first.index;
                selectedCommentary.ref = first.ref;
            }
            if (onPage.tosafot?.length) {
                const first = onPage.tosafot[0];
                selectedCommentary.text = "tosafot";
                selectedCommentary.daf = daf;
                selectedCommentary.index = first.index;
                selectedCommentary.ref = first.ref;
            }
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
        }

        selectedCommentary.daf = daf;
        selectedCommentary.text = text;
        selectedCommentary.index = index;
        selectedCommentary.ref = ref;
    }

}
