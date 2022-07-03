<template>
  <template v-if="loading">
    <div class="spinner_box">
        <div class="spinner type1">
            <span>Loading...</span>
        </div>
    </div>
  </template>
  <template v-else>
    <div class="spinner_box loaded">
        <div class="spinner type1">
            <span>Loading...</span>
        </div>
    </div>
  </template>
</template>

<script>
export default {
  name: "Loading",
  props: {
    loading: {
      type: Boolean
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  -webkit-transform-origin: center;
          transform-origin: center;
  width: 120px;
  height: 120px;
}
 
.spinner span {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  font-size: 12px;
}

.spinner.type1 {
  border-radius: 50%;
  border-width: 8px;
  border-style: solid;
  border-color: #fff rgba(255, 255, 255, 0.12) rgba(255, 255, 255, 0.12);
  -webkit-animation: spinner_loading 1.5s infinite linear forwards;
          animation: spinner_loading 1.5s infinite linear forwards;
}

.spinner.type1 span {
  animation: spinner_loading_text 1.5s infinite linear forwards reverse;
}

.spinner_box{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  -webkit-transition: all 1.2s ease;
          transition: all 1.2s ease;
  color: #fff;
  background-color: #333;
}

.spinner_box.loaded{
  animation: spinner_loaded 0.5s 1 linear forwards;
  pointer-events:none;
}
   
@keyframes spinner_loading {
  0% {
    -webkit-transform: translate(-50%, -50%) rotate(0);
            transform: translate(-50%, -50%) rotate(0);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
            transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes spinner_loading_text {
  0% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) rotate(0deg);
            transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    opacity: 0;
    -webkit-transform: translate(-50%, -50%) rotate(180deg);
            transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    opacity: 1;
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
            transform: translate(-50%, -50%) rotate(360deg);
  }
}
   
@keyframes spinner_loaded {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
    visibility:hidden;
  }
}
</style>
