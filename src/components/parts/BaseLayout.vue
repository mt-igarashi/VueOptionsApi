<template>
  <Loading :loading="loading" />
  <Modal :daialog="daialog" />
  <header>
    <footer>
      <slot name="header">
        <Menu/>
      </slot>
    </footer>
  </header>
  <div class="container">
    <main role="main">
      <div class="row">
        <div class="col-12">
          <div id="main-content" class="mx-auto main-content" :style="mainStyle">
            <!-- 見出し -->
            <h2 class="header-title">
              <slot name="main-title"></slot>
            </h2>
            <Messages :messages="messages" />
            <slot name="main"></slot>
          </div>
        </div>
      </div>
    </main>
  </div>
  <footer>
    <slot name="footer"></slot>
  </footer>
</template>

<script>
export default {
  name: "BaseLayout",
  props: {
    mainStyle: {
      type: String
    },
    messages: {
      type: Object
    },
    loading: {
      type: Boolean
    },
    daialog: {
      type: Object
    }
  },
  created: function() {
    document.querySelector("body")["background-color"] = "transparent"
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
