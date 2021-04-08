import { daf } from "../state/types"
type commentaryRefData = {
  daf: daf,
  sentenceIndex: number,
  commentIndex: number,
}
export function fromCommentaryRef (ref: string): commentaryRefData{
  const split = ref.split(".");
  if (split.length !== 4) {
    throw new Error("Ref must be in correct form e.g. Berakhot.31a.10.2");
  }
  const tractate = split[0];
  const daf = split[1].replace("a", "");
  const sentenceIndex = parseInt(split[2]) - 1;
  const commentIndex = parseInt(split[3]) - 1;
  return {
    daf: {tractate, daf},
    sentenceIndex,
    commentIndex
  }
}