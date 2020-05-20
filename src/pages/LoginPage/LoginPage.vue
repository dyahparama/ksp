<template>
  <q-page class="flex flex-center">
    <div :class="`column${bounce ? ' jello-vertical' : ''}`" style="width:80%">
      <div style="z-index:1" class="col-xs-12">
        <q-card square class="shadow-3" style="width:100%">
          <q-card-section class="my-card row" :style="getBgTheme">
            <q-img
              style="max-height:70px"
              class="self-center"
              :src="logoURL ? logoURL : 'statics/img/mge-approval.png'"
              contain
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12">
        <div class="row items-stretch">
          <div class="col">
            <q-card style="width:100%">
              <q-card-section class="row justify-center">
                <q-form
                  @submit="onSubmit"
                  @reset="clearForm"
                  style="width:95%"
                  class="q-gutter-md"
                >
                  <q-input
                    color="primary"
                    v-model="username"
                    label="Username"
                    lazy-rules
                    :rules="[
                      val => (val && val.length > 0) || 'Please input Username'
                    ]"
                  />

                  <q-input
                    color="primary"
                    v-model="password"
                    type="Password"
                    label="Password"
                    lazy-rules
                    :rules="[
                      val =>
                        (val !== null && val !== '') || 'Please input password'
                    ]"
                  />

                  <div class="flex justify-around">
                    <q-btn
                      ref="tombol"
                      label="Submit"
                      type="submit"
                      color="primary"
                    />
                    <q-btn
                      label="Reset"
                      type="reset"
                      color="primary"
                      flat
                      class="q-ml-sm"
                    />
                  </div>
                  <div class="flex justify-around">
                    <q-btn
                      flat
                      no-caps
                      ref="tombol"
                      label="Forgot Password ?"
                      type="submit"
                      color="primary"
                      :to="{ name: `reset-password-page` }"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script src="./LoginPage.js"></script>

<style scoped>
.my-card {
  width: 100%;
  height: 100px;
}
</style>
