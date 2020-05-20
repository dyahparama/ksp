import _ from "lodash";
import Vue from "vue";
import { debounce } from "quasar";
export default {
  mixins: [Vue.prototype.$mixinStore],
  props: ["idModul"],
  data() {
    return {
      statusD: {
        label: "Pending",
        value: 2
      },
      statusM: {
        label: "Pending",
        value: 2
      },
      statusType: {
        label: "Or",
        value: 2
      },
      statusTypeOption: [
        { label: "And", value: 1 },
        { label: "Or", value: 2 }
      ],
      statusOptions: [
        {
          label: "Pending",
          value: 0
        },
        {
          label: "Approved",
          value: 1
        },
        {
          label: "Rejected",
          value: -1
        }
      ],
      statusSelected: { label: "Pending", value: 0 },
      datetimeTab: "Date",
      filters: [],
      viewPortW: this.$q.screen.width,
      dataConsume: [],
      dataToShow: [],
      isClearDate: {},
      isClearTime: {},
      isClearDatetime: {},
      columns: []
    };
  },
  computed: {},
  methods: {
    splitDescription(param) {
      return _.split(param, "|", 2);
    },
    resetData() {
      this.datetimeTab = "Date";
      this.filters = [];
      this.viewPortW = this.$q.screen.width;
      this.dataConsume = [];
      this.dataToShow = [];
      this.isClearDate = {};
      this.isClearTime = {};
      this.isClearDatetime = {};
      this.columns = [];
    },
    loadData() {
      this.resetData();
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/getListModulData`,
        data: {
          token: this.token,
          key: this.key,
          sortBy: "Created",
          sortType: "ASC",
          filter: {
            ModulsID: _this.idModul,
            status: this.statusSelected.value
          }
        }
      }).then(values => {
        _this.dataConsume = values.data;
        _this.dataToShow = values.data;
        let cleanData = [];
        values.data.forEach(element => {
          let str = "";
          for (const key in element.data.master) {
            str += key;
          }
          cleanData.push(str);
        });
        let unique = [...new Set(cleanData)];
        // eslint-disable-next-line no-console
        console.log(unique);
        if (unique.length > 1) {
          _this.showNotif(
            "Terdapat perbedaan format antar data, data Tidak dapat di tampilkan"
          );
        } else {
          this.dataToColumn(values.data);
        }
        // _this.filterdata(0);
        // _this.isShowTable = true;
      });
    },
    dataToColumn(param) {
      if (param.length) {
        let data = param;
        let colData = data[0].data.master;
        this.columns = [];
        for (const key in colData) {
          let nmProp = key;
          this.columns.push({
            name: key,
            align: "center",
            label: colData[key].label,
            field: row => row.data.master[key].value,
            format: val => `${val}`,
            sortable: true,
            type: colData[key].type
          });
          //this.$set(this.filters, key, "");
          this.filters.push({
            label: colData[key].label,
            value: "",
            key: nmProp,
            type: colData[key].type
          });
          if (colData[key].type == "date") {
            this.$set(this.isClearDate, nmProp, false);
          }
          if (colData[key].type == "time") {
            this.$set(this.isClearTime, nmProp, false);
          }
          if (colData[key].type == "datetime") {
            this.$set(this.isClearDatetime, nmProp, false);
          }
        }

        this.columns.splice(1, 0, {
          name: "action",
          label: "Detail",
          field: row => row.ID,
          format: val => `${val}`,
          sortable: false
        });
      }
    },
    filterdata() {
      let self = this;
      let filtered = self.dataConsume;
      self.dataToShow = filtered.filter(record => {
        let index = 0;
        for (const key in record.data.master) {
          let nmProp = key;
          if (record.data.master.hasOwnProperty(nmProp)) {
            if (
              !this.compareData(
                record.data.master[nmProp].value,
                self.filters[index].value
              )
            ) {
              return false;
            }
          }
          index++;
        }
        return true;
      });
      //}, delay);
    },
    checkFilter(statusApprove, status) {
      return (
        (statusApprove == 1 && status == 1) ||
        (statusApprove == null && status == 2) ||
        (statusApprove == 0 && status == 3) ||
        status == 0
      );
    },
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
    expand(param) {
      let _this = this;
      this.dataToShow.forEach(element => {
        if (element.ID == param) {
          this.$refs["qTr" + param].props.expand = !this.$refs["qTr" + param]
            .props.expand;
        } else {
          try {
            _this.$refs["qTr" + element.ID].props.expand = false;
            // eslint-disable-next-line no-empty
          } catch (error) {}
        }
      });
    },
    showDatePicker(param, isClearDateKey) {
      if (!this.isClearDate[isClearDateKey]) this.$refs[`` + param][0].show();
      this.isClearDate[isClearDateKey] = false;
    },
    clearTgl(isClearDateKey, indexFilter) {
      this.filters[indexFilter].value = "";
      this.isClearDate[isClearDateKey] = true;
    },
    showTimePicker(param, isClearTimeKey) {
      if (!this.isClearTime[isClearTimeKey]) this.$refs[`` + param][0].show();
      this.isClearTime[isClearTimeKey] = false;
    },
    clearTime(isClearTimeKey, indexFilter) {
      this.filters[indexFilter].value = "";
      this.isClearTime[isClearTimeKey] = true;
    },
    showDatetimePicker(param, isClearDatetimeKey) {
      if (!this.isClearDatetime[isClearDatetimeKey]) {
        this.datetimeTab = "Date";
        this.$refs[`` + param][0].show();
      }
      this.isClearDatetime[isClearDatetimeKey] = false;
    },
    clearDatetime(isClearDatetimeKey, indexFilter) {
      this.filters[indexFilter].value = "";
      this.isClearDatetime[isClearDatetimeKey] = true;
    }
  },
  watch: {
    filters: {
      handler: function() {
        debounce(this.filterdata(), 500);
      },
      deep: true
    },
    $route() {
      this.loadData();
    },
    statusSelected() {
      this.loadData();
    }
  },
  mounted() {
    this.loadData();
  }
};
