<template>
  <div v-if="total > 0" class="nav-links">
    <template v-if="prevPegeSize > 0">
      <template v-if="prevPegeSize < total">
        <a class="prev page-numbers" href="#" @click.prevent="reloadPage(pageNumber - 1, pageSize)">«</a>
      </template>
      <template v-else>
        <a class="prev page-numbers" href="#" @click.prevent="">«</a>
      </template>
    </template>
    <template v-else>
      <a class="prev page-numbers" href="#" @click.prevent="">«</a>
    </template>
    <template v-for="status in totalPage" :key="status.id">
      <template v-if="status.number == pageNumber">
        <span class="page-numbers current">{{status.number + 1}}</span>
      </template>
      <template v-else>
        <a class="page-numbers" href="#" @click.prevent="reloadPage(status.number, pageSize)">{{status.number + 1}}</a>
      </template>
    </template>
    <template v-if="nextPegeSize < total">
      <a class="page-numbers" href="#" @click.prevent="reloadPage(pageNumber + 1, pageSize)">»</a>
    </template>
    <template v-else>
      <a class="next page-numbers" href="#" @click.prevent="">»</a>
    </template>
  </div>
</template>

<script>
export default {
  name: "PagingLink",
  props: {
    pageNumber: {
      required: true,
      type: Number
    },
    pageSize: {
      required: true,
      type: Number
    },
    total: {
      required: true,
      type: Number
    },
    name: {
      required: true,
      type: String
    }
  },
  computed: {
    totalPage: function() {
      let count = Math.ceil(this.total / this.pageSize);
      let result = [];
      for (let i = 0; i < count; i++) {
        result.push({number: i, id: i.toString()});
      }
      return result;
    },
    prevPegeSize: function() {
      return ((this.pageNumber - 1) * this.pageSize) + this.pageSize;
    },
    nextPegeSize: function() {
      return (this.pageNumber * this.pageSize) + this.pageSize;
    }
  },
  methods: {
    reloadPage: function(page, size) {
      this.$router.push({name: this.name, params: {state: 'recovery'}, query: {pageNumber: page, pageSize: size}});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-links{
  margin-top: 4px;
  padding:1px;
  display:flex;
  justify-content:center;
  background:#f3f3f3;
}
a,span{
  width:50px;
  height:50px;
  margin:2px;
  line-height:50px;
  text-align:center;
  font-size:14px;
  font-weight:bold;
  text-decoration:none;
  background:#fff;
  color:#222;
  transition:.3s;
}
a:hover{
  background:gold;
  border-radius:100%;
  transform:rotate(360deg);
}
.current{
  background:gold;
  border-radius:100%;
}
.dots{
  background:none;
}
</style>
