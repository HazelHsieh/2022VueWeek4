import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js'; 

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'hazel_vue';
let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      products: [],
      isNew: false,//確認是編輯或新增所使用的
      tempProduct: {
        imagesUrl: [],
      },
      page:{}
    };
  },
  methods: {
    checkSignin() {
      const data = `${url}/api/user/check`;
      axios.post(data)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    // 帶參數來決定變數
    getData(page = 1) {// 先預設是1
      const data = `${url}/api/${path}/admin/products/?page=${page}`;
      axios.get(data).then((response) => {
        this.products = response.data.products;
        // 把 page 資訊存起來
        this.page = response.data.pagination;
        console.log(response.data);
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    updateProduct() {
      let data = `${url}/api/${path}/admin/product`;
      let http = 'post';

      if (!this.isNew) {
        data = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](data, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    openModal(isNew, item) {
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    delProduct() {
      const data = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;

      axios.delete(data).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
  components:{
    pagination,
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    //  取得 Token（Token 僅需要設定一次）
    //                                                   前面自定義名稱
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // axios 登入抓住 token 
    axios.defaults.headers.common['Authorization'] = token;

    this.checkSignin();
  }
})

app.component('product-modal',{
  props:['tempProduct', 'updateProduct'],
  template:'#product-modal-template',
});


app.mount('#app');