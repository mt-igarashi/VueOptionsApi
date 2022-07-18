import axios from "axios"
import constants from '../js/constants'
import utils from '../js/utils'
import validator from '../js/validator'
import movieconstants from '../js/movieconstants'
import moviesearch from '../assets/validation/moviesearch'

/*
 * クラス概要: 映画一覧ロジックを担当するクラス
 */
export default class MovieSearch {
  /*
   * 関数概要: コンストラクタ
   * 引数：vue Vueコンポーネント
   */
  constructor(vue) {
    this.vue = vue;
    this.utils = utils.instance;
    this.constants = constants.instance;
    this.movieconstants = movieconstants.instance;
    this.validator = new validator(this.vue, moviesearch);
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
  
  ///////////////////////////////////
  //
  // イベント
  //
  ///////////////////////////////////
  
  /*
   * 関数概要: 初期化を行います。
   * 引数：to 遷移先routeを格納したパラメータ
   */
  async init(to) {
    this.vue.steps = this.movieconstants.MoviePrintListSteps;
    this.setParams(to);
    
    if (this.vue.params.state == "recovery") {
      const mscond = this.vue.$store.state.mscond;
      this.vue.genre = mscond.movieGenre;
      this.vue.searchString = mscond.searchString;
    } else if (!this.vue.params.state || this.vue.params.state == "init") {
      this.vue.genre = "";
      this.vue.searchString = "";
    }
    await this.search();
  }
  
  /*
   * 関数概要: ページをリロードします。
   * 引数：iinit 初期化フラグ
   */
  reload(init = false) {
    if (init) {
      const param = {
        movieGenre: this.vue.genre,
        searchString: this.vue.searchString,
        pageNumber: this.constants.DefaultPageNumber,
        pageSize: this.constants.DefaultPageSize
      };
      this.vue.$store.dispatch("movieSearch", param);
      this.vue.$router.push({name: "MovieList", params: {state: "search", tick: Date.now()}});
    } else {
      this.vue.$router.push({name: "MovieList", params: {state: "recovery", tick: Date.now()}, query: {pageNumber: this.pageNumber(), pageSize: this.pageSize()}});
    }
  }
  
  /*
   * 関数概要: 映画を検索します。
   */
  async search() {
    this.vue.messages = this.utils.createMessage();
    this.utils.startLoading(this.vue);
    
    const param = {
        movieGenre: this.vue.genre,
        searchString: this.vue.searchString,
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize()
    };
    
    await axios.get(this.constants.MovieSearchUrl,
    {
      params: param
    })
    .then((response) => {
      const data = response.data;
      if (data.result.genres.lenght == 0 || data.result.movies.length == 0) {
        this.vue.movies = [];
        this.vue.total = 0;
        this.vue.messages = this.utils.createErrorMessage(this.constants.SearchFailed);
        return;
      }
      this.vue.genres = data.result.genres;
      data.result.movies.forEach(x => {
        x.check = false;
        x.printable = (x.id != 1 && x.id != 5 && x.id != 10);
      });
      this.vue.movies = data.result.movies;
      this.vue.total = data.result.totalCount;
    })
    .catch((error) => {
      console.log(error);
      this.vue.movies = [];
      this.vue.total = 0;
      this.vue.messages = this.utils.createErrorMessage(this.constants.SystemError);
    })
    .finally(() => {
      this.vue.$store.dispatch("movieSearch", param);
      this.utils.stopLoading(this.vue);
    });
  }
  
  /*
   * 関数概要: 映画を削除します。
   */
  async delete(item) {
    this.vue.messages = this.utils.createMessage();
    this.utils.startLoading(this.vue);
    
    const param = {
        id: item.id,
    };
    
    await axios.get(this.constants.MovieDeleteUrl,
    {
      params: param
    })
    .then((response) => {
      const data = response.data;
      if (!data.result) {
        this.vue.messages = this.utils.createErrorMessage(this.constants.DbUpdateFailed);
        return;
      }
      
      this.vue.daialog = {
        title: this.constants.InfoTitle,
        message: this.constants.DbDeleted,
        ok: null,
        cancel: null,
        show: true,
        type: this.constants.DaialogOk
      };
      this.vue.$router.push({name: "MovieList", params: {state: "search", tick: Date.now()}});
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
   * 関数概要: 映画詳細に遷移します。
   * 引数：item 映画
   */
  moveDetail(item) {
    this.vue.$router.push({ name: "MovieDetail", params: {id: item.id}});
  }
  
  /*
   * 関数概要: 映画編集を開きます。
   * 引数：item 映画
   */
  openEdit(item) {
    this.vue.messages = this.utils.createMessage();
    const route = this.vue.$router.resolve({
      name: "MovieEdit",
      params: {id: item.id}
    });
    if (this.vue.window) {
      this.vue.window.close();
    }
    this.vue.window = window.open(route.href, "_blank");
  }

  /*
   * 関数概要: ステップを更新します。
   */
  updateSteps() {
    this.vue.$nextTick(() => {
      const cbList = document.querySelectorAll(":checked");
      if (cbList.length == 0) {
        if (this.step != 0) {
          this.vue.step = 0;
          this.vue.steps = Array.from(this.vue.steps);
        }
        return;
      }

      if (this.validator.hasError()) {
        this.vue.fadeIn = true;
        this.vue.fadeOut = false;
        if (this.step != 1) {
          this.vue.step = 1;
          this.vue.steps = Array.from(this.vue.steps);
        }
      } else if (this.vue.step != 2) {
        this.vue.fadeIn = true;
        this.vue.fadeOut = true;
        this.vue.step = 2;
        this.vue.steps = Array.from(this.vue.steps); 
      }
    });
  }
  
  ///////////////////////////////////
  //
  // ページング設定
  //
  ///////////////////////////////////
  
  /*
   * 関数概要: ページ数を返却します。
   */
  pageNumber() {
    let page = Number(this.vue.params.query.pageNumber);
    if (isNaN(page)) {
      return this.constants.DefaultPageNumber;
    }
    return page;
  }
  
  /*
   * 関数概要: ページサイズを返却します。
   */
  pageSize() {
    let size = Number(this.vue.params.query.pageSize);
    if (isNaN(size)) {
      return this.constants.DefaultPageSize;
    }
    return size;
  }
  
  /*
   * 関数概要: パラメータを設定します。
   * 引数：to 遷移先ルートを格納したパラメータ
   */
  setParams(to) {
    if (!to) {
      this.vue.params = { 
        query: this.vue.$router.currentRoute.value.query,
        state: this.vue.$router.currentRoute.value.params.state
      };
      return;
    }
    
    this.vue.params = { query: to.query, state: to.params.state };
  }

  ///////////////////////////////////
  //
  // グリッド設定
  //
  ///////////////////////////////////
  
  /*
   * 関数概要: グリッド列のスタイルを設定します。
   * 引数：width 列幅
   */
  rowStyle(width = 200) {
    return `min-width: ${width}px; max-width: ${width}px; height: 32px;`;
  }
  
  /*
   * 関数概要: グリッドのカラム情報を返却します。
   */
  columns() {
    return [{
      id: "check",
      headertype: "checkbox",
      type: "checkbox",
      style: this.rowStyle(65),
      frozen: true,
      position: "0"
    },
    {
      id: "id",
      title: "ID",
      type: "link",
      style: this.rowStyle(50),
      frozen: true,
      position: "65px"
    },
    {
      id: "title",
      title: "タイトル",
      style: this.rowStyle(),
      frozen: true,
      position: "115px"
    },
    {
      id: "releaseDate",
      title: "公開日",
      style: this.rowStyle(),
      converter: this.utils.convertDisplayDate
    },
    {
      id: "genre",
      title: "ジャンル",
      style: this.rowStyle()
    },
    {
      id: "price",
      title: "価格",
      style: this.rowStyle(),
      converter: this.utils.formatDollars
    },
    {
      id: "rating",
      title: "評価",
      style: this.rowStyle()
    },
    {
      id: "button",
      type: "button",
      buttons: [{
        value: "詳細",
        class: "btn btn-primary",
        style: "width: 60px;"
      },
      {
        value: "削除",
        class: "btn btn-primary ml-2",
        style: "width: 60px;"
      }],
      style: this.rowStyle()
    }];
  }
}
