import Vue from "vue";
export default {
  mixins: [Vue.prototype.$mixinStore],
  data() {
    return {
      filter: {
        Project: { label: "", value: "" },
        Programmer: { label: "", value: "" },
        TglPlan: "",
        Jenis: { label: "", value: "" }
      },
      initfilter: {
        Project: { label: "", value: "" },
        Programmer: { label: "", value: "" },
        TglPlan: "",
        Jenis: { label: "", value: "" }
      },
      project: [],
      projectFiltered: [],
      jenis: [],
      jenisFiltered: [],
      internal: [],
      internalFiltered: [],
      loading: false,
      selectedPlan: [],
      dataPlanToday: [],
      pagination: {
        sortBy: "ProjectID",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      initPagination: {
        sortBy: "ProjectID",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: "ProjectID",
          label: "Project",
          align: "left",
          field: row => row.HitungWaktuData.ProjectNama,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "JenisID",
          label: "Jenis",
          align: "center",
          field: row => row.HitungWaktuData.JenisNama,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "Fitur",
          label: "Fitur",
          align: "center",
          field: row => row.HitungWaktuData.Fitur,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "Modul",
          align: "center",
          label: "Modul",
          field: row => row.HitungWaktuData.Modul,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "WaktuPengerjaan",
          align: "center",
          label: "Waktu Pengerjaan",
          field: row => row.WaktuPengerjaan,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "InternalID",
          label: "Programmer",
          align: "center",
          field: row => row.InternalNama.Nama,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "TglPlan",
          label: "Tgl Pengerjaan",
          field: "TglPlan",
          align: "center",
          sortable: true
        }
      ],
      data: [],
      serverURL: ""
    };
  },
  computed: {},
  mounted() {
    this.loadProject();
    this.loadJenis();
    this.loadInternal();
    this.loadData({
      pagination: this.pagination,
      filter: this.initfilter
    });
  },
  watch: {},
  methods: {
    async loadData(props = null) {
      let _this = this;
      if (props == null) {
        props = {
          pagination: this.pagination,
          filter: this.initfilter
        };
      }
      this.loading = true;
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;
      let data = await this.post({
        url: `${_this.baseURL}api/getPlanHarian`,
        data: {
          token: this.token,
          sortBy: sortBy,
          sortType: descending ? "DESC" : "ASC",
          pageNow: page,
          limit: rowsPerPage,
          filter: {
            ID: "",
            TglPlan: _this.formatDateTime(_this.filter.TglPlan, "YYYY-MM-DD"),
            InternalID: filter.Programmer.value,
            ProjectID: filter.Project.value,
            JenisID: filter.Jenis.value
          }
        },
        loading: false
      });
      if (data.info == "success") {
        this.pagination.rowsNumber = data.countData;
        this.data.splice(0, this.data.length, ...data.data);
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;
        this.serverURL = data.baseURL;
        this.loading = false;
      } else {
        this.showNotif();
      }
    },
    loadProject() {
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/getProject`,
        data: {
          token: this.token,
          sortBy: "Nama",
          sortType: "ASC",
          withDetail: 1,
          filter: {}
        }
      }).then(values => {
        if (values.info == "success") {
          let select = this.dataToSelect(values.data, "ID", "Nama");
          this.project = select;
          this.projectFiltered = select;
          this.dataProject = values.data;
          this.serverURL = values.baseURL;
        }
      });
    },
    loadJenis() {
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/getJenis`,
        data: {
          token: this.token,
          sortBy: "Jenis",
          sortType: "ASC",
          withDetail: 1,
          filter: {}
        }
      }).then(values => {
        if (values.info == "success") {
          let select = this.dataToSelect(values.data, "ID", "Jenis");
          this.jenis = select;
          this.jenisFiltered = select;
        }
      });
    },
    loadInternal() {
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/getInternal`,
        data: {
          token: this.token,
          sortBy: "Nama",
          sortType: "ASC",
          withDetail: 1,
          filter: {}
        }
      }).then(values => {
        if (values.info == "success") {
          let select = this.dataToSelect(values.data, "ID", "Nama");
          this.internal = select;
          this.internalFiltered = select;
        }
      });
    },
    filterSelectProject(val, update) {
      if (val === "") {
        update(() => {
          this.projectFiltered = this.project;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.projectFiltered = this.project.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterSelectJenis(val, update) {
      if (val === "") {
        update(() => {
          this.jenisFiltered = this.jenis;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.jenisFiltered = this.jenis.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterSelectInternal(val, update) {
      if (val === "") {
        update(() => {
          this.internalFiltered = this.internal;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.internalFiltered = this.internal.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  }
};
