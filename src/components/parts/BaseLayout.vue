<template>
  <!-- ローディング -->
  <Loading :loading="loading" />
  <!-- ダイアログ -->
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
            <!-- メッセージ -->
            <Messages :messages="messages" />
            <!-- コンポーネントメイン表示部 -->
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
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "BaseLayout",
  
  /*
   * 概要: プロパティ
   * (遷移元画面、親コンポーネント、QueryStringなどから受け取る)
   */
  props: {
    // メインスタイル
    mainStyle: {
      type: String
    },

    // メッセージ
    messages: {
      type: Object
    },

    // ローディング中フラグ
    loading: {
      type: Boolean
    },

    // ダイアログ表示用パラメータ
    daialog: {
      type: Object
    }
  },

  /*
   * 関数概要: インスタンス生成、および、データ初期化後処理
   */
  created: function() {
    document.querySelector("body").style["background-color"] = "transparent"
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
