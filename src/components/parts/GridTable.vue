<template>
  <div class="gridtable-wrapper" :style="tableStyle">
  <table class="gridtable">
    <thead>
      <tr>
        <template v-for="(column, index) in columns" :key="column.id">
        <th :class="getHeaderClass(column)"
            :style="getStyle(column)"
            @click.prevent="headerclick($event, index)">
          <template v-if="column.headertype == 'checkbox'">
            <input class="gridhcb"
                   type="checkbox"
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
            <input class="gridcb"
                   type="checkbox"
                   :name="getGridCbName(colindex)"
                   @change.prevent="checkclick($event, rowindex, colindex)">
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
          <template v-if="column.type == 'link'">
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
    }
  },
  methods: {
    getHeaderClass: function(column) {
       let cl = "";
       if (column.frozen) {
         cl = "frozen-header";
       }
       return [cl, column.class];
    },
    getColumnClass: function(column) {
       let cl = "";
       if (column.frozen) {
         cl = "frozen-column";
       }
       return [cl, column.class];
    },
    getStyle: function(column) {
       let style = "";
       if (column.position) {
         style = `left: ${column.position}`;
       }
       return [style, column.style];
    },
    getGridCbName: function(colindex) {
      return `gridcb${colindex}`;
    },
    headerclick: function(event, colindex) {
      var column = this.columns[colindex];
      if (column.headertype == "checkbox") {
        let hcb = event.target.querySelector(".gridhcb");
        let cbList = document.querySelectorAll(`[name="${this.getGridCbName(colindex)}"]`);
        if (hcb.checked) {
          hcb.checked = false;
          cbList.forEach((cb) => {
            cb.checked = false;
          });
        } else {
          hcb.checked = true;
          cbList.forEach((cb) => {
            cb.checked = true;
          });
        }
        this.$emit("header-check-click", event, hcb.checked, this.items, colindex);
      }
      this.$emit("header-click", event, this.items, colindex);
    },
    rowclick: function(event, rowindex) {
      this.$emit("row-click", event, this.items[rowindex], rowindex);
    },
    cellclick: function(event, rowindex, colindex) {
      var column = this.columns[colindex];
      if (column.type == "checkbox") {
        let cb = event.target.querySelector(".gridcb");
        if (cb.checked) {
          cb.checked = false;
        } else {
          cb.checked = true;
        }
        this.$emit("check-click", event, cb.checked, this.items[rowindex], rowindex, colindex);
      }
      
      if (column.type == "link") {
        this.$emit("link-click", event, this.items[rowindex], rowindex, colindex);
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
  padding: 6px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
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
.gridtable thead th::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border: 1px solid #eee;
}

/* ボディデータ・フッターデータ(枠線) */
.gridtable tbody td:not(.frozen-column),
.gridtable tfoot td:not(.frozen-column) {
  border: 1px solid #eee;
}

/* セル枠線 */
.gridtable .frozen-column::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border: 1px solid #eee;
}

/* ヘッダー列固定 */
.gridtable .frozen-header {
  /* 横スクロール時に固定する */
  position: -webkit-sticky;
  position: sticky;
  z-index: 2;
}

/* セル列固定 */
.gridtable .frozen-column {
  /* 横スクロール時に固定する */
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
}

/* スクロール領域 */
.gridtable-wrapper {
  overflow: scroll;
}
</style>
