import {dafId} from "./loaded";
import {reactive} from "vue";
import {indents} from "./types";

export const sentenceIndents = reactive<{[dafId: string]: indents}>({});
