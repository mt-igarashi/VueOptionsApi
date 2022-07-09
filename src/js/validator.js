export default class Validator {
  /*
   * 関数概要: コンストラクタ
   */
  constructor(vue, settings) {
    this.vue = vue;
    this.settings = settings;
    this.messageStore = new Map();
    this.callbackStore = new Map();
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
    const setting = this.getSetting(field);
    if (!setting) {
      return;
    }

    this.messageStore.set(field, []);
    this.initializeMessegeStore();

    if (setting.list) {
      const index = Number(this.getIndex(field));
      const list = this.getVueData(setting.field) ?? [];
      if (isNaN(index) || list.length < index) {
        return;
      }
      this.execute({ field: setting, item: list[index], rowindex: index });
    } else {
      this.execute({ field: setting });
    }
    
    const hasError = this.hasError(field);
    const errors = this.ConvertErrorMessage();

    if (this.settings.validation.messageProp) {
      this.vue[this.settings.validation.messageProp] = errors;
    }

    const callback = this.callbackStore.get(field);
    if (callback) {
      callback(errors, this.getErrorMessage(field));
    }

    return !hasError;
  }

  /*
   * 関数概要: バリデーションを実行します。
   * 引数：callback コールバック関数
   */
  validate() {
    this.initializeMessegeStore(true);
    for (const field of this.settings.validation.fields) {
      if (field.list) {
        const list = this.getVueData(field.field) ?? [];
        for (let i = 0; i < list.length; i++) {
          this.execute({ field: field, item: list[i], rowindex: i });
        }
      } else {
        this.execute({ field: field });
      }
    }
    
    const hasError = this.hasError();
    const errors = this.ConvertErrorMessage();

    if (this.settings.validation.messageProp) {
      this.vue[this.settings.validation.messageProp] = errors;
    }

    for (const [key, callback] of this.callbackStore) {
      if (key) {
        callback(errors, this.getErrorMessage(key));
      }
    }

    return !hasError;
  }

  /*
   * 関数概要: メッセージストアを初期化します。
   * 引数：clear 全削除フラグ
   */
  initializeMessegeStore(clear) {
    if (clear) {
      this.messageStore.clear();
    }

    for (const field of this.settings.validation.fields) {
      if (field.list) {
        const list = this.getVueData(field.field) ?? [];    
        for (var i = 0; i < list.length; i++) {
          const indexedName = this.getIndexedFieldName(field.field, i);
          const messages = this.messageStore.get(indexedName);
          if (!messages) {
            this.messageStore.set(indexedName, []);
          }
        }

        let indexedName = this.getIndexedFieldName(field.field, i);
        while (this.messageStore.has(indexedName)) {
          this.messageStore.set(indexedName, []);
          indexedName = this.getIndexedFieldName(field.field, ++i);
        }
      } else {
        const messages = this.messageStore.get(field.field) ?? [];
        if (!messages.length) {
          this.messageStore.set(field.field, []);
        }
      }
    }
  }

  /*
   * 関数概要: エラーメッセージを取得します。
   * 引数：field フィールド名
   */
  getErrorMessage(field) {
    const error = this.messageStore.get(field) ?? [];
    return error.length == 0 ? "" : error[0];
  }

  /*
   * 関数概要: settingを取得します。
   * 引数：field フィールド名
   */
  getSetting(field) {
    const index = Number(this.getIndex(field));
    const fieldName = isNaN(index) ? field : this.getFieldName(field);
    for (const field of this.settings.validation.fields) {
      if (field.list) {
        for (const rule of field.rules) {
          if (rule.property == fieldName) {
            return field;
          }
        }
      } else {
        if (field.field == fieldName) {
          return field;
        }
        for (const rule of field.rules) {
          if (rule.property == fieldName) {
            return field;
          }
        }
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

    for (const [key, message] of this.messageStore) {
      if (key && message.length > 0) {
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

    let errors = [];
    for (let [key, message] of this.messageStore) {
      if (key) {
        errors = errors.concat(message);
      }
    }
    return {errors: errors, messages: []};
  }

  /*
   * 関数概要: コールバック関数を追加します。
   * 引数：field フィールド名、callback コールバック関数
   */
  addCallbackStore(field, callback) {
    this.callbackStore.set(field, callback);
  }

  /*
   * 関数概要: Requiredバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateRequired(map) {
    const pairInfo = this.getPairInfo(map);
    if (pairInfo.value || pairInfo.value === 0) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name);

    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Minバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateMin(map) {
    const pairInfo = this.getPairInfo(map);
    if (!pairInfo.value && pairInfo.value !== 0) {
      return;
    }

    if (pairInfo.value >= Number(map.rule.value)) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, map.rule.value);

    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Maxバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateMax(map) {
    const pairInfo = this.getPairInfo(map);
    if (!pairInfo.value && pairInfo.value !== 0) {
      return;
    }

    if (pairInfo.value <= Number(map.rule.value)) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, map.rule.value);
    
    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: MinLengthバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateMinLength(map) {
    const pairInfo = this.getPairInfo(map);
    if (!pairInfo.value && pairInfo.value !== 0) {
      return;
    }

    if ((pairInfo.value ?? "").length >= map.rule.value) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, map.rule.value);
    
    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: MaxLengthバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateMaxLength(map) {
    const pairInfo = this.getPairInfo(map);
    if (!pairInfo.value && pairInfo.value !== 0) {
      return;
    }

    if ((pairInfo.value ?? "").length <= map.rule.value) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, map.rule.value);
    
    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Lengthバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateLength(map) {
    const pairInfo = this.getPairInfo(map);
    if (!pairInfo.value && pairInfo.value !== 0) {
      return;
    }

    if ((pairInfo.value ?? "").length >= map.rule.min && (pairInfo.value ?? "").length <= map.rule.max) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, map.rule.min, map.rule.max);
    
    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Rangeバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateRange(map) {
    const pairInfo = this.getPairInfo(map);
    if (!pairInfo.value && pairInfo.value !== 0) {
      return;
    }

    if (pairInfo.value >= Number(map.rule.min) && pairInfo.value <= Number(map.rule.max)) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, map.rule.min, map.rule.max);

    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Regexバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateRegex(map) {
    const pairInfo = this.getPairInfo(map);
    if (!pairInfo.value && pairInfo.value !== 0) {
      return;
    }

    const re = new RegExp(map.rule.value);
    if (re.test((pairInfo.value ?? ""))) {
      return;
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, map.rule.value);
    
    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: Compareバリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        rule validationルール
   *        item リストアイテム
   *        rowindex 行インデックス
   *        colindex 列インデックス
   */
  validateCompare(map) {
    const pairInfo = this.getPairInfo(map);
    let arg1 = pairInfo.value; 
    let arg2 = pairInfo.target; 
    const operator = map.rule.operator ?? "";
    const type = map.rule.type ?? "";

    if (type.toLowerCase().trim() == "date") {
        arg1 = new Date(arg1).getTime();
        arg2 = new Date(arg2).getTime();
    }

    if (type.toLowerCase().includes("number")) {
      arg1 = Number(arg1);
      arg2 = Number(arg2);
    }

    let message = this.getCommonMessage(map.rule.message);
    let name = map.item ? `${map.field.name}${map.rowindex + 1}` : map.field.name;
    message = this.formatMessage(message, name, arg1, arg2);

    switch(operator.toLowerCase().trim()) {
      case "<": {
        if (arg1 < arg2) {
          return;
        }
        break;
      }
      case "<=": {
        if (arg1 <= arg2) {
          return;
        }
        break;
      }
      case ">": {
        if (arg1 > arg2) {
          return;
        }
        break;
      }
      case ">=": {
        if (arg1 >= arg2) {
          return;
        }
        break;
      }
      case "==": {
        if (arg1 === arg2) {
          return;
        }
        break;
      }
      case "!=": {
        if (arg1 !== arg2) {
          return;
        }
        break;
      }
      default: {
        if (arg1 === arg2) {
          return;
        }
        break;
      }
    }

    const messages = this.messageStore.get(pairInfo.fieldName) ?? [];
    messages.push(message);
    this.messageStore.set(pairInfo.fieldName, messages);
  }

  /*
   * 関数概要: バリデーションを実行します。
   * 引数：map パラメータ
   *        field validation定義
   *        item リストアイテム
   *        rowindex 行インデックス
   */
  execute(map)  {
    for (let i =0; i < map.field.rules.length; i++) {
      const rule = map.field.rules[i];
      const param = {
        field: map.field,
        rule: rule,
        item: map.item,
        rowindex: map.rowindex
      };
      switch(rule.type) {
        case "required": {
          this.validateRequired(param);
          break;
        }
        case "min": {
          this.validateMin(param);
          break;
        }
        case "max": {
          this.validateMax(param);
          break;
        }
        case "minlength": {
          this.validateMinLength(param);
          break;
        }
        case "maxlength": {
          this.validateMaxLength(param);
          break;
        }
        case "length": {
          this.validateLength(param);
          break;
        }
        case "range": {
          this.validateRange(param);
          break;
        }
        case "regex": {
          this.validateRegex(param);
          break;
        }
        case "compare": {
          this.validateCompare(param);
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
   * 引数：map パラメータ
   *       setting validation定義
   *       rule ルール
   *       item アイテム
   *       rowindex 行インデックス
   *       colindex 列インデックス
   */
  getPairInfo(map) {
    let value;
    let target;
    let fieldName;
    if (map.item) {
      if (map.rule.target) {
        target = map.item[map.rule.target];
      }
      if (map.rule.default) {
        target = map.rule.default;
      }
      if (map.rule.checkbox) {
        const checked = document.querySelector(
                          map.rule.checkbox.replaceAll("{rowindex}",
                          map.rowindex)).checked;
        if (checked) {
          value = checked;
        } else {
          value = target;
        }
      } else {
        value = map.item[map.property];
      }
      fieldName = this.getIndexedFieldName(map.rule.property, map.rowindex);
    } else {
      if (map.rule.target) {
        target = this.getVueData(map.field.field, map.rule.property);
      }
      if (map.rule.default) {
        target = map.rule.default;
      }
      if (map.rule.checkbox) {
        const checked = document.querySelector(
                          map.rule.checkbox.replaceAll("{rowindex}",
                          map.rowindex)).checked;
        if (checked) {
          value = checked;
        } else {
          value = target;
        }
      } else {
        value = this.getVueData(map.field.field, map.rule.property);
      }
      fieldName = map.rule.property ? map.rule.property : map.field.field;
    }

    return { value: value, target: target, fieldName: fieldName };
  }

  /*
   * 関数概要: フィールド名を返却します。
   * 引数：field フィールド名
   */
  getFieldName(field) {
    const index = Number(this.getIndex(field));
    if (isNaN(index)) {
      return field;
    }
    let list = field.split("_");
    return list.slice(0, list.length - 1).join("_");
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
    const index = field.split("_");
    return index[index.length - 1];
  }

  /*
   * 関数概要: Vueコンポーネントが保持しているデータを返却します。
   * 引数：field フィールド名、property プロパティ名
   */
  getVueData(field, property) {
    if (!property) {
      return this.vue[field];
    }
    
    const data = this.vue[field];
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