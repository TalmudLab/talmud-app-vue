<template>
  <div class="w-full flex flex-row">

    <SentenceBlocksCol :selected-index="selectedIndex" :sentences="sentences"></SentenceBlocksCol>

    <!--TODO: Use CSS grid?-->
    <div class="flex-grow flex flex-col">

      <div v-for="(render, i) in sentences"
         class="flex flex-row h-20 pb-1 border-b-2"
         :class="{'bg-blue-100': selectedIndex == render.renderIndex}"
          @click="sentenceClicked(render)">

        <!--TODO: DRY; make components-->
      <div class="w-16 flex flex-col ml-1 space-y-1">
        <div v-for="rashi in render.sentence.onPage.rashi"
          class="h-4 w-full bg-red-200 border-2 rounded-sm border-red-500">
          <div class="commentary-text">Rashi</div>
        </div>
        <div v-for="rashi in notOnPage(render.sentence, 'rashi')"
             class="h-4 w-full bg-pink-200 border-2 rounded-sm border-pink-500"
             @click="event => connectionClicked(event, rashi)">
          <div class="commentary-text">Rashi</div>
        </div>
      </div>

      <div class="w-16 flex flex-col ml-1">
        <div v-for="tosafot in render.sentence.onPage.tosafot"
             class="h-4 w-full bg-red-200 border-2 rounded-sm border-red-500">
          <div class="commentary-text">Tosafot</div>
        </div>
        <div v-for="tosafot in notOnPage(render.sentence, 'tosafot')"
             class="h-4 w-full bg-pink-200 border-2 rounded-sm border-pink-500"
          @click="event => connectionClicked(event, tosafot)">
          <div class="commentary-text">Tosafot</div>
        </div>
      </div>

      <div v-if="render.sentence.connections" class="w-16 flex flex-col ml-1 space-y-1">
        <div v-for="connection in render.sentence.connections.filter(connection => connection.type == 'tanakh')"
             class="h-4 w-full  bg-purple-200 border-2 rounded-sm border-purple-500 truncate"
             @click="event => connectionClicked(event, connection)"
        >
          <div class="commentary-text">{{connection.author}}</div>
        </div>
      </div>

      <div v-if="render.sentence.connections" class=" w-32 flex flex-col ml-1 space-y-1">
        <div v-for="connection in render.sentence.connections.filter(connection => connection.type == 'traditional')"
             class="h-4 w-full bg-pink-200 border-2 rounded-sm border-pink-500 truncate"
             @click="event => connectionClicked(event, connection)"
        >
          <div class="commentary-text">{{connection.author}}</div>
        </div>
      </div>



      <div v-if="render.sentence.connections" class=" w-16 flex flex-col ml-1 space-y-1">
        <div v-for="connection in render.sentence.connections.filter(connection => connection.type == 'halakhah').slice(0, 4)"
             class="h-4 w-full  bg-pink-200 border-2 rounded-sm border-pink-500 truncate"
             @click="event => connectionClicked(event, connection)"
        >
          <div class="commentary-text">{{connection.author}}</div>
        </div>
      </div>

      <div v-if="render.sentence.connections" class="h-16 w-16 flex flex-col ml-1">
        <div v-for="modern in render.sentence.connections.filter(connection => connection.type == 'modern')"
             class="h-9 w-full  bg-yellow-200 border-2 rounded-sm border-yellow-500"
             @click="event => connectionClicked(event, modern)"
        >
          <div class="commentary-text">{{modern.author}}</div>
        </div>
      </div>
    </div>

    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType, toRaw} from "vue";
import {sentenceRender, sentenceData } from "../../state/types";
import {
  selectSentence,
  selectCommentary,
  selectConnection, clearConnection
} from "../../state/actions";
import SentenceBlocksCol from "./SentenceBlocksCol.vue";
import {selectedConnection} from "../../state/selections";

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
  components: {SentenceBlocksCol},
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
    },
    notOnPage(sentence: sentenceData, type: "rashi" | "tosafot") {
      if (!sentence.connections) return [];
      return sentence.connections.filter(connection => {
        if (connection.type != type) return false;
        const refConvert = (ref: string) => {
          return ref.split(' ').slice(-2).join('.').replaceAll(':', '.');
        }
        if (sentence?.onPage?.[type]?.map(c => c.ref).includes(refConvert(connection.ref))) return false;
        return true;
      })
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