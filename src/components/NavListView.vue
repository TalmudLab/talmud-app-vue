<template>
  <div class="grid grid-cols-1 divide-y divide-gray-400">
    <div v-for="(render, index) in renderList" class="" @mousedown="$emit('selected', { index })">
      <template v-if="selectedIndex == index">
        <div class="text-sm" v-html="render.sentence.english"></div>
        <div class="rtl text-right" v-html="render.sentence.hebrew"></div>
      </template>
      <div v-else class="text-sm font-semibold" v-html="english ? render.shortEn : render.shortHe">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, PropType} from "vue";
  import {sentence, sentenceRender} from "../state/sentences";
  type renderInfo = sentenceRender | { shortEn: string, shortHe: string }
  export default defineComponent({
    props: {
      sentences: Array as PropType<Array<sentenceRender>>,
      selectedIndex: Number,
      english: {
        type: Boolean,
        default: true
      },
    },
    emits: {
      selected(payload: { index: number }) {
        // perform runtime validation
        return payload.index >= 0;
      }
    },
    computed: {
      renderList (): Array<renderInfo> {
        if (this.sentences) {
          const shortenEnglish = (en: string) => {
            return Array.from(en.matchAll(/<b>([^<>]+)<\/b>/g))
              .map(match => match[1])
              .join("<span class='text-gap'> - </span>")
          }
          return Array.from(this.sentences)
           .sort( (a: sentenceRender, b: sentenceRender) => a.renderIndex - b.renderIndex)
           .map(sentenceRender => ({
             shortEn: shortenEnglish(sentenceRender.sentence.english),
             shortHe: sentenceRender.sentence.hebrew,
             ...sentenceRender
           }));
        }
        return []
      }
    },
  })
</script>

<style>
  .text-gap {
    @apply text-xs text-gray-500 font-normal
  }
</style>