import Vue from "vue";
export default {
  mixins: [Vue.prototype.$mixinStore],
  name: "PageIndex",
  props: ["name"],
  data() {
    return {
      isShowPage: false,
      tooltipsPending: false,
      tooltipsReject: false,
      tooltipsApprove: false
    };
  },
  computed: {
    getBgTheme() {
      return {
        "background-color": this.theme
      };
    }
  },
  watch: {
    tooltipsPending(val) {
      if (val) {
        setTimeout(() => {
          this.tooltipsPending = false;
        }, 2000);
      }
    },
    tooltipsApprove(val) {
      if (val) {
        setTimeout(() => {
          this.tooltipsApprove = false;
        }, 2000);
      }
    },
    tooltipsReject(val) {
      if (val) {
        setTimeout(() => {
          this.tooltipsReject = false;
        }, 2000);
      }
    }
  },
  methods: {
    loadData() {
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/getModulData`,
        data: {
          token: this.token,
          key: this.key,
          sortBy: "nama_modul",
          sortType: "ASC",
          withDetail: 1,
          filter: {
            UserID: this.userID
          }
        }
      }).then(values => {
        if (values.info == "success") {
          this.setModuls(values.data);
        }
      });
    }
  },
  mounted() {
    this.setBarTitle(this.appNameDisplay);
    this.loadData();
  }
};
