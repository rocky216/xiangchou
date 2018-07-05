<template lang="html">
<div class="">
  <div>121</div>
  <VueVideoPlayer
      class="video-player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
    ></VueVideoPlayer>
</div>
</template>

<script>
import VueVideoPlayer from 'vue-video-player'

export default {
  components:{
    VueVideoPlayer
  },
  data(){
    return {
      playerOptions: {
        // videojs options
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: "video/mp4",
          src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
        }],
        // poster: "/static/images/author.jpg",
      }
    }
  },
  created(){
    console.log(VueVideoPlayer, 66)
  }
}
</script>

<style lang="less" scoped>
</style>



