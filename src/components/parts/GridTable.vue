<template>
  <div v-if="items && items.length > 0" class="gridtable-wrapper" :style="tableStyle">
  <table class="gridtable">
    <thead>
      <tr>
        <template v-for="(column, index) in columns" :key="column.id">
        <th :class="getHeaderClass(column)"
            :style="getStyle(column)"
            @click.prevent="headerclick($event, index)">
          <template v-if="column.headertype == 'checkbox'">
            <input type="checkbox"
                   :id="getGridHcbId(0, index)"
                   :name="getGridHcbName(index)"
                   class="gridhcb"
                   @change.prevent="headercheckclick($event, index)">
          </template>
          <template v-else-if="column.headertype == 'button'">
            <template v-for="button in column.headerbuttons" :key="button.value">
              <input type="button"
                     :class="button.class"
                     :style="button.style"
                     :value="button.value"
                     @click.prevent="headerbuttonclick($event, button.value, index)">
            </template>
          </template>
          <template v-else>
            {{column.title}}
          </template>
        </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, rowindex) in items" :key="item.id">
      <tr @click.prevent="rowclick($event, rowindex)">
        <template v-for="(column, colindex) in columns" :key="column.id">
        <td :class="getColumnClass(column)"
            :style="getStyle(column)"
            @click.prevent="cellclick($event, rowindex, colindex)">
          <template v-if="column.type == 'checkbox'">
            <FieldValidator :field="`${column.id}_${rowindex}`" css="gridcb" :tooltip="true" :validator="validator">
              <template v-slot:control="slotProps">
              <input type="checkbox"
                     :id="getGridCbId(rowindex, colindex)"
                     :name="getGridCbName(colindex)"
                     :class="slotProps.executor.css">
              </template>
            </FieldValidator>
          </template>
          <template v-else-if="column.type == 'button'">
            <template v-for="button in column.buttons" :key="button.value">
              <input type="button"
                     :class="button.class"
                     :style="button.style"
                     :value="button.value"
                     @click.prevent="buttonclick($event, button.value, rowindex, colindex)">
            </template>
          </template>
          <template v-else-if="column.type == 'link'">
            <a href="#" @click.prevent="linkclick($event, rowindex, colindex)">{{item[column.id]}}</a>
          </template>
          <template v-else>
            <template v-if="column.converter">
              {{column.converter(item[column.id], item)}}
            </template>
            <template v-else>
              {{item[column.id]}}
            </template>
          </template>
        </td>
        </template>
      </tr>
      </template>
    </tbody>
  </table>
  </div>
</template>

<script>
import Validator from '../../js/validator';
export default {
  name: "GridTable",
  props: {
    columns: {
      type: Array
    },
    items: {
      type: Array
    },
    tableStyle: {
      type: String
    },
    validator: {
      type: Object,
      default: new Validator(this, { validation: [] })
    }
  },
  methods: {
    getHeaderClass: function(column) {
       let cl = [];
       if (column.frozen) {
         cl.push("frozen-header");
       }

       if (column.type == "checkbox") {
         cl.push(" checkable");
       }
       return [cl.join(" "), column.class];
    },
    getColumnClass: function(column) {
       let cl = [];
       if (column.frozen) {
         cl.push("frozen-column");
       }

       if (column.type == "checkbox") {
         cl.push("checkable");
       }
       return [cl.join(" "), column.class];
    },
    getStyle: function(column) {
       let style = "";
       if (column.position) {
         style = `left: ${column.position}`;
       }
       return [style, column.style];
    },
    getGridHcbId: function(rowindex, colindex) {
      return `gridhcb${rowindex}${colindex}`;
    },
    getGridHcbName: function(colindex) {
      return `gridhcb${colindex}`;
    },
    getGridCbId: function(rowindex, colindex) {
      return `gridcb${rowindex}${colindex}`;
    },
    getGridCbName: function(colindex) {
      return `gridcb${colindex}`;
    },
    headerclick: function(event, colindex) {
      const column = this.columns[colindex];
      if (column.headertype == "checkbox") {
        let hcb = document.querySelector(`#${this.getGridHcbName(`0${colindex}`)}`);
        hcb.checked = !hcb.checked;

        let cbList = document.querySelectorAll(`[name="${this.getGridCbName(colindex)}"]`);
        for (let i = 0; i < cbList.length; i++) {
          cbList[i].onchange = () => {
            this.headercheckclick(event, colindex);
            this.validator.validateField(`${this.columns[colindex].id}_${i}`);
          };
        }
        for (const cb of cbList) {
          cb.checked = hcb.checked;
          cb.onchange();
        }
        this.$emit("header-check-click", event, hcb.checked, this.items, colindex);
      }
      this.$emit("header-click", event, this.items, colindex);
    },
    rowclick: function(event, rowindex) {
      this.$emit("row-click", event, this.items[rowindex], rowindex);
    },
    cellclick: function(event, rowindex, colindex) {
      const column = this.columns[colindex];
      if (column.type == "checkbox") {
        let cb = document.querySelector(`#${this.getGridCbId(rowindex, colindex)}`);
        cb.onchange = () => {
          this.checkclick(event, rowindex, colindex);
          this.validator.validateField(`${this.columns[colindex].id}_${rowindex}`);
        };
        cb.checked = !cb.checked;
        cb.onchange();

        let hcb = document.querySelector(`#${this.getGridHcbId(0, colindex)}`);
        const cbList = document.querySelectorAll(`[name="${this.getGridCbName(colindex)}"]`);
        let hasUnchecked = false;

        for (const cb of cbList) {
          if (!cb.checked) {
            hcb.checked = false;
            hasUnchecked = true;
            break;
          }
        }

        if (!hasUnchecked) {
          hcb.checked = true;
        }
      }
      this.$emit("cell-click", event, this.items[rowindex], rowindex, colindex);
    },
    headercheckclick: function(event, colindex) {
      this.$emit("header-check-click", event, event.target.checked, this.items, colindex);
    },
    checkclick: function(event, rowindex, colindex) {
      this.$emit("check-click", event, event.target.checked, this.items[rowindex], rowindex, colindex);
    },
    headerbuttonclick: function(event, value, colindex) {
      this.$emit("header-button-click", event, this.items, value, colindex);
    },
    buttonclick: function(event, value, rowindex, colindex) {
      this.$emit("button-click", event, this.items[rowindex], value, rowindex, colindex);
    },
    linkclick: function(event, rowindex, colindex) {
      this.$emit("link-click", event, this.items[rowindex], rowindex, colindex);
    }
  },
  beforeUpdate: function() {
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      if (column.type == "checkbox") {
        let hcb = document.querySelector(`#${this.getGridHcbId(0, i)}`);
        if(!hcb) {
          continue;
        }
        hcb.checked = false;
      }
    }
    this.validator.initializeMessegeStore(true);
  },
  updated: function() {
    let scroll = document.querySelector(".gridtable-wrapper");
    scroll.scrollLeft = 0;
    scroll.scrollTop = 0;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* テーブル */
.gridtable {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

/* ヘッダー */
.gridtable thead th {
  text-align:center;
  background:#005baa;
  font-weight: bold;
  color:#fff;
  padding: 7px 6px 6px 6px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  border: 1px solid #eee;
  z-index: 1;
}

/* ボディ項目・フッター項目 */
.gridtable tbody th,
.gridtable tfoot th {
  background:#fff;
}

/* ボディデータ・フッターデータ */
.gridtable tbody td,
.gridtable tfoot td {
  text-align:center;
  padding: 6px;
  background: #fff;
}

/* 偶数行１行ごとの色変えが不要なら削除 */
.gridtable tr:nth-child(2n) th,
.gridtable tr:nth-child(2n) td  {
  background: #FBFBF6;
}

/* ヘッダー枠線 */
.gridtable thead .checkable::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

/* ボディデータ・フッターデータ(枠線) */
.gridtable tbody td,
.gridtable tfoot td {
  border: 1px solid #eee;
}

/* セル枠線 */
.gridtable tbody .checkable::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

/* ヘッダー列固定 */
.gridtable .frozen-header {
  /* 横スクロール時に固定する */
  position: -webkit-sticky;
  position: sticky;
  z-index: 3;
}

/* セル列固定 */
.gridtable .frozen-column {
  /* 横スクロール時に固定する */
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
}

.gridtable tbody tr td:first-of-type {
  z-index: 2;
}

/* スクロール領域 */
.gridtable-wrapper {
  overflow: auto;
}
</style>
