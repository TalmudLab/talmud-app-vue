<template>
  <DafView :tractate="'Berakhot'" :daf="daf"></DafView>
  <input v-model="daf">
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import DafView from "./components/DafView.vue";
import {login, getPage, page} from "./realm";
export default defineComponent({
  name: 'App',
  components: {
    DafView
  },
  data: () => ({
    daf: "2b",
  })
})
</script>

<style>
  input {
    margin-left: 700px
  }
</style>