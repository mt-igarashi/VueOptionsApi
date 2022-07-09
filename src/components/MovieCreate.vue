<template>
  <BaseLayout :mainStyle="mainStyle" :messages="messages" :loading="loading" :daialog="daialog">
    <template #main-title>映画作成</template>
    <template #main>      
      <!-- 映画登録項目 -->
      <div class="row mt-4">
        <div class="col-12">
          <table class="condition">
            <tbody>
              <tr>
                <th class="title">
                  タイトル
                  <Question message="映画のタイトルを入力します。&#10;洋画はできるだけキャッチーなタイトルにしましょう！" class="float-right" />
                </th>
                <td class="description">
                  <FieldValidator field="title" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="title" type="text" v-model="movie.title" :class="slotProps.executor.css" @input="slotProps.executor.validate()">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  公開日
                  <Question message="映画の公開日を入力します。&#10;原則公開日の１か月前のものを登録します。&#10;期日が過ぎたものについては管理者に連絡してください。" class="float-right" />
                </th>
                <td class="description">
                  <FieldValidator field="releaseDate" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input type="date" v-model="movie.releaseDate" :class="slotProps.executor.css" @input="slotProps.executor.validate()">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  ジャンル
                  <Question message="映画のジャンルを入力します。&#10;一押しの映画の場合は他で使われていない&#10;ジャンルを入力しましょう。&#10;入力したジャンルでユーザが検索できるようになります。" class="float-right" />
                </th>
                <td class="description">
                  <FieldValidator field="genre" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="genre" type="text" v-model="movie.genre" :class="slotProps.executor.css" @input="slotProps.executor.validate()">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  価格
                  <Question message="映画の価格を入力します。公開される際は原則ドル表記になります。" class="float-right" />
                </th>
                <td class="description">
                  <FieldValidator field="price" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="price" type="text" v-model="movie.price" :class="slotProps.executor.css" @input="slotProps.executor.validate()">
                    </template>
                  </FieldValidator>
                </td>
              </tr>
              <tr>
                <th class="title">
                  評価
                  <Question message="映画の評価を入力します。&#10;他のレビュアーに参考となる値を入力してください。&#10;しかしながら主観的な評価も考慮するようにしましょう。" class="float-right" />
                </th>
                <td class="description">
                  <FieldValidator field="rating" :validator="validator">
                    <template v-slot:control="slotProps">
                      <input id="rating" type="text" v-model="movie.rating" :class="slotProps.executor.css" @input="slotProps.executor.validate()">
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
