<template>
  <div class="flex flex-row w-full h-full pt-2">
    <NavPanel></NavPanel>
    <TextPanel></TextPanel>
    <ConnectionPanel v-if="selectedConnection.author" :connection="selectedConnection"></ConnectionPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import TextPanel from "./components/TextPanel.vue";
import NavPanel from "./components/NavPanel.vue";
import ConnectionPanel from "./components/ConnectionPanel.vue";
import {selectedConnection} from "./state/selections";
import {getLinks} from "./fetch/sefaria";

export default defineComponent({
  name: 'App',
  components: {
    ConnectionPanel,
    NavPanel,
    TextPanel
  },
  setup() {
    return {
      selectedConnection
    }
  },
  async mounted () {
    console.log("mega mounted");
    const data = await getLinks({tractate: "Berakhot", daf: "31"});
    console.log(data);
  }
})
</script>

<style>
  .right {
    margin-left: 700px;
  }
</style>