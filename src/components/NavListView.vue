<template>
  <div ref="container" class="grid grid-cols-1 divide-y divide-gray-400">
    <div v-for="(render, index) in renderList" class="flex"
         :key="render.renderIndex"
         @mouseover="hovered = index"
         @mouseout="hovered = null"
         @click="$emit('selected', { sentence: render.sentence })"
         :class="{'flex-row-reverse': !english}"
    >
      <div class="flex-none flex items-center" :class="{'highlighted': selectedIndex == index, 'flex-row-reverse': !english}">
        <!--          <div :style="indenterStyles(index)"></div>-->
        <div v-for="i in render.indent" class="w-4 h-full"
             :class="[dropClass, {'bg-blue-100': dragging == index}, {'bg-blue-400': dragging == index && draggingOver == i - 1}]"
             :data-indent="i - 1">
        </div>
        <div :ref="setDraggerRefs" class="w-4 cursor-move" :data-index="index">
          <div class="text-xs">
            <span v-show="hovered == index">
            <i class="fas fa-arrows-alt"></i>
            </span>
            <span v-show="hovered != index" class="text-lg">
            •

            </span>
          </div>
        </div>
        <div v-show="dragging == index && index != 0 && render.indent < renderList[index - 1].indent + 1" class="w-4 h-full bg-blue-100"
             :class="[dropClass, {'bg-blue-400': draggingOver == render.indent + 1}]"
             :data-indent="render.indent + 1">
        </div>
      </div>

      <div
        :style="{width: `calc(96% - ${render.indent + (dragging == index)}*1rem)`}">

        <div v-if="expanded.has(index)" class="flex" :class="{'flex-row-reverse': !english}">
          <div class="flex flex-col" :class="{'flex-col-reverse': !english}">
            <div class="text-sm" v-html="render.sentence.en"></div>
            <div class="rtl text-right" v-html="render.sentence.en"></div>
          </div>
          <div class="self-start float-right">
            <a @click="expanded.delete(index)">
              <i class="fas text-xl fa-caret-down"></i>
            </a>
          </div>
        </div>
        <div v-else class="contracted-sentence flex items-center h-8"
             :class="{'flex-row-reverse': !english}">
          <div class="text-sm flex-grow font-semibold truncate" :class="{rtl: !english}" v-html="english ? render.shortEn : render.shortHe">
          </div>
          <a v-show="hovered == index" @click="expanded.add(index)">
            <i class="fas text-xl"  :class="[english ? 'fa-caret-right' : 'fa-caret-left']"></i>
          </a>
        </div>
      </div>
      </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, ref} from "vue";
import {sentenceData, sentenceRender} from "../state/types";
  type renderInfo =  { shortEn: string, shortHe: string, renderIndex: number, indent: number, sentence: sentenceData }
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
      selected(payload: { sentence: sentenceData }) {
        // perform runtime validation
        return true;
      }
    },
    data: () => ({
      hovered: -1,
      draggerRefs: [],
      dragging: -1,
      draggingOver: -1,
      dropClass: "dropzone",
      expanded: new Set(),
    }),
    setup () {
      const container = ref(null);
      return { container };
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
             shortEn: shortenEnglish(sentenceRender.sentence.en),
             shortHe: sentenceRender.sentence.he,
             indent: sentenceRender.indent.value,
             renderIndex: sentenceRender.renderIndex,
             sentence: sentenceRender.sentence
           }));
        }
        return []
      }
    },
    methods: {
      setDraggerRefs(el) {
        if (el) {
          this.draggerRefs.push(el);
          this.configureDrag(el);
        }
      },
      configureDrag(el) {
        // if (this.draggerRefs) {
        //  this.draggerRefs.forEach(el => {
           el.setAttribute("draggable", true);
           el.addEventListener("dragstart", () => {
             console.log("drag start");
             const index = el.dataset.index;
             this.dragging = index;
           })
           el.addEventListener("dragend", () => {
             this.dragging = -1;
             this.draggingOver = -1;
           })
         // })
        // }
      },
      indenterStyles(index) {
        // return {
        //   width: 1 * (this.renderList[index].indent) + "rem"
        // }
      }
    },
    beforeUpdate() {
      this.draggerRefs = []
    },
    mounted () {
      this.container.addEventListener("drop", (event) => {
        event.preventDefault();
        if (event.target.classList.contains(this.dropClass)) {
          console.log("dropping")
          this.sentences[this.dragging].indent.value = this.draggingOver;
          this.draggingOver = -1;
        }
      });
      this.container.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
      this.container.addEventListener("dragenter", (event) => {
        if (event.target.classList.contains(this.dropClass)) {
          this.draggingOver = Number(event.target.dataset.indent);
        }
        event.preventDefault();
      });
      this.container.addEventListener("dragleave", (event) => {
        if (event.target.classList.contains(this.dropClass)) {
          // this.draggingOver = -1;
        }
        event.preventDefault();
      });
    },
    updated() {
    },
  })
</script>

<style scoped>
  .highlighted {
    background-color: #BFDBFE;
  }
  .text-gap {
    @apply text-xs text-gray-500 font-normal
  }
</style>