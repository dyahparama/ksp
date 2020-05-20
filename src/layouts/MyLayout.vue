<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar :style="getBgTheme">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>{{ barTitle }}</q-toolbar-title>
        <q-btn @click="reload()" flat round dense icon="refresh" />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <div class="column" style="height: 100vh">
        <div class="col">
          <q-list>
            <q-item-label header :style="getBgTheme" class="text-white"
              >Kategori</q-item-label
            >
            <q-item clickable to="/home">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Home</q-item-label>
              </q-item-section>
            </q-item>
            <template v-for="(data, index) in moduls">
              <q-item
                clickable
                :to="`/data/${data.uri_segment}`"
                @click="changeHeader(data.nama_modul)"
                :key="index"
              >
                <q-item-section avatar>
                  <q-icon name="thumbs_up_down" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ data.nama_modul }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <!-- <q-item
              clickable
              :to="{ name: 'history-piutang' }"
              @click="changeHeader('History Piutang')"
            >
              <q-item-section avatar>
                <q-icon name="thumbs_up_down" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ "History Piutang" }}</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>
        </div>

        <div class="col full-height full-width">
          <q-btn
            style="position:absolute;bottom:15px;left:calc(50% - 60px)"
            color="negative"
            icon="exit_to_app"
            label="LogOut"
            @click="logOut()"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <transition
        appear
        mode="out-in"
        appear-class="invisible"
        appear-to-class="animated slideInDown"
        enter-active-class="animated slideInDown"
        leave-active-class="animated slideOutDown"
      >
        <router-view
          ref="contentPage"
          :key="keyLayout"
          style="animation-duration:0.5s"
        />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import Vue from "vue";
export default {
  name: "MyLayout",
  mixins: [Vue.prototype.$mixinStore],
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      keyLayout: this.$router.currentRoute.fullPath + "layout"
    };
  },
  computed: {},
  methods: {
    changeHeader(param) {
      this.setBarTitle(param);
    },
    logOut() {
      this.setIdentity({
        token: "",
        key: "",
        uuid: "",
        userID: ""
      });
      if (!this.$q.platform.is.cordova) {
        this.$q.localStorage.remove("identity");
      } else {
        // eslint-disable-next-line no-undef
        sayang.deleteUser();
      }
      this.$router.replace("/login");
    },
    getModulData() {
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
            userID: _this.id
          }
        }
      }).then(values => {
        if (values.info == "success") {
          const data = values.data;
          this.setModuls(data);
        } else {
          this.showNotif();
        }
      });
    },
    reload() {
      this.$refs.contentPage.loadData();
    }
  },
  mounted() {
    //this.getModulData();
  }
};
</script>

<style>
.invisible {
  opacity: 0;
}
</style>
