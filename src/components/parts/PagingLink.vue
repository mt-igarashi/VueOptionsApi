<template>
  <div v-if="total > 0" class="nav-links">
    <a v-if="prevPegeSize > 0 && prevPegeSize < total" class="prev page-numbers" href="#" @click.prevent="reloadPage(pageNumber - 1, pageSize)">«</a>
    <a v-else class="prev page-numbers" href="#" @click.prevent="">«</a>
    <template v-for="status in totalPage" :key="status.id">
      <span v-if="status.number == pageNumber" class="page-numbers current">{{status.number + 1}}</span>
      <a v-else class="page-numbers" href="#" @click.prevent="reloadPage(status.number, pageSize)">{{status.number + 1}}</a>
    </template>
    <a v-if="nextPegeSize < total" class="page-numbers" href="#" @click.prevent="reloadPage(pageNumber + 1, pageSize)">»</a>
    <a v-else class="next page-numbers" href="#" @click.prevent="">»</a>
  </div>
</template>

<script>
export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "PagingLink",
  
  /*
   * 概要: プロパティ
   * (遷移元画面、親コンポーネント、QueryStringなどから受け取る)
   */
  props: {
    // ページ数
    pageNumber: {
      required: true,
      type: Number
    },

    // ページサイズ
    pageSize: {
      required: true,
      type: Number
    },

    // 合計件数
    total: {
      required: true,
      type: Number
    },

    // 遷移先
    name: {
      required: true,
      type: String
    },

    // 遷移先パラメータ
    linkparams: {
      type: Object
    }
  },

  /*
   * 概要: 算出プロパティ(キャッシュされるので変更不可。ただしリアクティブデータは変更されると再計算される)
   *       リアクティブデータであるかVueが判断できない場合の更新を防ぐため
   *       値が変わらない場合はできるだけこちらを使う
   */
  computed: {
    /*
     * 関数概要: 合計ページ数を返却します。
     */
    totalPage: function() {
      let count = Math.ceil(this.total / this.pageSize);
      let result = [];
      for (let i = 0; i < count; i++) {
        result.push({number: i, id: i.toString()});
      }
      return result;
    },

    /*
     * 関数概要: 前ページまでの合計ページサイズを返却します。
     */
    prevPegeSize: function() {
      return ((this.pageNumber - 1) * this.pageSize) + this.pageSize;
    },

    /*
     * 関数概要: 次ページまでの合計ページサイズを返却します。
     */
    nextPegeSize: function() {
      return (this.pageNumber * this.pageSize) + this.pageSize;
    }
  },

  /*
   * 概要: メソッドプロパティ
   * (値が動的に変わる場合は、算出プロパティではなくメソッドを使う)
   */
  methods: {
    /*
     * 関数概要: ページを再読み込みします。
     * 引数：page ページ数、size ページサイズ
     */
    reloadPage: function(page, size) {
      let params = this.linkparams ?? {};
      this.$router.push({name: this.name, params: params, query: {pageNumber: page, pageSize: size}});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-links{
  margin-top: 4px;
  padding: 1px;
  display: flex;
  justify-content: center;
  background: #f3f3f3;
}
a,span{
  width: 50px;
  height: 50px;
  margin: 2px;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  background: #fff;
  color: #222;
  transition: .3s;
}
a:hover{
  background: gold;
  border-radius: 100%;
  transform: rotate(360deg);
}
.current{
  background: gold;
  border-radius: 100%;
}
.dots{
  background: none;
}
</style>
