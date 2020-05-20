import Vue from "vue";
export default {
  mixins: [Vue.prototype.$mixinStore],
  name: "detail",
  props: ["idData"],
  data() {
    return {
      dataConsume: [{ data: {} }],
      isShowPage: false,
      isDialog: false,
      tabsDetail: ""
    };
  },

  methods: {
    getStatusString(param) {
      let callback = "";
      switch (param) {
        case 0:
          callback = "Outstanding";
          break;
        case 1:
          callback = "Approved";
          break;
        case -1:
          callback = "Rejected";
          break;
        case -2:
          callback = "Expired";
          break;
        default:
          break;
      }
      return callback;
    },
    submitActionButton(idData, value) {
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/approveListModul`,
        data: {
          token: _this.token,
          key: _this.key,
          idData: idData,
          status: value,
          MemberID: _this.userID
        }
      }).then(values => {
        if (values.info == "success") {
          //_this.loadData();
          _this.showNotif("Success", "green");
          _this.$router.go(-1);
        } else if (values.info == "failed") {
          _this.showNotif(values.msg);
          _this.$router.go(-1);
        } else {
          _this.showNotif();
          _this.$router.go(-1);
        }
      });
    },
    resetData() {
      this.dataConsume = [{ data: {} }];
      this.isShowPage = false;
      this.isDialog = false;
    },
    loadData() {
      this.resetData();
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/getListModulData`,
        data: {
          token: _this.token,
          key: _this.key,
          sortBy: "Created",
          sortType: "ASC",
          filter: {
            ID: _this.idData
          }
        }
      }).then(values => {
        this.isShowPage = true;
        _this.dataConsume = values.data;

        let x = {
          detail: [
            { detail1: _this.dataConsume[0].data.detail },
            { detail2: _this.dataConsume[0].data.detail }
          ]
        };
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(x));
        for (var k in _this.dataConsume[0].data.detail) {
          _this.tabsDetail = k;
          break;
        }
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
