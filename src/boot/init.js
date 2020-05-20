/* eslint-disable prettier/prettier */
import { colors } from 'quasar'
export default async ({ store }) => {
  let data = store.state.GlobalData;
  if (!data.theme && !data.LogoURL) {
   let response = await store.dispatch("WebService/post", {
      url: `${data.baseURL}api/getAppData/`,
      data: {
        app: data.appID,
      }
    });
    
    store.commit("GlobalData/setTheme", response.data.warna);
    store.commit("GlobalData/setPusher", response.data.pusher);
    store.commit("GlobalData/setAppNameDisplay", response.data.nama_app);
    colors.setBrand('primary', response.data.warna)
    store.commit("GlobalData/setLogoURL", response.data.logo);
  }
};
