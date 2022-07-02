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
.modal_wrap input {
  display: none;
}

.modal_overlay {
  display: flex;
  justify-content: center;
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.5s, transform 0s 0.5s;
  transform: scale(0);
}

.modal_content {
  align-self: center;
  width: 60%;
  padding: 30px 30px 15px;
  box-sizing: border-box;
  background: #fff;
  line-height: 1.4em;
  transition: 0.5s;
}

.modal_content p {
  padding-top: 0;
}

.close_button {
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 24px;
  cursor: pointer;
}

.modal_overlay {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.5s;
}

.modal_overlay .modal_content {
  transform: translateY(20px);
}

.modal_title {
  font-size: 1.5em;
  position: relative;
  overflow: hidden;
  padding-bottom: 10px;
  margin-top:0;
  margin-bottom: 0;
}

.modal-message {
  margin-top:15px;
  min-height: 50px;
  text-align: center;
}

.modal-okcancel {
  width:250px;
}

.modal-ok {
  width:125px;
}

.modal-ok {
  width:100px;
}

.modal-cancel {
  width:100px;
}

.modal_title::before,
.modal_title::after{
  content: "";
  position: absolute;
  bottom: 0;
}

.modal_title:before{
  border-bottom: 4px solid #6bb6ff;
  width: 100%;
}

.modal_title:after{
  border-bottom: 4px solid #c8e4ff;
  width: 100%;
}
</style>
