import { createApp } from 'vue'
import App from './App'
import router from './route'
import utils from './js/utils'

// VuexStoreを生成
const store = utils.instance.createVuexStore();

const app = createApp(App);
app.use(router).mount('#app');
app.use(store);

// コンポーネントを自動登録します。
utils.instance.loadComponents(app);
