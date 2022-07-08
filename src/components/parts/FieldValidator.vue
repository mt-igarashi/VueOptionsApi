<template>
  <div>
    <template v-if="tooltip">
      <abbr v-if="message" class="error-tooltip" :data-title="message">&nbsp;&nbsp;&nbsp;&nbsp;</abbr>
      <slot name="control" :executor="executor"></slot>
    </template>
    <template v-else>
      <slot name="control" :executor="executor"></slot>
      <div v-if="message && !tooltip" class="alert alert-danger error-msg">
        {{message}}
      </div>
    </template>
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
    tooltip: {
      type: Boolean,
      default: false
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
      console.log(errors.errors.length);
      if (message) {
        this.executor.css = [this.css, "field-error"];        
        this.message = message;
      } else {
        this.executor.css = [this.css];
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
abbr {
  position: absolute;
  width: fit-content;
  height: fit-content;
}

abbr:hover:after {
  content: attr(data-title);
  position: sticky;
  color: #721c24;
  background-color: #f8d7da;
  padding: 4px 5px;
  bottom: 0; right: 0;
  transform: translate(100%, 100%);
  border-radius: 5px 5px 5px 5px;
  white-space: nowrap;
}
</style>
