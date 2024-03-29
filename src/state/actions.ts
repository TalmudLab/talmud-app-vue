import {getPage, page} from "../fetch/realm";
import {loadedPages} from "./loaded";
import {currentDaf, currentSentenceRange} from "./current";
import {commentary, daf, connection} from "./types";
import {selectedCommentaries, selectedConnection, selectedSentence} from "./selections";
import {fromCommentaryRef} from "../utils/refs";
import {dafEquals, dafId, surrounding} from "../utils/daf";
import {getLinks, linkToConnection, loadText} from "../fetch/sefaria";

export async function loadPage(tractate: string | undefined, daf: string | undefined): Promise<page | undefined> {
  //TODO: Check validity of tractate/daf
  if (tractate && daf) {
    const id = dafId({tractate, daf});
    const alreadyLoaded = loadedPages[id];
    if (alreadyLoaded) {
      return alreadyLoaded;
    }
    try {
      const newlyLoadedPage = await getPage(tractate, daf);

      if (newlyLoadedPage) {
        loadedPages[id] = newlyLoadedPage;
        loadLinks({tractate, daf});
        return newlyLoadedPage
      }
    } catch {
      return null;
    }
  }
}

export async function loadLinks(dafObj: daf) {
  if (dafObj.tractate && dafObj.daf) {
    const page = loadedPages[dafId(dafObj)];
    if (!page) return;
    const links = await getLinks(dafObj);
    links.forEach( (link) => {
      const sentence = page.main.sentences[link.sentenceIndexStart];

      if (sentence) {
        const connection = linkToConnection(link);
        if (Array.isArray(sentence.connections)) {
          sentence.connections.push(connection);
        } else {
          sentence.connections = [connection];
        }
      }
    })
  }
}

export async function nextDaf() {
  const next = surrounding(currentDaf).next;
  currentDaf.daf = next.daf;
  currentDaf.tractate = next.tractate;
  currentSentenceRange.startDaf = currentDaf;
  currentSentenceRange.endDaf = currentDaf;
  currentSentenceRange.startIndex = 0;
}

export async function prevDaf() {
  const prev = surrounding(currentDaf).prev;
  currentDaf.daf = prev.daf;
  currentDaf.tractate = prev.tractate;
  currentSentenceRange.startDaf = currentDaf;
  currentSentenceRange.endDaf = currentDaf;
  currentSentenceRange.startIndex = 0;
}

export async function nextSentences() {
  const increaseBy = 5;
  const next = surrounding(currentSentenceRange.endDaf).next;
  if (currentSentenceRange.endDaf == currentSentenceRange.startDaf) {
    await loadPage(next.tractate, next.daf);
    currentSentenceRange.endDaf = next;
    currentSentenceRange.endIndex = increaseBy - 1;
    return;
  }
  const currEnd = loadedPages[dafId(currentSentenceRange.endDaf)];
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

export function selectConnection(connection: connection) {
  Object.keys(connection).forEach(key => selectedConnection[key] = connection[key]);
  if (!connection.text && connection.ref) {
    loadText(connection.ref).then(result => {
      if (result.he) {
        if (Array.isArray(result.he)) {
          result.he = result.he.join("<br>");
        }
        connection.text = selectedConnection.text = `<div style="direction:rtl">${result.he}</div>`;
      }
    });
  }
}


export function clearConnection() {
  Object.keys(selectedConnection).forEach(key => selectedConnection[key] = undefined);
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
    const ref = loadedPages[dafId(daf)][text + "Refs"][index];

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
