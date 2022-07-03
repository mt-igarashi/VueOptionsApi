import axios from "axios"
import constants from '../js/constants'
import utils from '../js/utils'
import validator from '../js/validator'
import movieupdate from '../assets/validation/movieupdate.json'

/*
 * クラス概要: 映画作成ロジックを担当するクラス
 */
export default class MovieCreate {
  /*
   * 関数概要: コンストラクタ
   * 引数：vue Vueコンポーネント
   */
  constructor(vue) {
    this.vue = vue;
    this.utils = utils.instance;
    this.constants = constants.instance;
    this.validator = new validator(this.vue, movieupdate);
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
   * 関数概要: Constantsを設定します。
   * 引数：constants Constants
   */
  set setConstants(constants) {
      this.constants = constants;
  }

  /*
   * 関数概要: Validatorを返却します。
   * 戻り値：Validator
   */
  get getValidator() {
    return this.validator;
  }
  
  /*
   * 関数概要: Validatorを設定します。
   * 引数：constants Validator
   */
  set setValidator(validator) {
      this.validator = validator;
  }
  
  /*
   * 関数概要: 映画を登録します。
   */
  async create() {
    this.utils.startLoading(this.vue);
    
    await axios.post(this.constants.MovieCreateUrl,
    {
      Title: this.vue.movie.title,
      ReleaseDate: this.vue.movie.releaseDate,
      Genre: this.vue.movie.genre,
      Price: this.vue.movie.price,
      Rating: this.vue.movie.rating
    })
    .then((response) => {
      var data = response.data;
      if (!data.result) {
        console.log("登録失敗");
        this.vue.messages = this.utils.createErrorMessage(this.constants.DbUpdateFailed);
        return;
      }
      this.vue.messages = this.utils.createMessage(this.constants.DbUpdated);
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
  moveMovieList() {
    this.vue.$router.push({name: "MovieList", params: {state: "init"}});
  }
  
  /*
   * 関数概要: 映画一覧に遷移します。
   */
  movePrevPage() {
    let mscond = this.vue.$store.state.mscond;
    this.vue.$router.push({name: "MovieList", params: {state: "recovery"}, query: {pageNumber: mscond.pageNumber, pageSize: mscond.pageSize}});
  }
}
