import {reactive} from "vue";
import {apiPage} from "../realm";

export function dafId(tractate: string, daf: string) : string {
    return tractate + daf;
}

export const loadedPages = reactive<{[daf: string]: apiPage}>({});