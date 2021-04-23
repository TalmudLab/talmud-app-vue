<template>
  <div class="w-full">
    <div v-for="(render, i) in sentences"
         class="flex flex-row h-15 pb-1"
         :class="{'bg-blue-100': selectedIndex == render.renderIndex}"
          @click="sentenceClicked(render)">
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
          :style="{marginTop: '-2.45rem', height: '4.5rem'}"
          class="w-0.5 bg-gray-400 z-0">
        </div>
        <div
             class="w-2 h-0.5 bg-gray-400 self-center">
        </div>
      </template>
      <div class="h-12 w-16 mt-2 bg-gray-100 border-gray-400 border-2 rounded-sm z-10">

      </div>
      <div class="h-16 w-16 flex flex-col ml-1">
        <div v-for="rashi in render.sentence.onPage.rashi"
             :style="{marginBottom: '1px'}"
          class="h-4 w-full bg-red-200 border-2 rounded-sm border-red-500">
          <div class="commentary-text">Rashi</div>
        </div>
      </div>

      <div class="h-16 w-16 flex flex-col ml-1">
        <div v-for="tosafot in render.sentence.onPage.tosafot"
             class="h-4 w-full bg-red-200 border-2 rounded-sm border-red-500">
          <div class="commentary-text">Tosafot</div>
        </div>
      </div>

      <div class="h-16 w-16">

      </div>

      <div class="h-16 w-16 flex flex-col ml-1">
        <div v-for="modern in render.sentence.connections"
             class="h-9 w-full  bg-yellow-200 border-2 rounded-sm border-yellow-500"
             @click="event => connectionClicked(event, modern)"
        >
          <div class="commentary-text">{{modern.author}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType, toRaw} from "vue";
import {sentenceRender, sentenceData } from "../state/types";
import {
  selectSentence,
  selectCommentary,
  selectConnection, clearConnection
} from "../state/actions";
import {selectedConnection} from "../state/selections";

type node = {
  parent: node | undefined
  index: number, //index in row
  sentenceRender: sentenceRender
  children: Array<node>
}

type row = {
  parentIndex: number | null, //index in its row
  nodes: Array<node>,
  childRows: Array<row>
}


export default defineComponent({
  props: {
    sentences: Array as PropType<Array<sentenceRender>>,
    selectedIndex: Number,
    english: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    sentenceClicked(render: sentenceRender) {
      selectSentence(render.sentence.daf, render.sentence.index);
      clearConnection();
    },
    connectionClicked(event, commentary) {
      selectConnection(commentary);
      event.stopPropagation();
    }
  },
  computed: {
    trees () : Array<node> {
      if (!Array.isArray(this.sentences)) return [];
      const roots: Array<node> = [];
      const makeChildren = (parent: node): Array<node> => {
        const children = [];
        const parentSR: sentenceRender = parent.sentenceRender;
        for (let currIndex = parentSR.renderIndex + 1, curr: sentenceRender | undefined;
             currIndex < this.sentences!.length && (curr = this.sentences!.find(sr => sr.renderIndex == currIndex)) && curr.indent.value > parentSR.indent.value;
             currIndex++) {
          if (curr.indent.value == parentSR.indent.value + 1) {
            const newNode: node = {
              parent,
              index: children.length,
              sentenceRender: curr,
              children: []
            }
            newNode.children = makeChildren(newNode);
            children.push(newNode);
          }
        }
        return children;
      }

      const atRoot = this.sentences.filter(sentence => sentence.indent.value == 0)
      atRoot.forEach( (sentenceRender, index) => {
        const newNode: node = {
          parent: undefined,
          index,
          sentenceRender,
          children: []
        }
        newNode.children = makeChildren(newNode);
        roots.push(newNode)
      })
      return roots;
    },
  }
})

</script>

<style scoped>
.commentary-text {
  margin-top: -0.3rem;
  @apply text-sm
}
</style>