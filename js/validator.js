export default class Validator {
  /*
   * 関数概要: コンストラクタ
   */
  constructor(vue, settings) {
    this.vue = vue;
    this.settings = settings;
    this.messageStore = new Map();
    this.settings.validation.forEach(x => {
      this.messageStore.set(x.field, []);
    });
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
    this.messageStore.set(setting.field, []);
    this.execute(setting);
    
    let hasError = this.hasError(setting.field);
    this.vue.messages = this.ConvertErrorMessage();
    return !hasError;
  }

  /*
   * 関数概要: バリデーションを実行します。
   */
  validate() {
    this.settings.validation.forEach(x => {
      this.messageStore.set(x.field, []);
      this.execute(x);
    });
    
    let hasError = this.hasError();
    this.vue.messages = this.ConvertErrorMessage();
    return !hasError;
  }

  /*
   * 関数概要: エラーメッセージを取得します。
   * 引数：field フィールド名
   */
  getErrorMessage(field) {
    let error = (this.messageStore.get(field) ?? []);
    return error.length == 0 ? "" : error[0];
  }

  /*
   * 関数概要: settingを取得します。
   * 引数：field フィールド名
   */
  getSetting(field) {
    let result = null;
    this.settings.validation.forEach(x => {
      if (x.field == field) {
        result = x;
        return true;
      }
    });
    return result;
  }

  /*
   * 関数概要: エラーが存在するか検証します。
   * 引数：field フィールド名
   */
  hasError(field) {
    if (field) {
      return (this.messageStore.get(field) ?? []).length > 0;
    }

    let hasError = false;
    this.settings.validation.forEach(x => {
        if ((this.messageStore.get(x.field) ?? []).length > 0) {
          hasError = true;
          return true;
        }
    });
    return hasError;
  }

  /*
   * 関数概要: 存在しているエラーをエラーメッセージに変換します。
   * 引数：field フィールド名
   */
  ConvertErrorMessage(field) {
    if (field) {
      return {errors: [], messages: this.messageStore.get(field) ?? []};
    }

    let result = [];
    this.settings.validation.forEach(x => {
        let messages = this.messageStore.get(x.field) ?? [];
        result = result.concat(messages);
    });
    return {errors: result, messages: []};
  }

  /*
   * 関数概要: Requiredバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateRequired(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] : null; 
    if (value) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, rule.name);
    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);
    
    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: Minバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateMin(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] : null;  
    if (value >= rule.value) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, rule.name, rule.value);
    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);

    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: Maxバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateMax(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] : null;  
    if (value <= rule.value) {
      return;
    }
    
    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, rule.name, rule.value);
    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);

    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: MinLengthバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateMinLength(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] ?? "" : ""; 
    if (value.length >= rule.value) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, rule.name, rule.value);
    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);

    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: MaxLengthバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateMaxLength(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] ?? "" : ""; 
    if (value.length <= rule.value) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, rule.name, rule.value);
    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);

    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: Lengthバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateLength(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] ?? "" : ""; 
    if (value.length >= rule.min && value.length <= rule.max) {
      return;
    }

    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, rule.name, rule.min, rule.max);
    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);

    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: Rangeバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateRange(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] : null; 
    if (value >= rule.min && value <= rule.max) {
      return;
    }

    let message = this.getCommonMessage(setting.message);
    message = this.formatMessage(message, rule.name, rule.min, rule.max);
    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);

    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: Regexバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateRegex(setting, rule) {
    let entity = this.vue[rule.prefix];
    let value = entity ? entity[setting.field] ?? "" : ""; 
    let re = new RegExp(rule.value);
    if (re.test(value)) {
      return;
    }

    let messages = this.messageStore.get(setting.field) ?? [];
    messages.push(message);
    let message = this.getCommonMessage(rule.message);
    message = this.formatMessage(message, rule.name, rule.value);
    
    this.messageStore.set(setting.field, messages);
  }

  /*
   * 関数概要: Compareバリデーションを実行します。
   * 引数：setting validation定義、rule validationルール
   */
  validateCompare(setting, rule) {
    let entity = this.vue[rule.prefix];
    let arg1 = entity ? entity[setting.field] : null; 
    let arg2 = entity ? entity[rule.target] : null; 
    let method = rule.method ?? 0;
    let type = rule.type ?? "";

    if ((arg1 == null || arg1 == typeof undefined) || (arg2 == null || arg2 == typeof undefined)) {
      return;
    }

    if (type.ToLower() == "date") {
        arg1 = arg1 ? arg1.getTime() : 0;
        arg2 = arg2 ? arg2.getTime() : 0;
    }

    if (method == -1) {
      if (arg1 >= arg2) {
        let message = this.getCommonMessage(rule.message);
        message = this.formatMessage(message, rule.name, arg1, arg2);
        let messages = this.messageStore.get(setting.field) ?? [];
        messages.push(message);

        this.messageStore.set(setting.field, messages);
        return;
      }
    }

    if (method == 0) {
      if (arg1 != arg2) {
        let message = this.getCommonMessage(setting.message);
        message = this.formatMessage(message, setting.name, arg1, arg2);
        let messages = this.messageStore.get(setting.field) ?? [];
        messages.push(message);

        this.messageStore.set(setting.field, messages);
        return;
      }
    }

    if (method == 1) {
      if (arg1 <= arg2) {
        let message = this.getCommonMessage(setting.message);
        message = this.formatMessage(message, setting.name, arg1, arg2);
        let messages = this.messageStore.get(setting.field) ?? [];
        messages.push(message);

        this.messageStore.set(setting.field, messages);
      }
    }
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

  /*
   * 関数概要: バリデーションを実行します。
   * 引数：setting validation定義
   */
  execute(setting) {
    setting.rules.forEach(x => {
      switch(x.type) {
        case "required": {
          this.validateRequired(setting, x);
          break;
        }
        case "min": {
          this.validateMin(setting, x);
          break;
        }
        case "max": {
          this.validateMax(setting, x);
          break;
        }
        case "minlength": {
          this.validateMinLength(setting, x);
          break;
        }
        case "maxlength": {
          this.validateMaxLength(setting, x);
          break;
        }
        case "length": {
          this.validateLength(setting, x);
          break;
        }
        case "range": {
          this.validateRange(setting, x);
          break;
        }
        case "regex": {
          this.validateRegex(setting, x);
          break;
        }
        case "compare": {
          this.validateCompare(setting, x);
          break;
        }
        default: {
          console.log("validation type can't be matched")
        }
      }
    });
  }

  /*
   * 関数概要: バリデーションを実行します。
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
}