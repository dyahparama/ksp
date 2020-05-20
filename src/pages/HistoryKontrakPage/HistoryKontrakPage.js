import Vue from "vue";
export default {
  mixins: [Vue.prototype.$mixinStore],
  name: "HistoryKontrakPage",
  props: ["paramKode"],
  data() {
    return {
      lastModulName: "",
      dataHistory: {}
    };
  },
  computed: {
    peminjam() {
      if (this.dataHistory.hasOwnProperty("master")) {
        return this.dataHistory.master.NmMPeminjam.value;
      }
      return "";
    },
    alamat() {
      if (this.dataHistory.hasOwnProperty("master")) {
        return this.dataHistory.master.Alamat.value;
      }
      return "";
    }
  },
  methods: {
    loadData() {
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/getListModulData`,
        data: {
          token: this.token,
          key: this.key,
          sortBy: "Created",
          sortType: "ASC",
          withDetail: 1,
          filter: {
            ID: this.paramKode
          }
        }
      }).then(values => {
        if (values.info == "success") {
          //this.setModuls(values.data);
          this.dataHistory = values.data[0].history_data;
        }
      });
    },
    totalBunga(index) {
      if (
        this.dataHistory.hasOwnProperty("detail") &&
        this.dataHistory.detail[index].hasOwnProperty("DoD")
      ) {
        let total = 0;
        this.dataHistory.detail[index].DoD.forEach(v => {
          total += v.BungaV.value;
        });
        return this.getFormatedData(total, "number");
      }
      return 0;
    }
  },
  mounted() {
    this.lastModulName = this.barTitle;
    this.setBarTitle("History Kontrak");
    this.loadData();
  },
  beforeRouteLeave(to, from, next) {
    this.setBarTitle(this.lastModulName);
    next();
  }
};
