import {Ref} from "vue";
import {mainSentence} from "../fetch/realm";

export type daf = {
  tractate: string,
  daf: string
}

export type sentenceRange = {
  startDaf: daf
  startIndex: number | undefined,
  endDaf: daf,
  endIndex: number | undefined,
}

export type sentenceData = mainSentence & {
  daf: daf,
  index: number,
}

export type sentenceRender = {
  sentence: sentenceData,
  renderIndex: number,
  indent: Ref<number>,
}

export type indents = {
  [index: number]: number
}

export type connection = {
  title: string,
  author: string,
  type: "modern" | "traditional" | "halakha" | "tanakh" | "rashi" | "tosafot",
  text: string,
  link: string,
  ref?: string,
}

export type commentary = "rashi" | "tosafot";
