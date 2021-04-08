import {reactive} from "vue";
import { daf, commentary } from "./types";

export const selectedSentence = reactive<{ daf: daf, index: number } >({});
//TODO: have multiple
export const selectedCommentaries = reactive<Array<{
  daf: daf,
  text: commentary,
  index: number,
  ref: string,
}>>([]);