import {commentary, connection, daf} from "../state/types";
import jsonp from "jsonp";
import {dafToRef} from "../utils/daf";


const commentaryIncludes = {
    "Chidushei Agadot": "traditional",
    "Rashba": "traditional",
    "Ritva": "traditional",
    "Rosh": "traditional",
    "Ramban": "traditional",
    "Rashi": "rashi",
    "Tosafot": "tosafot"
}


type link = {
  daf: daf,
  sentenceIndexStart: number,
  sentenceIndexEnd?: number
  ref: string,
  category: string,
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
    sentenceIndexStart = sentenceIndex;
  }
  return {
    daf,
    sentenceIndexStart,
    sentenceIndexEnd,
    category: linkObj.category,
    ref: linkObj.ref,
    title: linkObj.collectiveTitle
  }
}

function includeLink(link: link): boolean {
  if (link.category == "Tanakh") return true;
  if (link.category == "Halakha") return true;
  if (link.category == "Commentary") {
    if (Object.keys(commentaryIncludes).find(name => link.title.en.includes(name))) {
      return true;
    }
  }
  return false;
}

export function getLinks(daf: daf): Promise<Array<link>> {
  const url = `https://www.sefaria.org/api/related/${dafToRef(daf)}`;

  return new Promise( (resolve, reject) =>
    jsonp(url, null, (err, data) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(data.links.map(obj => parseLink(daf, obj)).filter(includeLink));
      }
    }))

}

export function linkToConnection(link: link): connection {
  let type;
  if (link.category == "Commentary") {
    const key = Object.keys(commentaryIncludes).find(name => link.title.en.includes(name));
    if (key) {
      type = commentaryIncludes[key];
    }
  } else {
    type = link.category.toLowerCase();
  }

  return {
    title: link.title.en,
    author: link.title.en,
    type,
    text: "",
    link: `https://sefaria.org/api/texts/${link.ref}`,
    ref: link.ref
  }
}
