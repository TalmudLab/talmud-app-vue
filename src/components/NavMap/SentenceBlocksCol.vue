<template>
  <div class="h-full w-max">
    <div v-for="(render, i) in sentences"
         class="flex flex-row h-20 pb-1 border-b-2"
         :class="{'bg-blue-100': selectedIndex == render.renderIndex}"
         @click="$emit('sentenceClicked', render)">

      <template v-if="render.indent.value > 1">
        <div v-for="i in render.indent.value - 1"
             class="w-4">
        </div>
      </template>

      <template v-if="render.indent.value">
        <div
          class="w-2">
        </div>
        <div
          :style="{marginTop: '-2.6rem', height: '5rem'}"
          class="w-0.5 bg-gray-400 z-0">
        </div>
        <div
          class="w-2 h-0.5 bg-gray-400 self-center">
        </div>
      </template>

      <div class="h-12 w-16 self-center bg-gray-100 border-gray-400 border-2 rounded-sm z-10">

      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import {sentenceRender} from "../../state/types";

export default defineComponent({
  emits: ['sentenceClicked'],
  props: {
    sentences: Array as PropType<Array<sentenceRender>>,
    selectedIndex: Number,
  }
})
</script>

<style scoped>

</style>