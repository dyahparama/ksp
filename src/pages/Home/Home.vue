<template>
  <q-page class="flex flex-center">
    <div class="column" style="width:80%;margin-bottom: 10px;">
      <template v-for="(data, index) in moduls">
        <q-card class="q-mt-md" :key="`modul${index}`">
          <div :style="getBgTheme">
            <h5
              class="text-center q-py-md clear-margin text-white"
              style="margin-top:0"
            >
              {{ data.nama_modul }}
            </h5>
          </div>
          <q-card-actions align="around">
            <div class="row" style="width:100%">
              <div class="col">
                <div
                  @click="tooltipsApprove = true"
                  class="column content-center"
                >
                  <q-btn flat round color="primary" icon="check" />
                  <p class="text-center">{{ data.approved }}</p>
                </div>
                <q-tooltip v-model="tooltipsApprove">Approved</q-tooltip>
              </div>
              <div class="col">
                <div
                  @click="tooltipsReject = true"
                  class="column content-center"
                >
                  <q-btn flat round color="red" icon="clear" />
                  <p class="text-center">{{ data.rejected }}</p>
                </div>
                <q-tooltip v-model="tooltipsReject">Rejected</q-tooltip>
              </div>
              <div class="col">
                <div
                  @click="tooltipsPending = true"
                  class="column content-center"
                >
                  <q-btn flat round color="teal" icon="hourglass_empty" />
                  <p class="text-center">{{ data.outstanding }}</p>
                </div>
                <q-tooltip v-model="tooltipsPending">Pending</q-tooltip>
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </template>
    </div>
  </q-page>
</template>
<style></style>
<script src="./Home.js"></script>
