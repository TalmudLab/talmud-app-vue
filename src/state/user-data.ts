import {reactive} from "vue";
import {indents} from "./types";
import {dafId} from "../utils/daf";

export const sentenceIndents = reactive<{[dafId: string]: indents}>({});
