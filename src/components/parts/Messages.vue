<template>
  <div v-if="messages && messages.errors && messages.errors.length > 0" id="error" class="alert alert-danger" role="alert">
  <template v-for="error in messages.errors" :key="error">
    <div id="msg">{{error}}</div>
  </template>
  </div>
  <div v-if="messages && messages.messages && messages.messages.length > 0" id="message" class="alert alert-success" role="alert">
  <template v-for="message in messages.messages" :key="message">
    <div id="msg">{{message}}</div>
  </template>
  </div>
</template>

<script>
export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "Messages",
  
  /*
   * 概要: プロパティ
   * (遷移元画面、親コンポーネント、QueryStringなどから受け取る)
   */
  props: {
    // メッセージ
    messages: {
      type: Object
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#msg {
  font: bold;
}
</style>
