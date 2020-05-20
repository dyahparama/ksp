<template>
  <div id="q-app">
    <router-view :key="keyApp" />
  </div>
</template>

<script>
import Pusher from "pusher-js";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import _ from "lodash";
export default {
  name: "App",
  data() {
    return {
      keyApp: this.$router.currentRoute.fullPath,
      dataPusher: {
        cluster: "",
        apikey: "",
        channelNm: "my-channel",
        event: "test-event"
      }
    };
  },
  mounted() {
    const _this = this;
    this.dataPusher.apikey = this.pusher.key;
    this.dataPusher.cluster = this.pusher.cluster;
    window.addEventListener("unload", _this.handler);
    document.addEventListener("backbutton", _this.onBackKeyDown, false);
    if (this.$q.platform.is.cordova) {
      // eslint-disable-next-line no-undef
      universalLinks.subscribe("doResetPassword", _this.resetPassword);
      this.initPusherAndroid();
    }
    this.initPusher();
  },
  computed: {
    ...mapState("WebService", ["token", "key", "uuid", "userID"]),
    ...mapState("GlobalData", ["moduls", "pusher"])
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    resetPassword(eventData) {
      this.$router.push("/login");
      this.$router.push("/resetPassword/" + eventData.params.kode);
    },
    onBackKeyDown() {
      if (
        this.$router.currentRoute.name == "login-page" ||
        this.$router.currentRoute.name == "home-page"
      ) {
        if (this.$q.platform.is.cordova) {
          navigator.app.exitApp();
        }
      } else if (this.$router.currentRoute.name.includes("password")) {
        this.$router.replace("/login");
      } else {
        if (this.$router.currentRoute.name.includes("data-")) {
          this.$router.replace({ name: "home-page" });
        } else if (this.$router.currentRoute.name.includes("detail-")) {
          let str = this.$router.currentRoute.name.replace("detail-", "data-");
          this.$router.push({ name: str });
        }
      }
    },
    handler() {
      const _this = this;
      if (this.token) {
        let data = {
          token: _this.token,
          key: _this.key,
          uuid: _this.uuid,
          userID: parseInt(_this.userID)
        };
        if (!this.$q.platform.is.cordova) {
          this.$q.localStorage.set("identity", JSON.stringify(data));
        }
      }
      return null;
    },
    ...mapMutations("WebService", ["setIdentity"]),
    ...mapMutations("GlobalData", ["setBarTitle"]),
    initPusherAndroid() {
      let self = this;
      // eslint-disable-next-line no-undef
      sayang.coolMethod(JSON.stringify(self.dataPusher), x => {
        let dataNotif = JSON.parse(x);
        if (dataNotif.type == "notifModul") {
          let idModul = _.findIndex(this.moduls, function(o) {
            return o.ID == dataNotif.modul;
          });
          let modulNow = this.moduls[idModul];
          this.setBarTitle(modulNow.nama_modul);
          this.$router.push(`/data/${modulNow.uri_segment}/${dataNotif.row}`);
        }
      });
    },
    initPusher() {
      let self = this;
      const socket = new Pusher(self.dataPusher.apikey, {
        cluster: self.dataPusher.cluster,
        forceTLS: true
      });
      const channel = socket.subscribe(self.dataPusher.channelNm);
      channel.bind(self.dataPusher.event, function(data) {
        if (self.userID == data.id && self.uuid != data.uuid) {
          self.setIdentity({
            token: "",
            key: "",
            uuid: "",
            userID: ""
          });
          if (!self.$q.platform.is.cordova) {
            self.$q.localStorage.remove("identity");
          } else {
            // eslint-disable-next-line no-undef
            sayang.deleteUser();
          }
          self.$router.replace("/login");
        }
      });
    }
  }
};
</script>

<style></style>
