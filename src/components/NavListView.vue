<template>
  <div>
    <ol>
      <ul></ul>
    </ol>
  </div>
</template>

<script lang="ts">
  import {defineComponent, PropType} from "vue";
  import {sentence} from "../state/sentences";
  export default defineComponent({
    props: {
      sentences: Array as PropType<Array<sentence>>
    },
    setup(props) {

    }
  })
</script>

<style scoped>

</style>