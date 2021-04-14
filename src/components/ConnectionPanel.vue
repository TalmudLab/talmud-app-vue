<template>
  <div class="w-3/12 h-screen overflow-y-auto mr-2 ml-3">
    <div class="
     flex flex-row items-center
     w-full px-2 h-9
     bg-yellow-200 rounded-t-md">

      <h1 class="font-serif flex-grow text-center text-lg">Connections: {{connection.author}}</h1>

    </div>
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