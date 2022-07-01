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
</style>
