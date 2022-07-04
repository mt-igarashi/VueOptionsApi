export default class Validator {
  /*
   * 関数概要: コンストラクタ
   */
  constructor(vue, settings) {
    this.vue = vue;
    this.settings = settings;
    this.messageStore = new Map();
    for (const v of this.settings.validation) {
      this.messageStore.set(v.field, []);
    }
  }

  /*
   * 関数概要: 必須バリデーションタイプを返却します。
   */
  get Required() {
    return "required";
  }

  /*
   * 関数概要: Minバリデーションタイプを返却します。
   */
  get Min() {
    return "min";
  }

  /*
   * 関数概要: Maxバリデーションタイプを返却します。
   */
  get Max() {
     return "max";
  }

  /*
   * 関数概要: MinLengthバリデーションタイプを返却します。
   */
  get MinLength() {
    return "minlength";
  }

  /*
   * 関数概要: MaxLengthバリデーションタイプを返却します。
   */
  get MaxLength() {
     return "maxlength";
  }

  /*
   * 関数概要: Lengthバリデーションタイプを返却します。
   */
  get Length() {
     return "length";
  }

  /*
   * 関数概要: Rangeバリデーションタイプを返却します。
   */
  get Range() {
    return "range";
  }

  /*
   * 関数概要: 正規表現バリデーションタイプを返却します。
   */
  get Regex() {
    return "regex";
  }

  /*
   * 関数概要: 比較バリデーションタイプを返却します。
   */
  get Compare() {
    return "compare";
  }

  /*
   * 関数概要: Fieldバリデーションを実行します。
   * 引数：field フィールド名
   */
  validateField(field) {
    let setting = this.getSetting(field);
    if (!setting) {
      return;
    }

    if (setting.list) {
      let index = Number(this.getIndex(field));
      let list = this.getVueData(setting.property) ?? [];
      if (isNaN(index) || list.length < index) {
        return;
      }
      this.messageStore.set(field, []);
      this.execute(setting, list[index], index);
    } else {
      this.messageStore.set(field, []);
      this.execute(setting);
    }
    
    let hasError = this.hasError(field);
    if (setting.messageProp) {
      this.vue[setting.messageProp] = this.ConvertErrorMessage();
    }

    if (setting.updateflag) {
      this.vue[setting.updateflag] = Date.now();
    }

    this.vue.$forceUpdate();
    return !hasError;
  }

  /*
   * 関数概要: バリデーションを実行します。
   */
  validate() {
    let messageProps = {};
    let updateflags = {};
    this.messageStore.clear();
    for (const v of this.settings.validation) {
      if (v.messageProp) {
        messageProps[v.messageProp] = v.messageProp;
      }

      if (v.updateflag) {
        updateflags[v.updateflag] = v.updateflag;
      }

      if (v.list) {
        let list = this.getVueData(v.property) ?? [];
        for (let i = 0; i < list.length; i++) {
          this.execute(v, list[i], i);
        }
      } else {
        this.execute(v);
      }
    }
    
    let hasError = this.hasError();
    let keys = Object.keys(messageProps);
    for (const key of keys) {
      this.vue[key] = this.ConvertErrorMessage();
    }

    keys = Object.keys(updateflags);
    for (const key of keys) {
      this.vue[key] = Date.now();
    }

    this.vue.$forceUpdate();
    return !hasError;
  }

  /*
   * 関数概要: エラーメッセージを取得します。
   * 引数：field フィールド名
   */
  getErrorMessage(field) {
    let error = this.messageStore.get(field) ?? [];
    return error.length == 0 ? "" : error[0];
  }

  /*
   * 関数概要: settingを取得します。
   * 引数：field フィールド名
   */
  getSetting(field) {
    let index = Number(this.getIndex(field));
    let fieldName = isNaN(index) ? field : this.getFieldName(field);
    for (const v of this.settings.validation) {
      if (v.field == fieldName) {
        return v;
      }
    }
    return null;
  }

  /*
   * 関数概要: エラーが存在するか検証します。
   * 引数：field フィールド名
   */
  hasError(field) {
    if (field) {
      return (this.messageStore.get(field) ?? []).length > 0;
    }

    for (const [key, value] of this.messageStore) {
      if (key && value.length > 0) {
        return true;
      }
    }
    return false;
  }

  /*
   * 関数概要: 存在しているエラーをエラーメッセージに変換します。
   * 引数：field フィールド名
   */
  ConvertErrorMessage(field) {
    if (field) {
      return {errors: this.messageStore.get(field) ?? [], messages: []};
    }

    let error = [];
    for (let [key, value] of this.messageStore) {
      if (key) {
        error = error.concat(value);
      }
    }
    return {errors: error, messages: []};
  }

  /*
   * 関数概要: Requiredバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateRequired(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    if (pairInfo.value || (pairInfo.value == typeof Number && pairInfo.value == 0)) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name);

    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Minバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateMin(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    if (pairInfo.value >= Number(rule.value)) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, rule.value);

    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Maxバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateMax(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    if (pairInfo.value <= Number(rule.value)) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, rule.value);
    
    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: MinLengthバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateMinLength(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    if ((pairInfo.value ?? "").length >= rule.value) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, rule.value);
    
    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: MaxLengthバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateMaxLength(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    if ((pairInfo.value ?? "").length <= rule.value) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, rule.value);
    
    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Lengthバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateLength(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    if ((pairInfo.value ?? "").length >= rule.min && (pairInfo.value ?? "").length <= rule.max) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, rule.min, rule.max);
    
    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Rangeバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateRange(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    if (pairInfo.value >= Number(rule.min) && pairInfo.value <= Number(rule.max)) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, rule.min, rule.max);

    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Regexバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateRegex(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    let re = new RegExp(rule.value);
    if (re.test((pairInfo.value ?? ""))) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, rule.value);
    
    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Compareバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール, item リストアイテム、index インデックス
   */
  validateCompare(setting, rule, item, index) {
    let pairInfo = this.getPairInfo(setting, rule, item, index);
    let arg1 = pairInfo.value; 
    let arg2 = pairInfo.target; 
    let method = rule.method ?? 0;
    let type = rule.type ?? "";

    if ((arg1 == null || arg1 == typeof undefined) || (arg2 == null || arg2 == typeof undefined)) {
      return;
    }

    if (type.ToLower().includes("date")) {
        arg1 = arg1 ? arg1.getTime() : null;
        arg2 = arg2 ? arg2.getTime() : null;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, setting.name, arg1, arg2);

    if (method == -1) {
      if (type.ToLower().includes("equal")) {
        if (arg1 <= arg2) {    
          return true;
        }
      } else {
        if (arg1 < arg2) {    
          return true;
        }
      }
    }

    if (method == 0) {
      if (arg1 == arg2) {
        return true;
      }
    }

    if (method == 1) {
      if (type.ToLower().includes("equal")) {
        if (arg1 >= arg2) {
          return true;
        }
      } else {
        if (arg1 > arg2) {
          return true;
        }
      }
    }

    let messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: バリデーションを実行します。
   * 引数：setting validation定義、item アイテム、index インデックス
   */
  execute(setting, item, index)  {
    for (const rule of setting.rules) {
      switch(rule.type) {
        case "required": {
          this.validateRequired(setting, rule, item, index);
          break;
        }
        case "min": {
          this.validateMin(setting, rule, item, index);
          break;
        }
        case "max": {
          this.validateMax(setting, rule, item, index);
          break;
        }
        case "minlength": {
          this.validateMinLength(setting, rule, item, index);
          break;
        }
        case "maxlength": {
          this.validateMaxLength(setting, rule, item, index);
          break;
        }
        case "length": {
          this.validateLength(setting, rule, item, index);
          break;
        }
        case "range": {
          this.validateRange(setting, rule, item, index);
          break;
        }
        case "regex": {
          this.validateRegex(setting, rule, item, index);
          break;
        }
        case "compare": {
          this.validateCompare(setting, rule, item, index);
          break;
        }
        default: {
          console.log("validation type can't be matched")
        }
      }
    }
  }

  /*
   * 関数概要: バリデーション共通メッセージを取得します。
   * 引数：message エラーメッセージ
   */
  getCommonMessage(message) {
    switch(message) {
      case "COM-0001": {
        return "{0}は必須入力項目です。";
      }
      case "COM-0002": {
        return "{0}は{1}桁以上の数値を入力してください。";
      }
      case "COM-0003": {
        return "{0}は{1}桁以下の数値を入力してください。";
      }
      case "COM-0004": {
        return "{0}は{1}桁以上の文字列を入力してください。";
      }
      case "COM-0005": {
        return "{0}は{1}桁以下の文字列を入力してください。";
      }
      case "COM-0006": {
        return "{0}は{1}桁以下の文字列を入力してください。";
      }
      case "COM-0007": {
        return "{0}は{1}桁以上{2}桁以下の文字列を入力してください。";
      }
      case "COM-0008": {
        return "{0}は{1}以上{2}以下の数値を入力してください。";
      }
    }
    return message;
  }

  /*
   * 関数概要: プロパティの値とフィールド名を返却します。
   * 引数：setting validation定義、rule ルール、item アイテム、index インデックス
   */
  getPairInfo(setting, rule, item, index) {
    let value;
    let target;
    let fieldName;
    if (item) {
      value = item[setting.field];
      if (rule.target) {
        target = item[rule.target];
      }
      fieldName = this.getIndexedFieldName(setting.field, index);
    } else {
      value = this.getVueData(setting.field, setting.property);
      if (rule.target) {
        target = this.getVueData(rule.target, setting.property);
      }
      fieldName = setting.field;
    }

    return { value: value, target: target, fieldName: fieldName };
  }

  /*
   * 関数概要: フィールド名を返却します。
   * 引数：field フィールド名
   */
  getFieldName(field) {
    let index = Number(this.getIndex(field));
    if (isNaN(index)) {
      return field;
    }
    let list = field.split("_");
    return list.slice(0, index.length - 2).join("_");
  }

  /*
   * 関数概要: フィールド名を返却します。
   * 引数：field フィールド名、index インデックス
   */
  getIndexedFieldName(field, index) {
    if (index == null || index == typeof undefined) {
      return field;
    }
    return `${field}_${index}`;
  }

  /*
   * 関数概要: フィールド名からインデックスを返却します。
   * 引数：field フィールド名
   */
  getIndex(field) {
    if (!field) {
      return null;
    }
    let index = field.split("_");
    return index[index.length - 1];
  }

  /*
   * 関数概要: Vueコンポーネントが保持しているデータを返却します。
   * 引数：property プロパティ名、prefix プレフィックス
   */
  getVueData(property, prefix) {
    if (!prefix) {
      return this.vue[property];
    }
    
    let data = this.vue[prefix];
    if (!data) {
      return null;
    }
    
    return data[property];
  }

  /*
   * 関数概要: メッセージをフォーマットします。
   * 引数：message エラーメッセージ、args 置換文字列
   */
  formatMessage(message, ...args) {
    let result = message;
    for (let i = 0; i < args.length; i++) {
        let target = `{${i}}`;
        if (message.includes(target)) {
            result = result.replaceAll(target, args[i]);
        }
    }
    return result;
  }
}