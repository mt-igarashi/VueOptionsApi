<template>
  <div class="row">
    <div class="col-8">
      <span :class="classtag" :style="style" :data-message="message">
        <img alt="説明" width="20" height="20" src="../../assets/small_question.png">
      </span>
    </div>
    <div class="col-4"></div>
  </div>
</template>

<script>
export default {
  name: "Question",
  props: {
    message: {
      required: true,
      type: String,
      default: ""
    },
    css: {
      type: String,
      default: ""
    },
    style: {
      type: String,
      default: ""
    }
  },
  computed: {
    classtag: function() {
      return [this.css, "question-tooltip"];
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.question-tooltip {
  position: relative;
}

.question-tooltip:hover:after {
  content: attr(data-message);
  position: absolute;
  color: #721c24;
  font-weight: lighter;
  background-color: oldlace;
  padding: 4px 5px;
  bottom: 0; right: 0;
  transform: translate(100%, 100%);
  border-radius: 5px 5px 5px 5px;
  white-space: pre;
  z-index: 3;
}
</style>
