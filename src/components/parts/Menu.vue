<template>
<nav class="navbar navbar-expand-sm navbar-dark bg-primary mb-4">
  <span class="navbar-brand">VueApp</span>
  <button class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="toggleClicked">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav">
      <router-link class="nav-item nav-link active" to="/">ホーム</router-link>
      <router-link class="nav-item nav-link active" :to="{name: 'MovieList', params: {state: 'init', tick: `${Date.now()}`}}">映画一覧</router-link>
      <router-link class="nav-item nav-link active" to="#" @click.prevent="">著者一覧</router-link>
      <a class="nav-item nav-link active" href="#" @click.prevent="">お問い合わせ</a>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "Menu",

  /*
   * 概要: プロパティ
   * (遷移元画面、親コンポーネント、QueryStringなどから受け取る)
   */
  methods: {
    /*
     * 関数概要: メニュー開閉トグルクリック時の処理を行います。
     */
    toggleClicked: function() {
      const elem = document.querySelector("#navbarNavAltMarkup");
      elem.classList.toggle("collapse");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
