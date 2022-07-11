<template>
  <div>
    <template v-if="tooltip">
      <slot name="control" :executor="executor"></slot>
      <span v-if="message && loaded" :data-message="message" class="field-tooltip">
        <img class="ml-2" alt="警告" src="../../assets/small_v_error.png">
      </span>
    </template>
    <template v-else>
      <slot name="control" :executor="executor"></slot>
      <img v-if="message && loaded" class="ml-2" alt="警告" src="../../assets/small_v_error.png">
      <img v-if="!message && loaded" class="ml-2" alt="OK" src="../../assets/small_v_ok.png">
      <div v-if="message" class="error-msg">
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
      loaded: false,
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
    callback: function(errors, message) {
      console.log(errors.errors.length);
      this.loaded = true;
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

.field-tooltip {
  position: absolute;
  top: 11px;
  z-index: 3;
}

.field-tooltip:hover:after {
  content: attr(data-message);
  position: absolute;
  color: #721c24;
  background-color: #f8d7da;
  padding: 3px 5px;
  bottom: 20px; right: -5px;
  transform: translate(100%, 100%);
  border-radius: 5px 5px 5px 5px;
  white-space: pre;
  opacity: 0.95;
}
</style>
