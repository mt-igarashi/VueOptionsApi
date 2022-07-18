export default class MovieConstants {
  static #counter = 0;
  static instance = new MovieConstants();
  
  /*
   * 関数概要: コンストラクタ
   */
  constructor() {
    if (MovieConstants.#counter > 0) {
      throw "creation of instance is not permitted";
    }
    MovieConstants.#counter++;
  }

  /*
   * 映画タイトルヒント
   */
  get MovieTitleHint() {
    return "<b>タイトル入力ヒント</b>";
  }

  /*
   * 映画タイトル作成ポイント
   */
  get MovieTitlePoint() {
    return [
      "タイトルは<font color='red'><b>６０文字の制限</b></font>がありますが、英数字漢字どれも入力ができます。",
      "できるだけキャッチーなタイトルにするのがおすすめです",
      "<a target=_blank' class='exlink' href='https://www.amazon.co.jp/%E3%80%90%E5%88%9D%E7%B4%9A%E8%80%85%E5%90%91%E3%81%91%E3%80%91%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AB%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%95%E3%81%9B%E3%82%8B%E3%82%AD%E3%83%BC%E3%83%AF%E3%83%BC%E3%83%89%E6%BA%80%E8%BC%89%E3%81%AE%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%AE%E4%BB%98%E3%81%91%E6%96%B9%EF%BC%81-%E3%82%8F%E3%81%8B%E3%82%8BWeb-%E5%9B%BD%E5%BA%9C%E7%94%B0-%E8%AA%A0-ebook/dp/B08955P9MM/ref=sr_1_2?adgrpid=123002498870&hvadid=506539511254&hvdev=c&hvqmt=b&hvtargid=kwd-1216905444164&hydadcr=1309_13324784&jp-ad-ap=0&keywords=%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%AE%E4%BB%98%E3%81%91%E6%96%B9&qid=1657634985&sr=8-2'>基本を押さえるのにおすすめの本</a>"
    ];
  }

  /*
   * 映画公開日ヒント
   */
  get MovieReleaseDateHint() {
    return "<b>公開日入力ヒント</b>";
  }

  /*
   * 映画公開日作成ポイント
   */
  get MovieReleaseDatePoint() {
    return [
      "<font color='red'><b>原則公開日の１か月前のものを</b></font>登録します",
      "<font color='red'><b>期日が過ぎたものについては</b></font>管理者に連絡してください",
      "集客が見込めそうな映画の場合は、数か月前から登録することをおすすめします"
    ];
  }

  /*
   * 映画ジャンルヒント
   */
  get MovieGenreHint() {
    return "<b>ジャンル入力ヒント</b>";
  }

  /*
   * 映画ジャンル作成ポイント
   */
  get MovieGenrePoint() {
    return [
      "<font color='red'><b>先頭半角英字大文字 + 半角英字を30文字以内で</b></font>入力してください",
      "一押しの映画の場合は他で使われていないジャンルを入力しましょう",
      "入力したジャンルで<font color='red'><b>ユーザが検索できるように</b></font>なります"
    ];
  }

  /*
   * 映画価格ヒント
   */
  get MoviePriceHint() {
    return "<b>価格入力ヒント</b>";
  }

  /*
   * 映画価格作成ポイント
   */
  get MoviePricePoint() {
    return [
      "<font color='red'><b>1～100までの数値</b></font>を入力してください",
      "フィルムメーカーが提示した価格を入力しましょう",
      "公開される際は原則ドル表記になります"
    ];
  }

  /*
   * 映画評価ヒント
   */
  get MovieRateHint() {
    return "<b>評価入力ヒント</b>";
  }

  /*
   * 映画評価作成ポイント
   */
  get MovieRatePoint() {
    return [
      "<font color='red'><b>先頭半角英字大文字 + 半角英字を5文字以内</b></font>で入力してください",
      "略称としてS(最高-Supreme)、R(普通-Regular)、P(低評価-Poor)などがあります",
      "他のレビュアーに参考となる値を入力しましょう"
    ];
  }

  /*
   * 映画更新ステップ
   */
  get MovieUpdateSteps() {
    return [
      {title: "入力", message: "作成ポイントは？マークを<br>クリックして確認できます"},
      {title: "確認", message: "入力内容を確認後<br>登録ボタンを押します"},
      {title: "登録", message: "お疲れさまでした<br>登録が完了しました"}
    ];
  }

  /*
   * 映画一覧印刷ステップ
   */
  get MoviePrintListSteps() {
    return [
      {title: "入力", message: "！マークにカーソルを合わせると<br>エラーが表示されます"},
      {title: "確認", message: "エラー内容を確認後チェックを<br>外してください"},
      {title: "印刷準備完了", message: "一覧印刷ボタンを押下してください"}
    ];
  }
}