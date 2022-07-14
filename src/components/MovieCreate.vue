<template>
  <BaseLayout :mainStyle="mainStyle" :messages="messages" :loading="loading" :daialog="daialog">
    <template #main-title>映画作成</template>
    <template #main>
      <!-- ステップバー -->
      <div class="row mt-4">
        <div class="col-12">
            <StepBar :step="step" :steps="steps" />
        </div>
      </div>
      <!-- 映画登録項目 -->
      <div class="row mt-4">
        <div class="col-12">
          <table class="condition">
            <tbody>
              <tr>
                <th class="title">
                  タイトル
                  <Question :title="movieconstants.MovieTitleHint" :messages="movieconstants.MovieTitlePoint" />
                </th>
                <td class="description">
                  <FieldValidator field="title" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="title" type="text" v-model="movie.title" :disabled="disable" :class="slotProps.executor.css" @input="validateField(slotProps)">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  公開日
                  <Question :title="movieconstants.MovieReleaseDateHint" :messages="movieconstants.MovieReleaseDatePoint" />
                </th>
                <td class="description">
                  <FieldValidator field="releaseDate" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input type="date" v-model="movie.releaseDate" :disabled="disable" :class="slotProps.executor.css" @input="validateField(slotProps)">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  ジャンル
                  <Question :title="movieconstants.MovieGenreHint" :messages="movieconstants.MovieGenrePoint" />
                </th>
                <td class="description">
                  <FieldValidator field="genre" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="genre" type="text" v-model="movie.genre" :disabled="disable" :class="slotProps.executor.css" @input="validateField(slotProps)">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  価格
                  <Question :title="movieconstants.MoviePriceHint" :messages="movieconstants.MoviePricePoint" />
                </th>
                <td class="description">
                  <FieldValidator field="price" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="price" type="text" v-model="movie.price" :disabled="disable" :class="slotProps.executor.css" @input="validateField(slotProps)">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  評価
                  <Question :title="movieconstants.MovieRateHint" :messages="movieconstants.MovieRatePoint" />
                </th>
                <td class="description">
                  <FieldValidator field="rating" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="rating" type="text" v-model="movie.rating" :disabled="disable" :class="slotProps.executor.css" @input="validateField(slotProps)">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 登録ボタン -->
      <div class="row">
        <div class="col-6 mt-4">
          <input v-show="(!messages.errors || messages.errors.length == 0) && (!messages.messages || messages.messages.length == 0)" class="btn btn-primary float-left" type="button" value="登録" @click.prevent="openModal()" />
        </div>
        <div class="col-6 mt-4">
          <div>
            <input class="btn btn-primary float-right" type="button" value="戻る" @click="movePrevPage()" />
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script>
import moviecreate from '../js/moviecreate'

export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "MovieCreate",
  
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
  data: function() {
    return {
      movie: {           // 映画エンティティ
        title: "",
        releaseDate: "",
        genre: "",
        price: 0,
        rating: ""
      },
      messages: {},      // メッセージ
      loading: false,    // ローディング表示フラグ
      daialog: {},       // ダイアログパラメータ
      step: 0,           // 現在のステップ
      steps: {},         // ステップ表示用オブジェクト
      disable: false     // 入力項目非活性フラグ
    }
  },
  
  /*
   * 概要: 算出プロパティ(キャッシュされるので変更不可。ただしリアクティブデータは変更されると再計算される)
   *       リアクティブデータであるかVueが判断できない場合の更新を防ぐため
   *       値が変わらない場合はできるだけこちらを使う
   */
  computed: {
    /*
     * 関数概要: ロジッククラスのインスタンスを返却します。
     */
    instance: function() {
      return new moviecreate(this);
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
     * 関数概要: MovieConstantsクラスのインスタンスを返却します。
     */
    movieconstants: function() {
      return this.instance.getMovieConstants;
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
      return this.constants.MainStyle;
    }
  },
  
  /*
   * 概要: メソッドプロパティ
   * (値が動的に変わる場合は、算出プロパティではなくメソッドを使う)
   */
  methods: {
    /*
     * 関数概要: 映画作成処理を行います。
     */
    create: async function () {
      await this.instance.create();
    },
    
    /*
     * 関数概要: 映画一覧に遷移します。
     */
    movePrevPage: function() {
      this.instance.movePrevPage();
    },
    
    /*
     * 関数概要: 確認ダイアログを開きます。
     */    
    openModal: function() {
      if (!this.validator.validate()) {
        return;
      }

      this.daialog = {
        title: this.constants.RegisterConfirmTitle,
        message: this.constants.RegisterConfirmMessage,
        ok: async () => { await this.create() },
        cancel: null,
        show: true
      };
    },

    /*
     * 関数概要: フィールドを検証します。
     * 引数：slotProps スロットオブジェクト
     */
    validateField: function(slotProps) {
      this.instance.validateField(slotProps);
    }
  },

  /*
   * 関数概要: インスタンス生成、および、データ初期化後処理
   */
  created: function() {
    this.steps = this.movieconstants.MovieUpdateSteps;
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

.condition td {
  background-color: ghostwhite;
}

#title {
  width: 400px;
}

#genre {
  width: 300px;
}

#price {
  width: 100px;
}

#rating {
  width: 100px;
}
</style>
