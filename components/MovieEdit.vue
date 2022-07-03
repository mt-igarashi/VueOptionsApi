<template>
  <BaseLayout :mainStyle="mainStyle" :messages="messages" :loading="loading" :daialog="daialog">
    <template #main-title>映画編集</template>
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
                  <input type="text" v-model="movie.title" @input="validator.validateField('title')"/>
                  <div v-if="validator.hasError('title')" class="alert alert-danger field-error">{{validator.getErrorMessage('title')}}</div>
                </td>
              </tr>
              <tr>
                <th class="title">
                  公開日
                </th>
                <td class="description">
                  <input type="date" v-model="movie.releaseDate" @input="validator.validateField('releaseDate')">
                  <div v-if="validator.hasError('releaseDate')" class="alert alert-danger field-error">{{validator.getErrorMessage('releaseDate')}}</div>
                </td>
              </tr>
              <tr>
                <th class="title">
                  ジャンル
                </th>
                <td class="description">
                  <input type="text" v-model="movie.genre" @input="validator.validateField('genre')">
                  <div v-if="validator.hasError('genre')" class="alert alert-danger field-error">{{validator.getErrorMessage('genre')}}</div>
                </td>
              </tr>
              <tr>
                <th class="title">
                  価格
                </th>
                <td class="description">
                  <input type="text" v-model="movie.price" @input="validator.validateField('price')">
                  <div v-if="validator.hasError('price')" class="alert alert-danger field-error">{{validator.getErrorMessage('price')}}</div>
                </td>
              </tr>
              <tr>
                <th class="title">
                  評価
                </th>
                <td class="description">
                  <input type="text" v-model="movie.rating" @input="validator.validateField('rating')">
                  <div v-if="validator.hasError('rating')" class="alert alert-danger field-error">{{validator.getErrorMessage('rating')}}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 更新、閉じるボタン -->
      <div class="row">
        <div class="col-6 mt-4">
          <input v-if="!messages.errors || messages.errors.length == 0" class="btn btn-primary float-left" type="button" value="更新" @click.prevent="openModal" />
        </div>
        <div class="col-6 mt-4">
          <div>
            <input class="btn btn-primary float-right" type="button" value="閉じる" @click="closePage" />
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script>
import movieedit from '../js/movieedit'

export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "MovieEdit",
  
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
      movie: {},         // 映画エンティティ
      messages: {},      // メッセージ
      loading: false,    // ローディング表示用フラグ
      daialog: {}        // ダイアログパラメータ
    }
  },
  
  /*
   * 概要: 算出プロパティ(初回時にキャッシュされるので変更不可)
   *       リアクティブデータであるかVueが判断できない場合の更新を防ぐため
   *       値が変わらない場合はできるだけこちらを使う
   */
  computed: {
    /*
     * 関数概要: ロジッククラスのインスタンスを返却します。
     */
    instance: function() {
      return new movieedit(this);
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
    init: async function() {
      await this.instance.init();
    },
    
    /*
     * 関数概要: 映画更新処理を行います。
     */
    edit: async function () {
      await this.instance.edit();
    },

    /*
     * 関数概要: 確認ダイアログを開きます。
     */    
    openModal: function() {
      if (!this.validator.validate()) {
        return;
      }

      this.daialog = {
        title: this.constants.UpdateConfirmTitle,
        message: this.constants.UpdateConfirmMessage,
        ok: async () => { await this.edit() },
        cancel: null,
        show: true
      };
    },
    
    /*
     * 関数概要: 画面を閉じます。
     */
    closePage: function() {
      this.instance.closePage();
    }
  },
  
  /*
   * 関数概要: インスタンス生成、および、データ初期化後処理
   */
  created: function() {
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

.condition-filter {
  min-width: 650px;
  max-width: 650px;
}
</style>
