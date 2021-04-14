import {reactive} from "vue";
import {daf, commentary, connection} from "./types";

export const selectedSentence = reactive<{ daf: daf, index: number } >({});

export const selectedCommentaries = reactive<Array<{
  daf: daf,
  text: commentary,
  index: number,
  ref: string,
}>>([]);

export const selectedConnection = reactive<connection>({});
