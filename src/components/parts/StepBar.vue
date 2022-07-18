<template>
<div v-if="show" :class="mainCss">
  <ol class="c-stepper">
    <template v-for="(step, index) in steps" :key="step">
      <li :class="getItemCss(index)">
        <h3 :class="getTitleCss(index)" v-html="step.title"></h3>
        <p :class="getDescCss(index)" v-html="step.message"></p>
      </li>
    </template>
  </ol>
</div>
</template>

<script>
export default {
  /*
   * 概要: 名前プロパティ
   * (開発者ツール、Vue Devtoolsに表示される)
   */
  name: "StepBar",

  /*
   * 概要: プロパティ
   * (遷移元画面、親コンポーネント、QueryStringなどから受け取る)
   */
  props: {
    // 現在のステップ
    step: {
      tyep: Number,
      default: 0
    },

    // ステップ表示用オブジェクト
    steps: {
      required: true,
      type: Array,
      default: new Array()
    },
    
    // CSS
    css: {
      type: String,
      default: ""
    }
  },

  /*
   * 概要: データプロパティ
   * (リアクティブデータ。変更がUIに即時反映される)
   */
  data: function() {
    return {
      show: true  // ステップバー表示フラグ
    }
  },

  /*
   * 概要: 算出プロパティ(キャッシュされるので変更不可。ただしリアクティブデータは変更されると再計算される)
   *       リアクティブデータであるかVueが判断できない場合の更新を防ぐため
   *       値が変わらない場合はできるだけこちらを使う
   */
  computed: {
    mainCss: function() {
      if (this.fadeIn) {
        return [this.css, "updown"];
      }
      return [this.css];
    }
  },

  /*
   * 概要: メソッドプロパティ
   * (値が動的に変わる場合は、算出プロパティではなくメソッドを使う)
   */
  methods: {
    /*
     * 関数概要: ItemのCSSを返却します。
     * 引数：index インデックス
     */
    getItemCss(index) {
      let css = ["c-stepper-item"];
      if (this.step == index) {
        css.push("c-stepper-item-selected");
      }

      if (this.step > index) {
        css.push("c-stepper-item-selected");
        css.push("c-stepper-item-line");
      }

      return css;
    },

    /*
     * 関数概要: TitleのCSSを返却します。
     * 引数：index インデックス
     */
    getTitleCss(index) {
      if (this.step == index) {
        return ["c-stepper-title", "c-stepper-title-selected"];
      }
      return ["c-stepper-title"];
    },

    /*
     * 関数概要: DescのCSSを返却します。
     * 引数：index インデックス
     */
    getDescCss(index) {
      if (this.step == index) {
        return ["c-stepper-desc", "c-stepper-desc-selected"];
      }
      return ["c-stepper-desc"];
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.c-stepper {
  display: flex;
  padding-left: 0;
  --circle-size: clamp(1.5rem, 5vw, 0.5rem);
  --spacing: clamp(0.25rem, 2vw, 0.5rem);
}

.c-stepper-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
}

.c-stepper-item::before {
  --size: 3rem;
  content: "";
  display: block;
  width: var(--circle-size);
  height: var(--circle-size);
  border-radius: 50%;
  background-color: lightgrey;
  opacity: 0.8;
  margin: 0 auto 1rem;
}

.c-stepper-item:not(:last-child)::after {
  content: "";
  position: relative;
  top: calc(var(--circle-size) / 2);
  width: calc(100% - var(--circle-size) - calc(var(--spacing) * 2));
  left: calc(50% + calc(var(--circle-size) / 2 + var(--spacing)));
  height: 2px;
  background-color: #e0e0e0;
  order: -1;
}

.c-stepper-title {
  color: lightgrey;
  font-weight: bold;
  font-size: clamp(1rem, 4vw, 1.25rem);
  margin-bottom: 0.5rem;
}

.c-stepper-desc {
  color: grey;
  font-size: clamp(0.85rem, 2vw, 1rem);
  padding-left: var(--spacing);
  padding-right: var(--spacing);
}

.c-stepper-item-selected::before {
    background-color: dodgerblue;
}

.c-stepper-item-line:not(:last-child)::after {
    background-color: dodgerblue;
}

.c-stepper-title-selected {
    color: dodgerblue;
}

.c-stepper-desc-selected {
    color: brown;
}

.square_btn {
  display: block;
  position: relative;
  left: 38px;
  width: 30px;
  height: 30px;
  border: 2px solid #333; /* 枠の調整 */
  background: #fff; /* ボタンの背景色 */
}
 
.square_btn::before,.square_btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px; /* 棒の幅（太さ） */
  height: 27px; /* 棒の高さ */
  background: #333; /* バツ印の色 */
}

.square_btn::before {
  transform: translate(-50%,-50%) rotate(45deg);
}
 
.square_btn::after {
  transform: translate(-50%,-50%) rotate(-45deg);
}

.updown {
  animation-name:updown1;   /* アニメーション名の指定 */
  animation-delay:0s;       /* アニメーションの開始時間指定 */
  animation-duration: 3s;   /* アニメーション動作時間の指定 */
  animation-timing-function: ease-in-out;  /* アニメーションの動き指定（徐々に早く）*/
  animation-iteration-count: infinite; 
}
 
@keyframes updown1 {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
