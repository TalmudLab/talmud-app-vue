<template>
  <div class="w-full">
    {{trees.length}}
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType, toRaw} from "vue";
import {sentence, sentenceRender} from "../state/sentences";

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
  emits: {
    selected(payload: { index: number }) {
      // perform runtime validation
      return payload.index >= 0;
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
             currIndex < this.sentences!.length && (curr = this.sentences!.find(sr => sr.renderIndex == currIndex)) && curr.indent > parentSR.indent;
             currIndex++) {
          if (curr.indent == parentSR.indent + 1) {
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

      const atRoot = this.sentences.filter(sentence => sentence.indent == 0)
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
    }
    // rows(): Array<row> {
    //   if (this.sentences) {
    //     const rows: Array<row> = [];
    //     const atRoot = this.sentences.filter(sentence => sentence.indent == 0)
    //     atRoot.forEach(sentenceRender => {
    //       let parentIndex = null
    //       // if (sentenceRender.renderIndex != 0) {
    //       //   const prev = this.sentences.find(render => render.renderIndex == sentenceRender.renderIndex - 1);
    //       //   if ()
    //       // }
    //
    //       const newNode: node = {
    //         sentenceRender,
    //         index: 0
    //       }
    //       const newRow = {
    //         parentIndex,
    //         nodes: [newNode],
    //         childRows: [],
    //       }
    //       rows.push(newRow);
    //     })
    //
    //     let level = 1;
    //     let atLevel = Array.from(toRaw(this.sentences)).filter(sentence => sentence.indent == level);
    //     while (atLevel.length) {
    //       // atLevel.sort( (a, b) => a.renderIndex - b.renderIndex);
    //       let placed = 0;
    //       let group: Array<sentenceRender> = [];
    //       atLevel.forEach( (sentenceRender, index) => {
    //         if (group.length == 0 || group[group.length - 1].renderIndex == sentenceRender.renderIndex - 1) {
    //           group.push(sentenceRender);
    //           if (index != atLevel.length - 1) {
    //             return;
    //           }
    //         }
    //         //end last group and start new one. end last group:
    //         const firstRenderIndex = group[0].renderIndex;
    //         //find parent row & index within it
    //         const isParent = (node: node) => node.sentenceRender.renderIndex == firstRenderIndex - 1;
    //         const findParentRow = (rows: Array<row>): row | undefined => {
    //           let found = rows.find(row => row.nodes.some(isParent));
    //           if (found)
    //             return found;
    //           rows.forEach( row => {
    //             const found = findParentRow(row.childRows);
    //             if (found) return found;
    //           })
    //         }
    //         const parentRow = findParentRow(rows);
    //         const parentIndex = parentRow.nodes.findIndex(isParent);
    //         //Create a node for each member of the group
    //         const nodes: Array<node> = group.map((sentenceRender, index) => ({
    //           sentenceRender,
    //           index
    //         }));
    //         //Put the nodes in a row
    //         const newRow: row = {
    //           parentIndex,
    //           nodes,
    //           childRows: []
    //         }
    //         //Add the row to its parent
    //         parentRow.childRows.push(newRow);
    //
    //         //start new group
    //         group = [sentenceRender];
    //       })
    //       level++;
    //       atLevel = this.sentences.filter(sentence => sentence.indent == level);
    //       // if (level == 2)
    //       //   debugger;
    //     }
    //     return rows;
    //   }
    //   return []
    // }
  }
})

</script>

<style scoped>

</style>