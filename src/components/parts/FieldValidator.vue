<template>
  <div>
    <slot name="control" :executor="executor"></slot>
    <div v-if="message" class="alert alert-danger error-msg">
      {{message}}
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: "FieldValidator",
  props: {
    validator: {
      required: true,
      type: Object
    },
    field: {
      required: true,
      type: String
    },
    css: {
      type: String,
      default: ""
    },
    updateFlg: {
      type: String,
    }
  },
  data: function() {
    return {
      message: "",               // エラーメッセージ
      executor: reactive({
        css: [this.css],
        validate: this.validate  // バリデーション関数
      }),
    }
  },
  methods: {
    validate: function() {
      this.validator.validateField(this.field);
    },
    callback: function(hasError, errors, message) {
      console.log(hasError);
      console.log(errors.length);
      if (message) {
        let cssList = ["field-error"];
        if (this.css) {
          cssList.push(this.css);
        }

        this.executor.css = cssList;
        this.message = message;
      } else {
        let cssList = [];
        if (this.css) {
          cssList.push(this.css);
        }

        this.executor.css = cssList;
        this.message = message;
      }
    }
  },
  created: function() {
    this.validator.addCallbackStore(this.field, this.callback);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
