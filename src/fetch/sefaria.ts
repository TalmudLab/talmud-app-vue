import { daf} from "../state/types";
import jsonp from "jsonp";
import {dafToRef} from "../utils/daf";

type link = {
  daf: daf,
  sentenceIndexStart: number,
  sentenceIndexEnd?: number
  ref: string,
  title: {
    en: string,
    he: string
  }
}

function parseLink(daf: daf, linkObj): link  {
  const sentenceIndex = linkObj.anchorRef.split(':')[1];
  let sentenceIndexStart, sentenceIndexEnd;
  if (sentenceIndex.includes('-')) {
    const indices = sentenceIndex.split('-');
    sentenceIndexStart = indices[0];
    sentenceIndexEnd = indices[1];
  } else {
    sentenceIndexEnd = sentenceIndex;
  }
  return {
    daf,
    sentenceIndexStart,
    sentenceIndexEnd,
    ref: linkObj.ref,
    title: linkObj.collectiveTitle
  }
}

export function getLinks(daf: daf) {
  const url = `https://www.sefaria.org/api/related/${dafToRef(daf)}`;

  return new Promise( (resolve, reject) =>
    jsonp(url, null, (err, data) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(data.links.map(obj => parseLink(daf, obj)));
      }
    }))

}