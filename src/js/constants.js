export default class Constants {
  static #counter = 0;
  static instance = new Constants();
  
  /*
   * 関数概要: コンストラクタ
   */
  constructor() {
    if (Constants.#counter > 0) {
      throw "creation of instance is not permitted";
    }
    Constants.#counter++;
  }
  
  /*
   * デフォルトURL
   */
  get DefaultMovieUrl(){
     return "/api/movies";
  }
  
  /*
   * 映画取得URL
   */
  get MovieFindUrl() {
    return `${this.DefaultMovieUrl}/find`;
  }
  
  /*
   * 映画一覧取得URL
   */
  get MovieSearchUrl() {
    return `${this.DefaultMovieUrl}/search`;
  }
  
  /*
   * 映画編集URL
   */
  get MovieDetailUrl() {
   return `${this.DefaultMovieUrl}/find`;
  }
  
  /*
   * 映画作成URL
   */
  get MovieCreateUrl() {
    return `${this.DefaultMovieUrl}/create`;
  }
  
  /*
   * 映画編集URL
   */
  get MovieEditUrl() {
    return `${this.DefaultMovieUrl}/edit`;
  }
  
  /*
   * 映画削除URL
   */
  get MovieDeleteUrl() {
    return `${this.DefaultMovieUrl}/delete`;
  }
  
  /*
   * ダイアログタイプ(OK/Cancel)
   */
  get DaialogOkCancel() {
    return "okcancel";
  }
  
  /*
   * ダイアログタイプ(OK)
   */
  get DaialogOk() {
    return "ok";
  }
  
  /*
   * メインコンテンツ(スモール)
   */
  get SmallMainStyle() {
    return "width: 650px;";
  }
  
  /*
   * メインコンテンツ(ノーマル)
   */
  get MainStyle() {
    return "width: 800px;";
  }
  
  /*
   * メインコンテンツ(ラージ)
   */
  get LargeMainStyle() {
    return "width: 950px;";
  }
  
  /*
   * デフォルトページ数
   */
  get DefaultPageNumber() {
    return 0;
  }
  
  /*
   * デフォルトページサイズ
   */
  get DefaultPageSize() {
    return 10;
  }
  
  /*
   * 情報タイトル
   */
  get InfoTitle() {
    return "情報";
  }
  
  /*
   * 登録確認タイトル
   */
  get RegisterConfirmTitle() {
    return "登録確認";
  }
    
  /*
   * 登録確認メッセージ
   */
  get RegisterConfirmMessage() {
    return "登録を実行します。よろしければOKボタンを押下してください。";
  }
  
  /*
   * 更新確認タイトル
   */
  get UpdateConfirmTitle() {
    return "更新確認";
  }
    
  /*
   * 更新確認メッセージ
   */
  get UpdateConfirmMessage() {
    return "更新を実行します。よろしければOKボタンを押下してください。";
  }
  
  /*
   * 削除確認タイトル
   */
  get DeleteConfirmTitle() {
    return "削除確認";
  }
    
  /*
   * 削除確認メッセージ
   */
  get DeleteConfirmMessage() {
    return "削除を実行します。よろしければOKボタンを押下してください。";
  }
  
  /*
   * メッセージ(DB更新成功)
   */
  get DbUpdated() {
    return "更新に成功しました。";
  }
  
  /*
   * メッセージ(DB削除成功)
   */
  get DbDeleted() {
    return "削除に成功しました。";
  }
  
  /*
   * エラーメッセージ(システムエラー)
   */
  get SystemError() {
    return "システムエラーが発生しました。管理者に連絡してください。";
  }
  
  /*
   * エラーメッセージ(ID指定なし)
   */
  get IdMissing() {
    return "IDが指定されていないため、更新ができません。再度画面を開きなおしてください。";
  }
  
  /*
   * エラーメッセージ(データなし)
   */
  get DataNotExist() {
    return "データがありませんでした。";
  }
  
  /*
   * エラーメッセージ(検索結果0件)
   */
  get SearchFailed() {
    return "検索できるデータがありませんでした。";
  }
  
  /*
   * エラーメッセージ(DB更新失敗)
   */
  get DbUpdateFailed() {
    return "更新に失敗しました。管理者に連絡してください。";
  }
}