<template>
  <BaseLayout :mainStyle="mainStyle" :messages="messages" :loading="loading" :daialog="daialog">
    <template #main-title>映画一覧</template>
    <template #main>
      <!-- 検索条件 -->
      <div class="row mt-4">
        <div class="col-12">
          <table class="condition">
            <tbody>
              <tr>
                <th class="title">
                  ジャンル
                </th>
                <td class="description">
                  <select class="select" v-model="genre" aria-labelledby="genre">
                    <option value="">全て</option>
                    <option v-for="gen in genres" :value="gen" :key="gen">{{gen}}</option>
                  </select>              
                </td>
              </tr>
              <tr>
                <th class="title">
                  タイトル
                </th>
                <td class="description">
                  <input v-model="searchString">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-12 search-button">
          <input class="btn btn-primary float-right mt-3" type="button" value="検索" @click.prevent="reload(true)"/>
          <input class="btn btn-primary float-right mt-3" id="reload" style="display:none" type="button" value="リロード" @click.prevent="reload()"/>
        </div>
      </div>

      <!-- リンク -->
      <div class="row">
        <div class="col-12 mt-4">
          <input class="btn btn-primary float-left mb-2" type="button" value="一覧印刷" @click.prevent="print"/>
          <router-link class="float-right" :to="{name: 'MovieCreate'}">新規作成</router-link>
        </div>
      </div>

      <!-- 一覧 -->
      <div class="row">
        <div class="col-12">
          <GridTable :columns="this.columns"
                     :items="movies"
                     :tableStyle="tableStyle"
                     @header-click="headerclick"
                     @row-click="rowclick"
                     @cell-click="cellclick"
                     @header-check-click="headercheckclick"
                     @check-click="checkclick"
                     @header-button-click="headerbuttonclick"
                     @button-click="buttonclick"
                     @link-click="linkclick" 
                     :validator="validator" />
          <PagingLink name="MovieList" :total="total" :pageNumber="instance.pageNumber()" :pageSize="instance.pageSize()" :linkparams="linkparams" />
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script>
import moviesearch from '../js/moviesearch'

export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "MovieList",
  
  /*
   * 概要: コンポーネントプロパティ
   * (対象コンポーネントがグローバル登録されていない場合に使う)
   */
  components: {
  },
  
  /*
   * 概要: プロパティ
   * (遷移元画面、親コンポーネント、QueryStringなどから受け取る)
   */
  props: {
    // 状態(検索条件復元判定)
    state: {
      type: String
    },
    
    // VueRouterのbeforeRouteUpdateイベントトリガーとなる文字列
    // (再検索、子ウィンドウから画面を更新する際に利用)
    tick: {
      type: String
    }
  },
  
  /*
   * 概要: データプロパティ
   * (リアクティブデータ。変更がUIに即時反映される)
   */
  data: function() {
    return {
      genre: "",         // 検索条件：ジャンル
      searchString: "",  // 検索条件：タイトル
      genres: [],        // ジャンルドロップダウン
      movies: [],        // 映画一覧
      total: 0,          // 総件数(ページング用)
      messages: {},      // メッセージリスト
      loading: false,    // ローディング表示フラグ
      window: null,      // 映画編集画面用Windowオブジェクト
      daialog: {}        // ダイアログパラメータ
    }
  },
  
  /*
   * 概要: 算出プロパティ(キャッシュされるので変更不可)
   *       リアクティブデータであるかVueが判断できない場合の更新を防ぐため
   *       値が変わらない場合はできるだけこちらを使う
   */
  computed: {
    /*
     * 関数概要: ロジッククラスのインスタンスを返却します。
     */
    instance: function() {
      return new moviesearch(this);
    },
    
    /*
     * 関数概要: Utilsクラスのインスタンスを返却します。
     */
    utils: function() {
      return this.instance.getUtils;
    },
    
    /*
     * 関数概要: Constantsクラスのインスタンスを返却します。
     */
    constants: function() {
      return this.instance.getConstants;
    },

    /*
     * 関数概要: Validatorクラスのインスタンスを返却します。
     */
    validator: function() {
      return this.instance.getValidator;
    },
    
    /*
     * 関数概要: メイン要素のスタイルを返却します。
     */
    mainStyle: function() {
      return this.constants.LargeMainStyle;
    },
    
    /*
     * 関数概要: GridTableのスタイルを返却します。
     */
    tableStyle: function() {
      return "max-height:312px;";
    },
    
    /*
     * 関数概要: グリッドのカラム定義を返却します。
     */
    columns: function() {
      return this.instance.columns();
    },

    /*
     * 関数概要: ページングのリンクパラメータを返却します。
     */
    linkparams: function() {
      return {state: "recovery"};
    }
  },
  
  /*
   * 概要: メソッドプロパティ
   * (値が動的に変わる場合は、算出プロパティではなくメソッドを使う)
   */
  methods: {
    /*
     * 関数概要: 初期化処理を行います。
     * 引数：to 遷移先オブジェクト
     */
    init: async function(to) {
      await this.instance.init(to);
    },
    
    /*
     * 関数概要: 画面をリロードします。
     * 引数：init 初期化フラグ
     */
    reload: function(init = false) {
      this.instance.reload(init);
    },
    
    /*
     * 関数概要: 検索処理を行います。
     */
    search: async function() {
      await this.instance.search();
    },

    /*
     * 関数概要: 検索処理を行います。
     */
    print: async function() {
      if (!this.validator.validate()) {
        return;
      }

      this.daialog = {
        title: this.constants.InfoTitle,
        message: "帳票出力に成功しました",
        ok: null,
        cancel: null,
        show: true,
        type: this.constants.DaialogOk
      };
    },
    
    /*
     * 関数概要: 一覧行のボタン押下時の処理
     */
    buttonclick: function(event, item, value, rowindex, colindex) {
      this.utils.console("buttonclick", event, item, value, rowindex, colindex);
      if (value == "詳細") {
        this.instance.moveDetail(item, value);
      }
      
      if (value == "削除") {
        this.daialog = {
          title: this.constants.DeleteConfirmTitle,
          message: this.constants.DeleteConfirmMessage,
          ok: async () => { await this.instance.delete(item); },
          cancel: null,
          show: true
        };
      }
    },
    
    /*
     * 関数概要: 一覧行のリンク押下時の処理
     */
    linkclick: function(event, item, rowindex, colindex) {
      this.utils.console("linkclick", event, item, rowindex, colindex);
      this.instance.openEdit(item);
    },
    
    ///////////////////////////////////
    //
    // イベント確認用
    //
    ///////////////////////////////////
    
    /*
     * 関数概要: 一覧のヘッダー押下時の処理
     */
    headerclick: function(event, items, colindex) {
      this.utils.console("headerclick", event, items, colindex);
    },
    
    /*
     * 関数概要: 一覧の行押下時の処理
     */
    rowclick: function(event, item, rowindex) {
      this.utils.console("rowclick", event, item, rowindex);
    },
    
    /*
     * 関数概要: 一覧行のセル押下時の処理
     */
    cellclick: function(event, item, rowindex, colindex) {
      this.utils.console("cellclick", event, item, rowindex, colindex);
    },
    
    /*
     * 関数概要: 一覧ヘッダーのチェックボックス押下時の処理
     */
    headercheckclick: function(event, checked, item, rowindex) {
      this.utils.console("headercheckclick", event, checked, item, rowindex);
    },
    
    /*
     * 関数概要: 一覧行のチェックボックス押下時の処理
     */
    checkclick: function(event, checked, item, rowindex, colindex) {
      this.utils.console("checkclick", event, checked, item, rowindex, colindex);
    },
    
    /*
     * 関数概要: 一覧ヘッダーのボタン押下時の処理
     */
    headerbuttonclick: function(event, item, value, rowindex) {
      this.utils.console("headerbuttonclick", event, item, value, rowindex);
    }
  },
  
  /*
   * 関数概要: インスタンス生成、および、データ初期化後処理
   */
  created() {
    this.instance.init();
  },
  
  /*
   * 関数概要: VueRouterによる画面遷移前処理
   *           VueRouterを使う場合、URLが同一の場合(QueryStringが違っても)
   *           コンポーネントが再生成されないのでここで処理を行う。
   *           URLが同じ場合、QueryString、Propsが更新されないとこのメソッド自体が呼び出されない。
   */
  beforeRouteUpdate(to, from, next) {
    this.instance.init(to);
    next();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.condition .title {
  min-width: 200px;
  max-width: 200px;
}

.condition .description {
  min-width: 450px;
  max-width: 450px;
}

.search-button {
  min-width: 680px;
  max-width: 680px;  
}
</style>