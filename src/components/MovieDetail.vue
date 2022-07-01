<template>
  <BaseLayout :mainStyle="mainStyle" :messages="messages" :loading="loading">
    <template #main-title>映画詳細</template>
    <template #main>      
      <!-- 検索条件 -->
      <div class="row mt-4">
        <div class="col-12">
          <table class="condition">
            <tbody>
              <tr>
                <th class="title">
                  タイトル
                </th>
                <td class="description">
                  {{movie.title}}
                </td>
              </tr>
              <tr>
                <th class="title">
                  公開日
                </th>
                <td class="description">
                  {{this.utils.convertDisplayDate(movie.releaseDate)}}
                </td>
              </tr>
              <tr>
                <th class="title">
                  ジャンル
                </th>
                <td class="description">
                  {{movie.genre}}
                </td>
              </tr>
              <tr>
                <th class="title">
                  価格
                </th>
                <td class="description">
                  {{this.utils.formatDollars(movie.price)}}
                </td>
              </tr>
              <tr>
                <th class="title">
                  評価
                </th>
                <td class="description">
                  {{movie.rating}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 戻るボタン -->
      <div class="row">
        <div class="col-12 mt-4">
          <div>
            <input class="btn btn-primary float-right" type="button" value="戻る" @click="movePrevPage()" />
          </div>
        </div>
      </div>      
    </template>
  </BaseLayout>
</template>

<script>
import moviedetail from '../js/moviedetail'

export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "MovieDetail",
  
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
    // 映画ID
    id: {
      required: true,
      type: String
    }
  },
  
  /*
   * 概要: データプロパティ
   * (リアクティブデータ。変更がUIに即時反映される)
   */
  data: function() {
    return {
      movie: {},     // 映画エンティティ
      messages: {},  // メッセージ
      loading: false // ローディング表示用フラグ
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
      return new moviedetail(this);
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
     * 関数概要: メイン要素のスタイルを返却します。
     */
    mainStyle: function() {
      return this.constants.MainStyle;
    }
  },
  
  /*
   * 概要: メソッドプロパティ
   * (値が動的に変わる場合は、算出プロパティではなくメソッドを使う)
   */
  methods: {
    /*
     * 関数概要: 初期化処理を行います。
     */
    init: async function () {
      await this.instance.init();
    },
    
    /*
     * 関数概要: 映画一覧に遷移します。
     */
    movePrevPage: function() {
      this.instance.movePrevPage();
    }
  },
  
  /*
   * 関数概要: インスタンス生成、および、データ初期化後処理
   */
  created() {
    this.init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.condition .title {
  width: 275px;
}

.condition .description {
  width: 525px;
}
</style>
