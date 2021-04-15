<template>
  <div class="w-3/12 h-screen overflow-y-auto mr-2 ml-3">
    <div class="
     flex flex-row items-center
     w-full px-2 h-9
     bg-yellow-200 rounded-t-md">

      <h1 class="font-serif flex-grow text-center text-lg">Connections: {{connection.author}}</h1>
    </div>
    <div class="text-center">
      <h2 class="font-bold inline-block" v-html="connection.title"></h2>
      <a class="underline ml-2 text-blue-500" :href="connection.link">(link)</a>
    </div>
    <div v-html="connection.text"></div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, PropType} from "vue";
  import {connection} from "../state/types";

  export default defineComponent({
    props: {
      connection: Object as PropType<connection>
    }
  })
</script>

<style scoped>

</style>