/* eslint-disable no-unused-vars */
import { dom } from "quasar";
import { setTimeout } from "timers";
import { uid } from "quasar";
import Vue from "vue";
const { height, width } = dom;

export default {
  name: "login",
  mixins: [Vue.prototype.$mixinStore],
  data() {
    return {
      username: "",
      password: "",
      bounce: false
    };
  },
  computed: {
    getBgTheme() {
      return {
        "background-color": this.theme
      };
    },
    getTextTheme() {
      return {
        color: this.theme
      };
    }
  },
  methods: {
    onSubmit() {
      let _this = this;
      this.post({
        url: `${_this.baseURL}api/login`,
        data: {
          email: this.username,
          password: this.password,
          device_id: uid(),
          companyID: this.appID
        }
      }).then(values => {
        if (values.info == "success") {
          this.setIdentity({
            token: values.data.token,
            key: values.data.key,
            uuid: values.data.uuid,
            userID: parseInt(values.data.userID)
          });
          let data = {
            token: values.data.token,
            key: values.data.key,
            uuid: values.data.uuid,
            userID: parseInt(values.data.userID)
          };
          if (!this.$q.platform.is.cordova) {
            this.$q.localStorage.set("identity", JSON.stringify(data));
          } else {
            // eslint-disable-next-line no-undef
            sayang.insertUser(JSON.stringify(data));
            //window.location.reload();
          }
          this.$router.push("/home");
        } else {
          this.showNotif(values.message);
          this.removeJello();
        }
      });
    },
    clearForm() {
      this.username = "";
      this.password = "";
    },
    removeJello() {
      this.bounce = true;
      const _this = this;
      setTimeout(() => {
        _this.bounce = false;
      }, 1000);
    }
  },
  mounted() {}
};
