export default class Utils {
  static instance = new Utils();
  
  /*
   * 関数概要: コンストラクタ
   */
  constructor() {
    if (Utils.instance) {
      throw "creation of instance is not permitted";
    }
  }
  
  /*
   * 関数概要: 入力用日付に変換します。
   * 引数：date DB日付
   * 戻り値：入力用日付
   */
  convertInputDate(date) {
    if (!date) {
      return "";
    }
    
    return date.split("T")[0];
  }
  
  /*
   * 関数概要: 表示用日付に変換します。
   * 引数：date DB日付
   * 戻り値：表示用日付
   */
  convertDisplayDate(date) {
    if (!date) {
      return "";
    }
    
    let sp = date.split("T")[0];
    let result = sp.split("-");
    
    if (result.length != 3) {
      return sp;
    }
    
    return `${result[0]}年 ${result[1]}月 ${result[2]}日`;
  }
  
  /*
   * 関数概要: 数値をドル表記に変換します。
   * 引数：number 数値
   * 戻り値：数値(ドル表記)
   */
  formatDollars(number) {
    if (!number) {
      "";
    }
    return `$ ${number}`;
  }
  
  /*
   * 関数概要: 指定した文字列を格納したメッセージを生成します。
   * 引数：message メッセージ
   * 戻り値：メッセージ
   */
  createMessage(message) {
    if (!message) {
      return {errors: [], messages: []};
    }
    return {errors: [], messages: [message]};
  }
  
  /*
   * 関数概要: 指定した文字列を格納したメッセージを生成します。
   * 引数：error エラーメッセージ
   * 戻り値：メッセージ
   */
  createErrorMessage(error) {
    if (!error) {
      return {errors: [], messages: []};
    }
    return {errors: [error], messages: []};
  }
  
  /*
   * 関数概要: モーダル表示用パラメータを生成します。
   * 引数：title タイトル
   *       message メッセージ
   *       ok OKボタン押下時メソッド
   *       cancel Cancelボタン押下時メソッド
   * 戻り値：メッセージ
   */
  createDaialogParameter(title, message, ok, cancel, show) {
    return {
      title: title,
      message: message,
      ok: ok,
      cancel: cancel,
      show: show
    };
  }
  
  /*
   * 関数概要: Loadingを開始します。
   * 引数：vue Vueコンポーネント
   */
  startLoading(vue) {
    var elems = document.querySelectorAll("button, a");
    elems.forEach((elem) => {
      elem.style["pointer-events"] = "none";
    });
    vue.loading = true;
  }
  
  /*
   * 関数概要: Loadingを停止します。
   * 引数：vue Vueコンポーネント
   */
  stopLoading(vue) {
    var elems = document.querySelectorAll("button, a");
    elems.forEach((elem) => {
      elem.style["pointer-events"] = "auto";
    });
    vue.loading = false;
  }
  
  ///////////////////////////////////
  //
  // イベントログ出力
  //
  ///////////////////////////////////
  
  /*
   * 関数概要: ログを出力します
   * 引数：args ログ出力する変数
   */
  console(...args) {
    args.forEach((arg) => {
      console.log(arg);
    });
  }
}