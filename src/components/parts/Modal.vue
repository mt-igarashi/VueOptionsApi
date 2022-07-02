<template>
<div v-if="this.getShow()" class="modal_wrap">
  <div class="modal_overlay">
    <label for="trigger" class="modal_trigger"></label>
    <div class="modal_content">
      <label for="trigger" class="close_button" @click="this.execute('cancel')">✖️</label>
        <p class="modal_title">{{this.getTitle()}}</p>
        <p class="modal-message mx-auto">{{this.getMessage()}}</p>
      <template v-if="this.getType() == this.constants.DaialogOk">
      <div class="modal-ok mx-auto">
        <a href="#" class="btn btn-primary btn-m active modal-ok" role="button" aria-pressed="true" @click="execute('ok')">OK</a>
      </div>
      </template>
      <template v-if="this.getType() == this.constants.DaialogOkCancel">
      <div class="modal-okcancel mx-auto">
        <a href="#" class="btn btn-primary btn-m active modal-ok" role="button" aria-pressed="true" @click="execute('ok')">OK</a>
        <a href="#" class="btn btn-primary btn-m active ml-3 modal-cancel" role="button" aria-pressed="true" @click="execute('cancel')">Cancel</a>
      </div>
      </template>

    </div>
  </div>
</div>
</template>

<script>
import constants from '../../js/constants'
import utils from '../../js/utils'

export default {
  name: "Modal",
  props: {
    daialog: {
      type: Object
    }
  },
  computed: {
    constants: function() {
      return constants.instance;
    },
    utils: function() {
      return utils.instance;
    }
  },
  methods: {
    getTitle: function() {
      let params = this.daialog ?? { title: "" };
      return params.title ?? "";
    },
    getMessage: function() {
      let params = this.daialog ?? { message: "" };
      return params.message ?? "";
    },
    getShow: function() {
      let params = this.daialog ?? { show: false };
      return params.show ?? false;
    },
    getType: function() {
      let params = this.daialog ?? { type: this.constants.DaialogOkCancel };
      return params.type ?? this.constants.DaialogOkCancel;
    },
    execute: async function(type) {
      var params = this.daialog ?? { ok: () => {} };
      if (type == "ok") {
        let ok = params.ok ?? function() {};
        if (this.utils.isAsync(ok)) {
          console.log("async executed");
          await ok();
        } else {
          ok();
        }
        params.show = false;
      }
      
      if (type == "cancel") {
        let cancel = params.cancel ?? function() {};
        if (this.utils.isAsync(cancel)) {
          await cancel();
        } else {
          cancel();
        }
        params.show = false;
      }
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
