import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './route'

const store = createStore({
  state: {
    mscond: {}
  },
  mutations: {
    movieSearch: function(proxy, param) {
       console.log(param);
       proxy.mscond = param;
    }
  },
  actions: {
    movieSearch: function({commit}, param) {
      commit("movieSearch", param);
    }
  }
})

const app = createApp(App);
app.use(router).mount('#app');
app.use(store);


import BaseLayout from './components/parts/BaseLayout.vue'
import GridTable from './components/parts/GridTable.vue'
import Loading from './components/parts/Loading.vue'
import Menu from './components/parts/Menu.vue'
import Messages from './components/parts/Messages.vue'
import PagingLink from './components/parts/PagingLink.vue'
import Modal from './components/parts/Modal.vue'

app.component('BaseLayout', BaseLayout);
app.component('GridTable', GridTable)
app.component('Loading', Loading);
app.component('Menu', Menu);
app.component('Messages', Messages);
app.component('PagingLink', PagingLink);
app.component('Modal', Modal);
