<template lang="html">
<div class="">
  <h1>Vue-Emoji</h1>
    <div contenteditable="" ref = 'edit' focus></div>
    <button ref = 'btn' @click = 'showEmoji = !showEmoji'>emoji</button>
    <VueEmoji
      v-show = 'showEmoji'
      ref = 'emoji'
      @select = 'showEmoji = false'
      @hide = 'handleHide'
    ></VueEmoji>
</div>
</template>

<script>
import VueEmoji from "vue-emoji-component"

export default {
  components:{
    VueEmoji
  },
  data(){
    return {
      showEmoji : false
    }
  },
  mounted () {
    this.$refs.emoji.appendTo({
      area: this.$refs.edit,
      btn: this.$refs.btn,
      position: 'bottom left'
    });
  },
  methods: {
    hide () {
      this.showEmoji = false;
    },
    handleHide (e) {
      if (e.target === this.$refs.btn) return;
      this.hide();
    }
  }
}
</script>

<style lang="less" scoped>
</style>
