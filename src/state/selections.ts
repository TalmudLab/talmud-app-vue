import {reactive} from "vue";
import { daf } from "./types";
import {commentary} from "./sentences";

export const selectedSentence = reactive<{ daf: daf, index: number } >({});
export const selectedCommentary = reactive<{
  daf: daf,
  text: commentary,
  index: number,
  ref: string,
}>({});