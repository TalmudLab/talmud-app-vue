<template>
  <div class="daf" ref="daf"></div>
</template>

<script lang="ts">
  import renderFactory, { dafRenderer } from "daf-renderer";
  import {defineComponent, ref, onMounted, PropType, watch, toRef} from "vue";

  export default defineComponent({
    props: {
      texts: {
        type: Array as PropType<Array<string>>
      },
      amud: {
        type: String as PropType<"a" | "b">,
        default: "a"
      }
    },
    emits: ['rendered', 'resized'],
    setup (props, { attrs, slots, emit}) {
      const daf = ref(null);
      let renderer : dafRenderer;

      const renderPropsTexts = () => {
        if (props.texts?.length) {
          const [main, rashi, tosafot] : Array<string> = props.texts;
          renderer.render(main, rashi, tosafot, props.amud, "br", () => emit("rendered"), () => emit("resized"));
        }
      }

      onMounted(() => {
          renderer = renderFactory(daf.value, {
            contentWidth: "650px",
            fontSize: {
              side: "10.5px"
            },
            padding: {
              vertical: "10px"
            },
            lineHeight: {
              main: "16px"
            },
            mainWidth: "42%",
            lineBreaks: "br"
          });
          renderPropsTexts();
      });

      watch(toRef(props, "texts"), (newArr, oldArr) => {
        renderPropsTexts();
      });

      return {
        daf
      }
    },
  })
</script>

<style scoped>

  div {
    text-align-last: justify;
  }
  @font-face {
    font-family: Vilna;
    src: url(../assets/fonts/Mekorot-Vilna.ttf);
  }
  @font-face {
    font-family: Vilna;
    src: url(../assets/fonts/Mekorot-Vilna-Bold.ttf);
    font-weight: bold;
  }
  @font-face{
    font-family: Rashi;
    src: url(../assets/fonts/Mekorot-Rashi.ttf);
  }
</style>