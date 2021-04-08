import {getPage, page} from "../realm";
import {dafId, loadedPages} from "./loaded";
import {currentDaf, currentSentenceRange} from "./current";
import {commentary, daf} from "./types";
import {selectedCommentaries, selectedSentence} from "./selections";
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
