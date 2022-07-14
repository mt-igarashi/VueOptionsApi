<template>
  <div>
    <template v-if="tooltip">
      <slot name="control" :executor="executor"></slot>
      <span v-if="message && loaded" :data-message="message" class="field-tooltip">
        <img class="ml-2" alt="警告" src="../../assets/small_v_error.png">
      </span>
    </template>
    <template v-else>
      <slot name="control" :executor="executor"></slot>
      <img v-if="message && loaded" class="ml-2" alt="警告" src="../../assets/small_v_error.png">
      <img v-if="!message && loaded" class="ml-2" alt="OK" src="../../assets/small_v_ok.png">
      <div v-if="message" class="error-msg">
        {{message}}
      </div>
    </template>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "FieldValidator",

  /*
   * 概要: プロパティ
   * (遷移元画面、親コンポーネント、QueryStringなどから受け取る)
   */
  props: {
    // バリデータ
    validator: {
      required: true,
      type: Object
    },

    // フィールド名
    field: {
      required: true,
      type: String
    },

    // Input項目用CSS
    css: {
      type: String,
      default: ""
    },

    // ツールチップのみを表示するかを示すフラグ
    tooltip: {
      type: Boolean,
      default: false
    },

    // 編集項目であるかを示すフラグ
    edit: {
      type: Boolean,
      default: false
    }
  },

  /*
   * 概要: データプロパティ
   * (リアクティブデータ。変更がUIに即時反映される)
   */
  data: function() {
    return {
      loaded: false,             // ページロード完了フラグ
      message: "",               // エラーメッセージ
      executor: reactive({       // バリデータ実行オブジェクト
        css: [this.css],         // バリデータ実行後CSS
        validate: this.validate  // バリデーション関数
      }),
    }
  },

  /*
   * 概要: メソッドプロパティ
   * (値が動的に変わる場合は、算出プロパティではなくメソッドを使う)
   */
  methods: {
    /*
     * 関数概要: フィールドバリデータを実行します。
     */
    validate: function() {
      this.validator.validateField(this.field);
    },

    /*
     * 関数概要: バリデータ実行後のコールバック関数。
     * 引数：message メッセージ、error フィールドエラーメッセージ
     */
    callback: function(message, error) {
      console.log(Object.keys(message).length);
      this.loaded = true;
      if (error) {
        this.executor.css = [this.css, "field-error"];        
        this.message = error;
      } else {
        this.executor.css = [this.css, "field-valid"];
        this.message = "";
      }
    }
  },

  /*
   * 関数概要: インスタンス生成、および、データ初期化後処理
   */
  created: function() {
    if (this.edit) {
      this.callback({}, "");
    }
    this.validator.addCallbackStore(this.field, this.callback);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.field-tooltip {
  position: absolute;
  top: 11px;
  z-index: 3;
}

.field-tooltip:hover:after {
  content: attr(data-message);
  position: absolute;
  color: #721c24;
  background-color: #f8d7da;
  padding: 3px 5px;
  bottom: 20px; right: -5px;
  transform: translate(100%, 100%);
  border-radius: 5px 5px 5px 5px;
  white-space: pre;
  opacity: 0.95;
}
</style>
