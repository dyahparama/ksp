const routes = [
  {
    path: "/",
    redirect: "/home",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      {
        path: "home",
        component: () => import("pages/Home/Home.vue"),
        name: "home-page",
        props: { name: "Dashboard" }
      }
    ]
  },
  {
    path: "/history",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      {
        path: "/kontrak/:id",
        component: () =>
          import("pages/HistoryKontrakPage/HistoryKontrakPage.vue"),
        name: "history-kontrak",
        props: route => ({
          paramKode: route.params.id
        })
      },
      {
        path: "/piutang",
        component: () => import("pages/HistoryPiutang/HistoryPiutang.vue"),
        name: "history-piutang"
      }
    ]
  },
  {
    path: "/auth",
    component: () => import("layouts/flat.vue"),
    children: [
      {
        path: "/login",
        component: () => import("pages/LoginPage/LoginPage.vue"),
        name: "login-page"
      },
      {
        path: "/resetPassword",
        component: () =>
          import("pages/ResetPasswordPage/ResetPasswordPage.vue"),
        name: "reset-password-page"
      },
      {
        path: "/resetPassword/:id",
        component: () =>
          import("pages/ResetPasswordPage/ResetPasswordPage.vue"),
        name: "validate-password-page",
        props: route => ({
          paramKode: route.params.id
        })
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
