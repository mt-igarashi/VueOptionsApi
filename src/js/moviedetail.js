import axios from "axios"
import constants from '../js/constants'
import utils from '../js/utils'

/*
 * クラス概要: 映画詳細ロジックを担当するクラス
 */
export default class MovieDetail {
  /*
   * 関数概要: コンストラクタ
   * 引数：vue Vueコンポーネント
   */
  constructor(vue) {
    this.vue = vue;
    this.utils = utils.instance;
    this.constants = constants.instance;
  }
  
  /*
   * 関数概要: Vueコンポーネントを返却します。
   * 戻り値：Vueコンポーネント
   */
  get getVue() {
    return this.vue;
  }
  
  /*
   * 関数概要: Vueコンポーネントを設定します。
   * 引数：vue Vueコンポーネント
   */
  set setVue(vue) {
      this.vue = vue;
  }
  
  /*
   * 関数概要: Utilsを返却します。
   * 戻り値：Utils
   */
  get getUtils() {
    return this.utils;
  }
  
  /*
   * 関数概要: Utilsを設定します。
   * 引数：utils Utils
   */
  set setUtils(utils) {
      this.utils = utils;
  }
  
  /*
   * 関数概要: Constantsを返却します。
   * 戻り値：Constants
   */
  get getConstants() {
    return this.constants;
  }
  
  /*
   * 関数概要: Constantsクラスを設定します。
   * 引数：constants Constantsクラス
   */
  set setConstants(constants) {
      this.constants = constants;
  }
  
  /*
   * 関数概要: 初期化を行います。
   */
  async init() {
    if (!this.vue.id) {
      this.vue.messages = this.utils.createErrorMessage(this.constants.IdMissing);
      return;
    }
    
    this.utils.startLoading(this.vue);
    
    await axios.get(this.constants.MovieDetailUrl,
    {
      params: {
        id: this.vue.id
      }
    })
    .then((response) => {
      const data = response.data;
      if (!data.result) {
        this.vue.messages = this.utils.createErrorMessage(this.constants.DataNotExist);
        return;
      }
      this.vue.movie = data.result;
    })
    .catch((error) => {
      console.log(error);
      this.vue.messages = this.utils.createErrorMessage(this.constants.SystemError);
    })
    .finally(() => {
      this.utils.stopLoading(this.vue);
    });
  }
  
  /*
   * 関数概要: 映画一覧に遷移します。
   */
  movePrevPage() {
    const mscond = this.vue.$store.state.mscond;
    this.vue.$router.push({name: "MovieList", params: {state: "recovery"}, query: {pageNumber: mscond.pageNumber, pageSize: mscond.pageSize}});
  }
}
