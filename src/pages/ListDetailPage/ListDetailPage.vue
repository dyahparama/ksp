<template>
  <q-page v-show="isShowPage">
    <div class="column full-width" style="height:100%">
      <div class="window-width">
        <div class="col-12">
          <q-card>
            <q-tabs
              v-model="tabsDetail"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab
                v-for="(details, index) in dataConsume[0].data.detail"
                :key="'tabsdetail' + index"
                :name="index"
                :label="index"
              />
            </q-tabs>
            <q-separator />

            <q-tab-panels v-model="tabsDetail" animated>
              <q-tab-panel
                v-for="(details, index) in dataConsume[0].data.detail"
                :key="'tabspaneldetail' + index"
                :name="index"
              >
                <q-markup-table wrap-cells dense separator="vertical">
                  <thead>
                    <tr>
                      <th :style="getBgTheme" colspan="2" class="text-center ">
                        <span class="text-subtitle1 text-white"
                          >Detail {{ index }}</span
                        >
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(detail, index2) in details"
                      :key="'trdetail' + index2"
                    >
                      <td class="text-left">{{ detail.label }}</td>
                      <td class="text-left">
                        {{ getFormatedData(detail.value, detail.type) }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
    <template>
      <div class="row justify-center q-mb-md">
        <div class="col-12 text-center">
          <span class="text-h6">
            {{ getStatusString(dataConsume[0].status) }}
          </span>
        </div>
        <div
          v-if="dataConsume[0].status == 0"
          class="col-4"
          style="text-align:center"
        >
          <q-btn
            style="width:83.65px"
            class="zem-custom-width"
            :ripple="{ center: true }"
            color="orange"
            label="History"
            :to="{
              name: 'history-kontrak',
              param: { id: dataConsume[0].ID }
            }"
            no-caps
          />
        </div>
        <div
          v-if="
            dataConsume[0].status != -1 &&
              dataConsume[0].status != -2 &&
              dataConsume[0].status == 0
          "
          class="col-4"
          style="text-align:center"
        >
          <q-btn
            style="width:83.65px"
            class="zem-custom-width"
            :ripple="{ center: true }"
            color="red"
            label="Reject"
            @click="submitActionButton(dataConsume[0].ID, -1)"
            no-caps
          />
        </div>
        <div
          v-if="
            dataConsume[0].status != 0 &&
              dataConsume[0].status != -2 &&
              dataConsume[0].status == 0
          "
          class="col-4"
          style="text-align:center"
        >
          <q-btn
            :ripple="{ center: true }"
            color="green"
            label="Outstanding"
            no-caps
            @click="submitActionButton(dataConsume[0].ID, 0)"
          />
        </div>
        <div
          v-if="
            dataConsume[0].status != 1 &&
              dataConsume[0].status != -2 &&
              dataConsume[0].status == 0
          "
          class="col-4"
          style="text-align:center"
        >
          <q-btn
            ref="approve"
            :ripple="{ center: true }"
            class="self-end"
            color="blue"
            label="Approve"
            no-caps
            @click="submitActionButton(dataConsume[0].ID, 1)"
          />
        </div>
      </div>
    </template>
  </q-page>
</template>

<script src="./ListDetailPage.js"></script>

<style lang="stylus" scoped>
#add-border-botom {
  td {
    border-bottom-width: 1px;
  }
}
</style>
