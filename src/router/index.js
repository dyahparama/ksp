import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";

import { LocalStorage } from "quasar";
import { Platform } from "quasar";
Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default async function({ store }) {
  let baseURL = store.state.GlobalData.baseURL;
  let ws = store.state.WebService;
  let response = await store.dispatch("WebService/post", {
    url: `${baseURL}api/getModulData/`,
    data: {
      token: ws.token,
      key: ws.key,
      sortBy: "nama_modul",
      sortType: "ASC",
      withDetail: 1,
      filter: {
        userID: ws.id
      }
    }
  });
  store.commit("GlobalData/setModuls", response.data);
  let moduls = store.state.GlobalData.moduls;
  if (moduls.length && routes[0].children.length == 1) {
    moduls.forEach(element => {
      routes[0].children.push({
        path: `data/${element.uri_segment}`,
        component: () => import("pages/ListPage/ListPage.vue"),
        name: `data-${element.uri_segment}`,
        props: () => ({
          idModul: element.ID
        })
      });
      routes[0].children.push({
        path: `data/${element.uri_segment}/:id`,
        component: () => import("pages/ListDetailPage/ListDetailPage.vue"),
        name: `detail-${element.uri_segment}`,
        props: route => ({
          idData: route.params.id
        })
      });
    });
  }
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  window.popStateDetected = false;
  window.addEventListener("popstate", () => {
    window.popStateDetected = true;
  });

  Router.beforeEach((to, from, next) => {
    const IsItABackButton = window.popStateDetected;
    window.popStateDetected = false;
    if (IsItABackButton) {
      // if (!(from.name == "home-page" || from.name == "login-page")) {
      //   if (from.name.includes("data-")) {
      //     Router.replace({ name: "home-page" });
      //   } else if (from.name.includes("detail-")) {
      //     let str = from.name.replace("detail-", "data-");
      //     Router.push({ name: str });
      //   } else if (from.name.includes("password-page")) {
      //     Router.replace({ name: "login-page" });
      //   } else if (from.name.includes("kontrak")) {
      //     next();
      //   }
      // } else {
      //   next(false);
      //   return "";
      // }
    }
    const publicPages = [
      "login-page",
      "validate-password-page",
      "reset-password-page"
    ];
    const authRequired = !publicPages.includes(to.name);
    let login = false;
    if (store.state.WebService.token) {
      login = true;
    } else if (LocalStorage.getItem("identity") && !Platform.is.cordova) {
      let data = LocalStorage.getItem("identity");
      data = JSON.parse(data);
      store.commit("WebService/setIdentity", {
        token: data.token,
        key: data.key,
        uuid: data.uuid,
        userID: parseInt(data.userID)
      });
      login = true;
    } else if (Platform.is.cordova) {
      // eslint-disable-next-line no-undef
      sayang.getUser(y => {
        let data = JSON.parse(y);
        if (data.length) {
          data = JSON.parse(data[0].json_data);
          store.commit("WebService/setIdentity", {
            token: data.token,
            key: data.key,
            uuid: data.uuid,
            userID: parseInt(data.userID)
          });
          login = true;
          if (authRequired) {
            if (login) {
              next();
            } else {
              Router.replace("login");
            }
          } else {
            if (login) {
              Router.replace("/home");
            } else {
              next();
            }
          }
        }
      });
    }
    if (authRequired) {
      if (login) {
        next();
      } else {
        Router.replace("login");
      }
    } else {
      if (login) {
        Router.replace("/home");
      } else {
        next();
      }
    }
  });

  return Router;
}
