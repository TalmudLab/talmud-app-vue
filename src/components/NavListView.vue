<template>
  <div class="grid grid-cols-1 divide-y divide-gray-400">
    <div v-for="render in renderList" class="">
      <div class="text-sm" v-html="render.sentence.english"></div>
      <div class="rtl text-right" v-html="render.sentence.hebrew"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, PropType} from "vue";
  import {sentence, sentenceRender} from "../state/sentences";
  export default defineComponent({
    props: {
      sentences: Array as PropType<Array<sentenceRender>>,
      english: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      renderList () {
        if (this.sentences) {
          const list: Array<sentenceRender> = Array.from(this.sentences).sort( (a: sentenceRender, b: sentenceRender) => a.renderIndex - b.renderIndex);
          return list;
        }
      }
    }
  })
</script>

<style scoped>

</style>